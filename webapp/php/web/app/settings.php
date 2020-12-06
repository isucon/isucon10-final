<?php
declare(strict_types=1);

use DI\ContainerBuilder;
use Monolog\Logger;

return function (ContainerBuilder $containerBuilder) {
    // Global Settings Object
    $containerBuilder->addDefinitions([
        'settings' => [
            'displayErrorDetails' => true, // Should be set to false in production
            'logger' => [
                'name' => 'slim-app',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/app.log',
                'level' => Logger::DEBUG,
            ],
            'database' => [
                'host' => $_ENV['MYSQL_HOSTNAME'] ?? '127.0.0.1',
                'port' => $_ENV['MYSQL_PORT'] ?? '3306',
                'user' => $_ENV['MYSQL_USER'] ?? 'isucon',
                'pass' => $_ENV['MYSQL_PASS'] ?? 'isucon',
                'dbname' => $_ENV['MYSQL_DBNAME'] ?? 'xsuportal',
            ],
            'session' => [
                'name' => 'webapp',
                'cache_expire' => 0,
            ],
        ],
    ]);
};
