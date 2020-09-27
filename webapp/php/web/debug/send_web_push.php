#!/usr/bin/env php
<?php
declare(strict_types=1);

use Google\Protobuf\Timestamp;
use Xsuportal\Proto\Resources\Notification;
use Xsuportal\Proto\Resources\Notification\TestMessage;
use App\Application\Handlers\HttpErrorHandler;
use App\Application\Handlers\ShutdownHandler;
use App\Application\ResponseEmitter\ResponseEmitter;
use DI\ContainerBuilder;
use Slim\Factory\AppFactory;
use Slim\Factory\ServerRequestCreatorFactory;

require __DIR__ . '/../vendor/autoload.php';

// start Slim

// Instantiate PHP-DI ContainerBuilder
$containerBuilder = new ContainerBuilder();

if (false) { // Should be set to true in production
	$containerBuilder->enableCompilation(__DIR__ . '/var/cache');
}

// Set up settings
$settings = require __DIR__ . '/app/settings.php';
$settings($containerBuilder);

// Set up dependencies
$dependencies = require __DIR__ . '/app/dependencies.php';
$dependencies($containerBuilder);

// Set up repositories
$repositories = require __DIR__ . '/app/repositories.php';
$repositories($containerBuilder);

// Build PHP-DI Container instance
$container = $containerBuilder->build();

// Instantiate the app
AppFactory::setContainer($container);
$app = AppFactory::create();
$callableResolver = $app->getCallableResolver();

// Register middleware
$middleware = require __DIR__ . '/app/middleware.php';
$middleware($app);

// Register routes
$routes = require __DIR__ . '/app/routes.php';
$routes($app);

/** @var bool $displayErrorDetails */
$displayErrorDetails = $container->get('settings')['displayErrorDetails'];

// Create Request object from globals
$serverRequestCreator = ServerRequestCreatorFactory::create();
$request = $serverRequestCreator->createServerRequestFromGlobals();

// Create Error Handler
$responseFactory = $app->getResponseFactory();
$errorHandler = new HttpErrorHandler($callableResolver, $responseFactory);

// Create Shutdown Handler
$shutdownHandler = new ShutdownHandler($request, $errorHandler, $displayErrorDetails);
register_shutdown_function($shutdownHandler);

// Add Routing Middleware
$app->addRoutingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware($displayErrorDetails, false, false);
$errorMiddleware->setDefaultErrorHandler($errorHandler);

// end Slim


const WEBPUSH_SUBJECT = 'xsuportal-debug@example.com';

function getVpaidKey($path) //
{
    if (file_exists($path)) {
        $privateKey = file_get_contents($path);
        // Webpush::VapidKey.from_pem(private_key)
    } else {
        throw new \UnexpectedValueException('WEBPUSH_VAPID_PRIVATE_KEY_PATH');
    }
}

function makeTestNotificationPb(): Notification
{
    return new Notification([
        'created_at' => new Timestamp(['seconds' => time()]),
        'content_test' => new TestMessage([
            'something' => rand(10000),
        ]),
    ]);
}

function insertNotification(PDO $pdo, Notification $notification, int $contestantId): array
{
    $encodedMessage = base64_encode($notification->serializeTostring());
    $sql = 'INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$contestantId, $encodedMessage]);

    $sql = 'SELECT * FROM `notifications` WHERE `id` = LAST_INSERT_ID()';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    return $stmt->fetch();
}

function getPushSubscriptions(PDO $pdo, int $contestantId): array
{
    $sql = 'SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$contestantId]);

    $subs = $stmt->fetchAll();

    if (count($subs) === 0) {
        throw new \UnexpectedValueException(sprintf('No push subscriptions found: contestant_id=%d', $contestantId));
    }

    return $subs;
}

function sendWebPush($vpaidKey, Notification $notification, $pushSubscription)
{
    $message = base64_encode($notification->serializeToString());
    // vapid = vapid_key.to_h
    $vpaid['subject'] = WEBPUSH_SUBJECT;

    // Webpush.payload_send(
    //     message: message,
    //     endpoint: push_subscription[:endpoint],
    //     p256dh: push_subscription[:p256dh],
    //     auth: push_subscription[:auth],
    //     vapid: vapid,
    // )
}

$contestantId = null;
$vpaidPrivateKeyPath = null;

// contestant_id = nil
// vapid_private_key_path = nil
// option_parser = OptionParser.new do |opt|
//   opt.banner = "Usage: #{__FILE__} -c contestant_id -i vapid_private_key_path"
//   opt.on('-c contestant_id') {|_| contestant_id = _ }
//   opt.on('-i vapid_private_key_path') {|_| vapid_private_key_path = _ }
// end
// option_parser.parse!
//
// abort option_parser.banner if !contestant_id || !vapid_private_key_path

// TODO
$vpaidPrivateKeyPath = $argv[1];
$contestantId = (int)$argv[2];

$vpaidKey = getVpaidKey($vpaidPrivateKeyPath);
$pdo = $app->getContainer()->get(PDO::class);

$subs = getPushSubscriptions($pdo, $contestantId);

$notification = makeTestNotificationPb();
$result = insertNotification($pdo, $notification, $contestantId);
$notification->setId((int)$result['id']);
$notification->setCreatedAt(new Timestamp(['seconds' => strtotime($result['created_at'])]));

echo sprintf('Notification=%s', $notification->serializeToJsonString()) . PHP_EOL;

foreach ($subs as $sub) {
    echo sprintf('Sending web push: push_subscription=%s', $sub) . PHP_EOL;
    sendWebPush($vpaidKey, $notification, $sub);
}

echo 'Finished' . PHP_EOL;