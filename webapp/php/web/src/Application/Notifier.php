<?php
declare(strict_types=1);

namespace App\Application;

use PDO;
use Xsuportal\Proto\Resources\Notification;
use Xsuportal\Proto\Resources\Notification\ClarificationMessage;

class Notifier
{
    const WEBPUSH_VAPID_PRIVATE_KEY_PATH = '../vapid_private.pem';
    const WEBPUSH_SUBJECT = 'xsuportal@example.com';

    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getVapidKey()
    {
        if (file_exists(self::WEBPUSH_VAPID_PRIVATE_KEY_PATH)) {
            $privateKey = file_get_contents(self::WEBPUSH_VAPID_PRIVATE_KEY_PATH);
            // Webpush::VapidKey.from_pem(private_key);
        } else {
            return null;
        }
    }

    public function notifyClarificationAnswered(array $clar, bool $updated = false)
    {
        if ($clar['disclosed']) {
            $sql = 'SELECT `id`, `team_id` FROM `contestants`';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $contestants = $stmt->fetchAll();
        } else {
            $sql = 'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([(int)$clar['team_id']]);
            $contestants = $stmt->fetchAll();
        }

        foreach ($contestants as $contestant) {
            $notification = new Notification([
                'content_clarification' => new ClarificationMessage([
                    'clarification_id' => (int)$clar['id'],
                    'owned' => (int)$clar['team_id'] === (int)$contestant['team_id'],
                    'updated' => $updated,
                ])
            ]);
            $this->notify($notification, (int)$contestant['id']);
            if ($vpaidKey = $this->getVpaidKey()) {
                $this->notifyWebpush($notification, $contestant['id']);
            }
        }
    }

    private function notify(Notification $notification, int $contestantId)
    {
        $encodedMessage = base64_encode($notification->serializeToString());

        $sql = 'INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))';
        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute([$contestantId, $encodedMessage]);
    }

    private function notifyWebPush(Notification $notification, int $contestantId)
    {
        $message = base64_encode($notification->serializeToString());

        // vapid = vapid_key.to_h
        $vapid = $this->getVpaidKey();
        $vapid['subject'] = self::WEBPUSH_SUBJECT;

        $sql = 'SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$contestantId]);
        $subs = $stmt->fetchAll();

        foreach ($subs as $sub) {
            try {
                // Webpush.payload_send(
                //     message: message,
                //     endpoint: sub[:endpoint],
                //     p256dh: sub[:p256dh],
                //     auth: sub[:auth],
                //     vapid: vapid,
                // )
            } catch (\Exception $e) {
                $sql = 'DELETE FROM `push_subscriptions` WHERE `id` = ? LIMIT 1';
                $this->pdo->prepare($sql)->execute([$sub['id']]);
            }
        }
    }
}