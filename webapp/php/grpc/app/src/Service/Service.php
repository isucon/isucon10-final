<?php

/**
 * This file is part of Spiral package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace App\Service;

use App\Job\Ping;
use Spiral\Core\Container\SingletonInterface;
use Spiral\GRPC;
use Spiral\Jobs\QueueInterface;

class Service implements ServiceInterface, SingletonInterface
{
    /** @var QueueInterface */
    private $queue;

    /**
     * @param QueueInterface $queue
     */
    public function __construct(QueueInterface $queue)
    {
        $this->queue = $queue;
    }

    /**
     * @param GRPC\ContextInterface $ctx
     * @param Message\Message       $in
     * @return Message\Message
     */
    public function Welcome(GRPC\ContextInterface $ctx, Message\Message $in): Message\Message
    {
        $out = new Message\Message();
        $out->setMsg("Hello, " . $in->getMsg());

        return $out;
    }

    /**
     * @param GRPC\ContextInterface $ctx
     * @param Message\Job           $in
     * @return Message\JobID
     */
    public function Schedule(GRPC\ContextInterface $ctx, Message\Job $in): Message\JobID
    {
        $id = $this->queue->push(Ping::class, ['value' => $in->getValue()]);

        $out = new Message\JobID();
        $out->setId($id);

        return $out;
    }
}
