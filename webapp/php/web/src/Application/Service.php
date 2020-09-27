<?php
declare(strict_types=1);

namespace App\Application;

use App\Domain\Routes;
use Google\Protobuf\Internal\Message;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteContext;
use Xsuportal\Proto\Resources\Contestant;

class Service
{
    private ContainerInterface $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function encodeResponsePb(Request $request, array $payload): array
    {
        $cls = Routes::PB_TABLE[self::requestToRouteString($request)][1];
        $contentType = "application/vnd.google.protobuf; proto=#{$cls}";
        /** @var Message */
        $message = new $cls($payload);

        return [
            $contentType,
            $message->serializeToString(),
        ];
    }

    public function getCurrentContestant(bool $lock = false): ?array
    {
        if (false) { // TODO
            $sql = 'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1' . ($lock ?? ' FOR UPDATE');
            return []; // TODO
        } else {
            return null;
        }
    }

    public function contestantPb(array $contestant): Contestant
    {
        return new Contestant([
            'id' => $contestant['id'],
            'team_id' => $contestant['team_id'],
            'name' => $contestant['name'],
            'is_student' => $contestant['student'],
            'is_stuff' => $contestant['staff'],
        ]);
    }

    private static function requestToRouteString(Request $request): string
    {
        $context = RouteContext::fromRequest($request);
        return sprintf('%s %s', $request->getMethod(), $context->getRoute()->getPattern());
    }
}