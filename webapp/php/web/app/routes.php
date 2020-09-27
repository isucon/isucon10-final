<?php
declare(strict_types=1);

use App\Application\Notifier;
use App\Application\Service;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;
use Xsuportal\Proto\Resources\Leaderboard;
use Xsuportal\Proto\Services\Admin\InitializeRequest;
use Xsuportal\Proto\Services\Admin\InitializeResponse\BenchmarkServer;

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'admin';

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    foreach (['/', '/registration', '/signup', '/login', '/logout', '/teams'] as $path) {
        $app->get($path, function(Request $request, Response $response) {
            $content = file_get_contents(realpath(__DIR__ . '/../public/audience.html'));
            $response->getBody()->write($content);
            return $response;
        });
    }

    foreach (['/contestant', '/contestant/benchmark_jobs', '/contestant/benchmark_jobs/{id}', '/contestant/clarifications'] as $path) {
        $app->get($path, function(Request $request, Response $response) {
            $content = file_get_contents(realpath(__DIR__ . '/../public/contestant.html'));
            $response->getBody()->write($content);
            return $response;
        });
    }

    foreach (['/admin', '/admin/', '/admin/clarifications', '/admin/clarifications/{id}'] as $path) {
        $app->get($path, function(Request $request, Response $response) {
            $content = file_get_contents(realpath(__DIR__ . '/../public/admin.html'));
            $response->getBody()->write($content);
            return $response;
        });
    }

    // set :session_secret, 'tagomoris'
    // set :sessions, key: 'session_xsucon', expire_after: 3600
    // set :show_exceptions, false

    $app->post('/initialize', function(Request $request, Response $response) {
        /** @var Service */
        $service = $this->get(Service::class);
        /** @var PDO */
        $pdo = $this->get(PDO::class);

        /** @var InitializeRequest */
        $req = $service->decodeRequestPb($request);

        $pdo->prepare('TRUNCATE `teams`')->execute();
        $pdo->prepare('TRUNCATE `contestants`')->execute();
        $pdo->prepare('TRUNCATE `benchmark_jobs`')->execute();
        $pdo->prepare('TRUNCATE `clarifications`')->execute();
        $pdo->prepare('TRUNCATE `notifications`')->execute();
        $pdo->prepare('TRUNCATE `push_subscriptions`')->execute();
        $pdo->prepare('TRUNCATE `contest_config`')->execute();

        $sql = 'INSERT `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, TRUE, NOW(6))';
        $pdo->prepare($sql)->execute([ADMIN_ID, hash('sha256', ADMIN_PASSWORD)]);

        if (method_exists($req, 'getContest') && $contest = $req->getContest()) {
            $sql = <<< SQL
            INSERT `contest_config` (
            `registration_open_at`,
            `contest_starts_at`,
            `contest_freezes_at`,
            `contest_ends_at`
            ) VALUES (?, ?, ?, ?)
SQL;
            $pdo->prepare($sql)->execute([
                (new DateTime(sprintf('@%d', $contest->getRegistrationOpenAt()->getSeconds())))->setTimeZone(new DateTimeZone('UTC')),
                (new DateTime(sprintf('@%d', $contest->getContestStartsAt()->getSeconds())))->setTimeZone(new DateTimeZone('UTC')),
                (new DateTime(sprintf('@%d', $contest->getContestFreezesAt()->getSeconds())))->setTimeZone(new DateTimeZone('UTC')),
                (new DateTime(sprintf('@%d', $contest->getContestEndsAt()->getSeconds())))->setTimeZone(new DateTimeZone('UTC')),
            ]);
        } else {
            $sql = <<< SQL
            INSERT `contest_config` (
            `registration_open_at`,
            `contest_starts_at`,
            `contest_freezes_at`,
            `contest_ends_at`
            ) VALUES (
                TIMESTAMPADD(SECOND, 0, NOW(6)),
                TIMESTAMPADD(SECOND, 5, NOW(6)),
                TIMESTAMPADD(SECOND, 40, NOW(6)),
                TIMESTAMPADD(SECOND, 50, NOW(6))
            )
SQL;
            $pdo->prepare($sql)->execute();
        }

        $payload = [
            # TODO: 負荷レベルの指定
            # 実装言語
            'language' => 'php',
            'benchmark_server' => new BenchmarkServer([
                'host' => $_ENV['BENCHMARK_SERVER_HOST'] ?? 'localhost',
                'port' => (int)($_ENV['BENCHMARK_SERVER_PORT'] ?? 50051),
            ]),
        ];

        list($type, $content) = $service->encodeResponsePb($request, $payload);
        $response->getBody()->write($content);

        return $response->withHeader('Content-Type', $type);
    });

    $app->get('/test', function(Request $request, Response $response) {
        var_dump([
            \Xsuportal\Proto\Error::class,
            \Google\Protobuf\Timestamp::class,
            \GPBMetadata\Xsuportal\Error::class,
            \GPBMetadata\Google\Protobuf\Timestamp::class,
        ]);
        exit;
    });

    //

    $app->group('/api', function (Group $group) {
        $group->get('/session', function(Request $request, Response $response) {
            /** @var Service */
            $service = $this->get(Service::class);
            /** @var Notifier */
            $notifier = $this->get(Notifier::class);

            $payload = [
                'contestant' => ($currentContestant = $service->getCurrentContestant()) ? $service->factoryContestantPb($currentContestant) : null, // current_contestant ? contestant_pb(current_contestant) : nil,
                'team' => ($currentTeam = $service->getCurrentTeam()) ? $service->factoryTeamPb($currentTeam) : null,
                'contest' => ($currentContest = $service->getCurrentContestStatus()) ? $service->factoryContestPb($currentContest) : null,
                // 'push_vapid_key' => $notifier->getVapidKey()->getPublicKeyForPushHeader(),
            ];

            list($type, $content) = $service->encodeResponsePb($request, $payload);
            $response->getBody()->write($content);

            return $response->withHeader('Content-Type', $type);
        });
    });
};
