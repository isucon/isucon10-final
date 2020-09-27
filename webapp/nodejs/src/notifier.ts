import fs from 'fs';
import webpush from 'web-push';
import sshpk from 'sshpk';

import type { Connection } from 'promise-mysql';
import { Notification } from './proto/xsuportal/resources/notification_pb';

export class Notifier {
  static WEBPUSH_VAPID_PRIVATE_KEY_PATH = '../vapid_private.pem';
  static WEBPUSH_SUBJECT = 'xsuportal@example.com';
  static VAPIDKey: webpush.VapidKeys;
  connection: Promise<Connection>;

  constructor(connection: Promise<Connection>) {
    this.connection = connection;
  }

  getVAPIDKey() {
    if(Notifier.VAPIDKey !== null) return Notifier.VAPIDKey;
    if(fs.existsSync(Notifier.WEBPUSH_VAPID_PRIVATE_KEY_PATH)) return null;
    const privateKey = sshpk.parsePrivateKey(fs.readFileSync(Notifier.WEBPUSH_VAPID_PRIVATE_KEY_PATH), "pem");
    const publicKey = privateKey.toPublic();

    Notifier.VAPIDKey = webpush.generateVAPIDKeys();
    webpush.setVapidDetails(Notifier.WEBPUSH_SUBJECT, publicKey.toBuffer('auto').toString(), privateKey.toBuffer('auto', {}).toString());
    return Notifier.VAPIDKey;
  }

  async notifyClarificationAnswered(clar: NonNullable<any>, updated = false) {
    const db = await this.connection;
    const contestants = await db.query(
      clar.disclosed
        ? 'SELECT `id`, `team_id` FROM `contestants`'
        : 'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?',
      [clar.team_id]
    );

      for (const contestant of contestants) {
        const clarificationMessage = new Notification.ClarificationMessage();
        clarificationMessage.setClarificationId(clar.id);
        clarificationMessage.setOwned(clar.team_id === contestant.team_id);
        clarificationMessage.setUpdated(updated);
        const notification = new Notification();
        notification.setContentClarification(clarificationMessage);
        this.notify(notification, contestant.id);
        if (Notifier.VAPIDKey) this.notifyWebpush(notification, contestant.id);
      }
  }

  async notifyBenchmarkJobFinished(job) {
    const db = await this.connection;
    const contestants = await db.query(
      'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?',
      [job.team_id]
    );

    for (const contestant of contestants) {
      const benchmarkJobMessage = new Notification.BenchmarkJobMessage();
      benchmarkJobMessage.setBenchmarkJobId(job.id);
      const notification = new Notification();
      notification.setContentBenchmarkJob(benchmarkJobMessage);
      await this.notify(notification, contestant.id);
      if (Notifier.VAPIDKey) await this.notifyWebpush(notification, contestant.id);
    }
  }

  async notify(notification: Notification, contestantId) {
    const encodedMessage = Buffer.from(notification.serializeBinary()).toString('base64');
    const db = await this.connection;
    await db.query(
      'INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))',
      [contestantId, encodedMessage]
    );
  }

  async notifyWebpush(notification, contestantId) {
    const message = Buffer.from(notification.serializeBinary()).toString('base64');
    const db = await this.connection;
    const subs = await db.query(
      'SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?',
      [contestantId]
    );

    const requestOpts: webpush.RequestOptions = {
      vapidDetails: {
        subject: Notifier.WEBPUSH_SUBJECT,
        ...Notifier.VAPIDKey
      },
    };

    for (const sub of subs) {
      const pushSubscription: webpush.PushSubscription = {
        endpoint: sub.endpoint,
        keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
        }
      };
      webpush.sendNotification(pushSubscription, message, requestOpts);
    }
  }
}
