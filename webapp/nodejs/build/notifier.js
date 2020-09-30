"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifier = void 0;
const fs_1 = __importDefault(require("fs"));
const web_push_1 = __importDefault(require("web-push"));
const sshpk_1 = __importDefault(require("sshpk"));
const notification_pb_1 = require("../proto/xsuportal/resources/notification_pb");
class Notifier {
    constructor(pool) {
        this.pool = pool;
    }
    async getConnection() {
        return (await this.pool).getConnection();
    }
    getVAPIDKey() {
        if (Notifier.VAPIDKey !== null)
            return Notifier.VAPIDKey;
        if (fs_1.default.existsSync(Notifier.WEBPUSH_VAPID_PRIVATE_KEY_PATH))
            return null;
        const privateKey = sshpk_1.default.parsePrivateKey(fs_1.default.readFileSync(Notifier.WEBPUSH_VAPID_PRIVATE_KEY_PATH), "pem");
        const publicKey = privateKey.toPublic();
        Notifier.VAPIDKey = web_push_1.default.generateVAPIDKeys();
        web_push_1.default.setVapidDetails(Notifier.WEBPUSH_SUBJECT, publicKey.toBuffer('auto').toString(), privateKey.toBuffer('auto', {}).toString());
        return Notifier.VAPIDKey;
    }
    async notifyClarificationAnswered(clar, updated = false) {
        const db = await this.getConnection();
        const contestants = await db.query(clar.disclosed
            ? 'SELECT `id`, `team_id` FROM `contestants`'
            : 'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?', [clar.team_id]);
        for (const contestant of contestants) {
            const clarificationMessage = new notification_pb_1.Notification.ClarificationMessage();
            clarificationMessage.setClarificationId(clar.id);
            clarificationMessage.setOwned(clar.team_id === contestant.team_id);
            clarificationMessage.setUpdated(updated);
            const notification = new notification_pb_1.Notification();
            notification.setContentClarification(clarificationMessage);
            this.notify(notification, contestant.id);
            if (Notifier.VAPIDKey)
                this.notifyWebpush(notification, contestant.id);
        }
    }
    async notifyBenchmarkJobFinished(job) {
        const db = await this.getConnection();
        const contestants = await db.query('SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?', [job.team_id]);
        for (const contestant of contestants) {
            const benchmarkJobMessage = new notification_pb_1.Notification.BenchmarkJobMessage();
            benchmarkJobMessage.setBenchmarkJobId(job.id);
            const notification = new notification_pb_1.Notification();
            notification.setContentBenchmarkJob(benchmarkJobMessage);
            await this.notify(notification, contestant.id);
            if (Notifier.VAPIDKey)
                await this.notifyWebpush(notification, contestant.id);
        }
    }
    async notify(notification, contestantId) {
        const encodedMessage = Buffer.from(notification.serializeBinary()).toString('base64');
        const db = await this.getConnection();
        await db.query('INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))', [contestantId, encodedMessage]);
    }
    async notifyWebpush(notification, contestantId) {
        const message = Buffer.from(notification.serializeBinary()).toString('base64');
        const db = await this.getConnection();
        const subs = await db.query('SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?', [contestantId]);
        const requestOpts = {
            vapidDetails: {
                subject: Notifier.WEBPUSH_SUBJECT,
                ...Notifier.VAPIDKey
            },
        };
        for (const sub of subs) {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            web_push_1.default.sendNotification(pushSubscription, message, requestOpts);
        }
    }
}
exports.Notifier = Notifier;
Notifier.WEBPUSH_VAPID_PRIVATE_KEY_PATH = '../vapid_private.pem';
Notifier.WEBPUSH_SUBJECT = 'xsuportal@example.com';
