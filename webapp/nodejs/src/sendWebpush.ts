import fs from 'fs';
import webpush from 'web-push';
import sshpk from 'sshpk';
import urlBase64 from 'urlsafe-base64';

import type { Connection, ConnectionConfig } from 'promise-mysql';
import { Notification } from '../proto/xsuportal/resources/notification_pb';
import { convertDateToTimestamp } from './app';
import { createConnection } from 'promise-mysql';

const WEBPUSH_SUBJECT = 'xsuportal-debug@example.com';

interface VapidKey {
    privateKey: string
    publicKey: string
}

const dbinfo: ConnectionConfig = {
    host: process.env['MYSQL_HOSTNAME'] ?? '127.0.0.1',
    port: Number.parseInt(process.env['MYSQL_PORT'] ?? '3306'),
    user: process.env['MYSQL_USER'] ?? 'isucon',
    database: process.env['MYSQL_DATABASE'] ?? 'xsuportal',
    password: process.env['MYSQL_PASS'] || 'isucon',
    charset: 'utf8mb4',
    timezone: '+00:00'
  }

const getVapidKey = (path: string): VapidKey => {
    const pri = sshpk.parsePrivateKey(fs.readFileSync(path), "pem");
    const pub = pri.toPublic();
    const privateKey = urlBase64.encode((pri as any).part.d.data)
    const publicKey = urlBase64.encode((pub as any).part.Q.data)
    return { privateKey, publicKey }
}

const getTestNotificationResource = () => {
    const testMessage = new Notification.TestMessage();
    testMessage.setSomething(Math.floor(Math.random() * 10000));
    const notification = new Notification();
    notification.setCreatedAt(convertDateToTimestamp(new Date()));
    notification.setContentTest(testMessage);
    return notification;
}

const insertNotification = async (db: Connection, notification: Notification, contentId) => {
    const message = Buffer.from(notification.serializeBinary()).toString('base64');
    await db.query(
        "INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))",
        [contentId, message]
    );
    const [inserted] = await db.query('SELECT * FROM `notifications` WHERE `id` = LAST_INSERT_ID()')
    return inserted
}

const getPushSubscriptions = async (db: Connection, contestantId) => {
    const subscriptions = await db.query(
        "SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?",
        [contestantId]
    );
    return subscriptions;
}

const sendWebpush = async (vapidKey: VapidKey, notification: Notification, pushSubscription) => {
    const message = Buffer.from(notification.serializeBinary()).toString('base64');
    const requestOpts: webpush.RequestOptions = {
        vapidDetails: {
          subject: `mailto:${WEBPUSH_SUBJECT}`,
          ...vapidKey
        },
      };

    const subscription: webpush.PushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
            p256dh: pushSubscription.p256dh,
            auth: pushSubscription.auth
        }
    };
    const result = await webpush.sendNotification(subscription, message, requestOpts);
    return result;
}

const run = async (path: string, contestantId: string) => {
    if (!path || !contestantId) throw Error('path and contestantId is required')
    const db = await createConnection(dbinfo)
    try {
        const vapidKey = getVapidKey(path)
        const subscriptions = await getPushSubscriptions(db, contestantId)
        if (subscriptions.length === 0) {
            throw new Error(`no push subscriptions found: contestant_id=${contestantId}`)
        }
        const notificationResource = getTestNotificationResource()
        const notification = await insertNotification(db, notificationResource, contestantId)
        notificationResource.setId(notification.id)
        notificationResource.setCreatedAt(convertDateToTimestamp(notification.created_at))
        console.log('Notification: ', notificationResource.toObject())

        for (const subscription of subscriptions) {
            console.log("Sending web push: push_subscription", subscription)
            const result = await sendWebpush(vapidKey, notificationResource, subscription)
            console.log({ result })
        }
        console.log('finished')
    } catch (e) {
        console.error(e)
    } finally {
        await db.end()
    }
}

const [, , contestantId, path] = process.argv
run(path, contestantId)
