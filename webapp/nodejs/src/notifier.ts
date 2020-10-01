import fs from 'fs';
import webpush from 'web-push';
import sshpk from 'sshpk';
import urlBase64 from 'urlsafe-base64';
import util from 'util';

import type { PoolConnection } from 'promise-mysql';
import { Notification } from '../proto/xsuportal/resources/notification_pb';
import { convertDateToTimestamp } from './app';

const sleep = util.promisify(setTimeout);
export class Notifier {
  static WEBPUSH_VAPID_PRIVATE_KEY_PATH = '../vapid_private.pem';
  static WEBPUSH_SUBJECT = 'xsuportal@example.com';
  static VAPIDKey: webpush.VapidKeys;

  constructor() {
    this.getVAPIDKey()
  }

  getVAPIDKey() {
    if(Notifier.VAPIDKey) return Notifier.VAPIDKey;
    if(!fs.existsSync(Notifier.WEBPUSH_VAPID_PRIVATE_KEY_PATH)) return null;
    const pri = sshpk.parsePrivateKey(fs.readFileSync(Notifier.WEBPUSH_VAPID_PRIVATE_KEY_PATH), "pem");
    const pub = pri.toPublic();
    const privateKey = urlBase64.encode((pri as any).part.d.data)
    const publicKey = urlBase64.encode((pub as any).part.Q.data)
    webpush.setVapidDetails(`mailto:${Notifier.WEBPUSH_SUBJECT}`, publicKey, privateKey);
    Notifier.VAPIDKey = { privateKey, publicKey }
    return Notifier.VAPIDKey;
  }

  async notifyClarificationAnswered(clar: NonNullable<any>, db: PoolConnection, updated = false) {
    const contestants = await db.query(
      clar.disclosed
        ? 'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` IS NOT NULL'
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
        const inserted = await this.notify(notification, contestant.id, db);
        if (inserted && Notifier.VAPIDKey) {
          notification.setId(inserted.id);
          notification.setCreatedAt(convertDateToTimestamp(inserted.created_at));
          // TODO Web Push IIKANJINI SHITE
        }
      }
  }

  async notifyBenchmarkJobFinished(job, db: PoolConnection) {
    const contestants = await db.query(
      'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?',
      [job.team_id]
    );

    for (const contestant of contestants) {
      const benchmarkJobMessage = new Notification.BenchmarkJobMessage();
      benchmarkJobMessage.setBenchmarkJobId(job.id);
      const notification = new Notification();
      notification.setContentBenchmarkJob(benchmarkJobMessage);
      const inserted = await this.notify(notification, contestant.id, db);
      if (inserted && Notifier.VAPIDKey) {
        notification.setId(inserted.id);
        notification.setCreatedAt(convertDateToTimestamp(inserted.created_at));
        // TODO Web Push IIKANJINI SHITE
      }
    }
  }

  async notify(notification: Notification, contestantId, db: PoolConnection) {
    const encodedMessage = Buffer.from(notification.serializeBinary()).toString('base64');
    await db.query(
      'INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))',
      [contestantId, encodedMessage]
    );
    let [n] = await db.query('SELECT * FROM `notifications` WHERE `id` = LAST_INSERT_ID() LIMIT 1');
    return n
  }
}
