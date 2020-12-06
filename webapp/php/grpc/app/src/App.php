<?php

/**
 * This file is part of Spiral package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace App;

use Spiral\Bootloader as Framework;
use Spiral\DotEnv\Bootloader as DotEnv;
use Spiral\Framework\Kernel;
use Spiral\Prototype\Bootloader as Prototype;

class App extends Kernel
{
    /*
     * List of components and extensions to be automatically registered
     * within system container on application start.
     */
    protected const LOAD = [
        // Environment configuration
        DotEnv\DotenvBootloader::class,

        // Core Services
        Framework\SnapshotsBootloader::class,
        Framework\Security\EncrypterBootloader::class,

        // Databases
        Framework\Database\DatabaseBootloader::class,
        Framework\Database\MigrationsBootloader::class,

        // ORM
        Framework\Cycle\CycleBootloader::class,
        Framework\Cycle\ProxiesBootloader::class,
        Framework\Cycle\AnnotatedBootloader::class,

        // Dispatchers
        Framework\GRPC\GRPCBootloader::class,
        Framework\Jobs\JobsBootloader::class,

        // Framework commands
        Framework\CommandBootloader::class,

        // Debugging
        Framework\DebugBootloader::class,
        Framework\Debug\LogCollectorBootloader::class
    ];

    /*
     * Application specific services and extensions.
     */
    protected const APP = [
        Prototype\PrototypeBootloader::class
    ];
}
