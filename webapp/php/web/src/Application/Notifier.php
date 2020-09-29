<?php
declare(strict_types=1);

namespace App\Application;

use Jose\Component\Core\Util\ECKey;
use Jose\Component\KeyManagement\JWKFactory;
// use Minishlink\WebPush\VAPID;
use PDO;
use Xsuportal\Proto\Resources\Notification;
use Xsuportal\Proto\Resources\Notification\ClarificationMessage;
use Jose\Component\KeyManagement\KeyConverter\KeyConverter;
use Minishlink\WebPush\Utils;
use Jose\Component\Core\JWK;
use Base64Url\Base64Url;
use Minishlink\WebPush\WebPush;

class Notifier
{
    const WEBPUSH_VAPID_PRIVATE_KEY_PATH = __DIR__ . '/../../vapid_private.pem';
    const WEBPUSH_SUBJECT = 'xsuportal@example.com';

    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getVapidKey(): ?array
    {
        if (file_exists(self::WEBPUSH_VAPID_PRIVATE_KEY_PATH)) {
            return Vapid::loadFromKeyFile(self::WEBPUSH_VAPID_PRIVATE_KEY_PATH);
        } else {
            return null;
        }
    }

    public static function loadPem(JWK $jwk): array
    {
        $binaryPublicKey = hex2bin(Utils::serializePublicKeyFromJWK($jwk));
        if (!$binaryPublicKey) {
            throw new \ErrorException('Failed to convert VAPID public key from hexadecimal to binary');
        }

        $binaryPrivateKey = hex2bin(str_pad(bin2hex(Base64Url::decode($jwk->get('d'))), 2 * self::PRIVATE_KEY_LENGTH, '0', STR_PAD_LEFT));
        if (!$binaryPrivateKey) {
            throw new \ErrorException('Failed to convert VAPID private key from hexadecimal to binary');
        }

        return [
            'publicKey'  => Base64Url::encode($binaryPublicKey),
            'privateKey' => Base64Url::encode($binaryPrivateKey)
        ];
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