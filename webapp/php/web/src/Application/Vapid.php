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


class Vapid
{
    // Minishlink\WebPush::PUBLIC_KEY_LENGTH
    private const PUBLIC_KEY_LENGTH = 65;
    // Minishlink\WebPush::PRIVATE_KEY_LENGTH
    private const PRIVATE_KEY_LENGTH = 32;

    public static function loadFromKeyFile(string $file, ?string $password = null): array
    {
        $content = file_get_contents($file);

        if (false === $content) {
            throw new \UnexpectedValueException(sprintf('Failed to load file: %s', $file));
        }

        return self::loadFromKey($content, $password);
    }

    public static function loadFromKey(string $key, ?string $password = null): array
    {
        $res = $password ? openssl_pkey_get_private($key, $password) : openssl_pkey_get_private($key);

        if (false === $res) {
            throw new \InvalidArgumentException('Failed to load private key');
        }

        $details = openssl_pkey_get_details($res);

        if ($details['type'] !== OPENSSL_KEYTYPE_EC || !isset($details['ec'])) {
            throw new \UnexpectedValueException('expected OpenSSL/EC_POINT');
        }

        $jwk = new JWK([
            'kty' => 'EC',
            'crv' => $details['ec']['curve_name'],
            'x' => base64_encode($details['ec']['x']),
            'y' => base64_encode($details['ec']['y']),
            'd' => base64_encode($details['ec']['d']),
        ]);

        return self::loadFromJwk($jwk);
    }

    private static function loadFromJwk(JWK $jwk): array
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
}