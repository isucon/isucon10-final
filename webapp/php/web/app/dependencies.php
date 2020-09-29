<?php
declare(strict_types=1);

use App\Application\Notifier;
use App\Application\Service;
use DI\ContainerBuilder;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        LoggerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get('settings');

            $loggerSettings = $settings['logger'];
            $logger = new Logger($loggerSettings['name']);

            $processor = new UidProcessor();
            $logger->pushProcessor($processor);

            $handler = new StreamHandler($loggerSettings['path'], $loggerSettings['level']);
            $logger->pushHandler($handler);

            return $logger;
        },

        Service::class => function(ContainerInterface $container) {
            return new Service(
                $container->get(PDO::class),
                $container->get(Session::class),
            );
        },

        Notifier::class => function(ContainerInterface $c) {
            return new Notifier($c->get(PDO::class));
        },

        PDO::class => function(ContainerInterface $container): PDO {
            $settings = $container->get('settings')['database'];

            $dsn = vsprintf('mysql:host=%s;dbname=%s;port=%d', [
                $settings['host'],
                $settings['dbname'],
                $settings['port']
            ]);

            $pdo = new PDO($dsn, $settings['user'], $settings['pass']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            return $pdo;
        },

        Session::class => function(ContainerInterface $container): Session
        {
            $settings = $container->get('settings')['session'];
            if (PHP_SAPI === 'cli') {
                return new Session(new MockArraySessionStorage);
            } else {
                return new Session(new NativeSessionStorage($settings));
            }
        },

        SessionInterface::class => function(ContainerInterface $container): Session
        {
            return $container->get(Session::class);
        }
    ]);
};
