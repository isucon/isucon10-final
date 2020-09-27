<?php
declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;

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
};
