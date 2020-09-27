<?php
declare(strict_types=1);

use App\Application\Service;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

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
            $service = $this->get(Service::class);

            $payload = [
                'contestant' => ($currentContestant = $service->getCurrentContestant()) ? $service->factoryContestantPb($currentContestant) : null, // current_contestant ? contestant_pb(current_contestant) : nil,
                // 'team' => current_team ? team_pb(current_team) : nil,
                'contest' => ($currentContest = $service->getCurrentContestStatus()) ? $service->factoryContestPb($currentContest) : null,
                // 'push_vapid_key' => notifier.vapid_key&.public_key_for_push_header,'
            ];

            list($type, $content) = $service->encodeResponsePb($request, $payload);
            $response->getBody()->write($content);

            return $response->withHeader('Content-Type', $type);
        });
    });
};
