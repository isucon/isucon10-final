<?php
declare(strict_types=1);

namespace App\Application;

use App\Domain\Routes;
use Google\Protobuf\Internal\Message;
use Google\Protobuf\Timestamp;
use PDO;
use PDOStatement;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteContext;
use Xsuportal\Proto\Resources\Contest;
use Xsuportal\Proto\Resources\Contest\Status;
use Xsuportal\Proto\Resources\Contestant;
use Xsuportal\Proto\Resources\Team;
use Xsuportal\Proto\Resources\Team\StudentStatus;

class Service
{
    private ContainerInterface $container;

    const ENV_PRODUCTION = 'production';

    const DEBUG_CONTEST_STATUS_FILE_PATH = '/tmp/XSUPORTAL_CONTEST_STATUS';

    // const CONTEST_STATUS_STANDBY = 'standby';
    // const CONTEST_STATUS_REGISTRATION = 'registration';
    // const CONTEST_STATUS_STARTED = 'started';
    // const CONTEST_STATUS_FINISHED = 'finished';

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function decodeRequestPb(Request $request): Message
    {
        $cls = Routes::PB_TABLE[self::requestToRouteString($request)][0];
        /** @var Message */
        $message = new $cls;
        $message->mergeFromString($request->getBody());

        return $message;
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
        $id = 1; // TODO
        if ($id) {
            $sql = 'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1' . ($lock ? ' FOR UPDATE' : '');
            /** @var \PDOStatement */
            $stmt = $this->container->get(PDO::class)->prepare($sql);
            $stmt->execute([$id]);

            return $stmt->fetch();
        }

        return null;
    }

    public function getCurrentContestStatus(): ?array
    {
        $id = 1; // TODO
        if ($id) {
            $sql = <<< SQL
            SELECT
                *,
                NOW(6) AS `current_time`,
                CASE
                WHEN NOW(6) < `registration_open_at` THEN 'standby'
                WHEN `registration_open_at` <= NOW(6) AND NOW(6) < `contest_starts_at` THEN 'registration'
                WHEN `contest_starts_at` <= NOW(6) AND NOW(6) < `contest_ends_at` THEN 'started'
                WHEN `contest_ends_at` <= NOW(6) THEN 'finished'
                ELSE 'unknown'
                END AS `status`,
                IF(`contest_starts_at` <= NOW(6) AND NOW(6) < `contest_freezes_at`, 1, 0) AS `frozen`
            FROM `contest_config`
SQL;

            /** @var \PDOStatement */
            $stmt = $this->container->get(PDO::class)->prepare($sql);
            $stmt->execute([$id]);

            $contest = $stmt->fetch();

            return [
                'registration_open_at' => $contest['registration_open_at'],
                'contest_starts_at' => $contest['contest_starts_at'],
                'contest_freezes_at' => $contest['contest_freezes_at'],
                'contest_ends_at' => $contest['contest_ends_at'],
                'frozen' => $contest['frozen'],
                'status' => $contest['status'],
            ];
        }

        return null;
    }

    public function factoryContestantPb(array $contestant): Contestant
    {
        return new Contestant([
            'id' => $contestant['id'] ? (int)$contestant['id'] : null,
            'team_id' => $contestant['team_id'] ? (int)$contestant['team_id'] : null,
            'name' => $contestant['name'] ?? null,
            'is_student' => $contestant['student'] === '1',
            'is_staff' => $contestant['staff'] === '1',
        ]);
    }

    public function factoryContestPb(array $contest): Contest
    {
        return new Contest([
            'registration_open_at' => $contest['registration_open_at'] ? new Timestamp(['seconds' => strtotime($contest['registration_open_at'])]) : null,
            'contest_starts_at' => $contest['contest_starts_at'] ? new Timestamp(['seconds' => strtotime($contest['contest_starts_at'])]) : null,
            'contest_freezes_at' => $contest['contest_freezes_at'] ? new Timestamp(['seconds' => strtotime($contest['contest_freezes_at'])]) : null,
            'contest_ends_at' => $contest['contest_ends_at'] ? new Timestamp(['seconds' => strtotime($contest['contest_ends_at'])]) : null,
            'frozen' => $contest['frozen'] === '1',
            'status' => self::convertStatusTextToStatus($contest['status']),
        ]);

        // return new Contest([
        //     'registration_open_at' => $contest['registration_open_at'] ? strtotime($contest['registration_open_at']) : null,
        //     'contest_starts_at' => $contest['contest_starts_at'] ? strtotime($contest['contest_starts_at']) : null,
        //     'contest_freezes_at' => $contest['contest_freezes_at'] ? strtotime($contest['contest_freezes_at']) : null,
        //     'contest_ends_at' => $contest['contest_ends_at'] ? strtotime($contest['contest_ends_at']) : null,
        //     'frozen' => $contest['frozen'] === '1',
        //     'status' => self::convertStatusTextToStatus($contest['status']),
        // ]);
    }

    private static function convertStatusTextToStatus(string $status): int
    {
        if (($_ENV['APP_ENV'] ?? null) != self::ENV_PRODUCTION && file_exists(self::DEBUG_CONTEST_STATUS_FILE_PATH)) {
            $status = file_get_contents(self::DEBUG_CONTEST_STATUS_FILE_PATH);
        }

        switch ($status) {
            case 'standby':
                return Status::STANDBY;
            case 'registration':
                return Status::STANDBY;
            case 'started':
                return Status::STARTED;
            case 'finished':
                return Status::FINISHED;
            default:
                throw new \UnexpectedValueException(sprintf('Unexpected contest status: %s', $status));
        }
    }

    public function getCurrentTeam(bool $lock = false): ?array
    {
        $currentContestant = $this->getCurrentContestant();
        if ($currentContestant) {
            $sql = 'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1' . ($lock ? ' FOR UPDATE' : '');
            /** @var \PDOStatement */
            $stmt = $this->container->get(PDO::class)->prepare($sql);
            $stmt->execute([(int)$currentContestant['team_id']]);

            return $stmt->fetch() ?: [];
        }

        return null;
    }

    public function factoryTeamPb(array $team, bool $detail = false, $enableMembers = true): Team
    {
        $leader = null;
        $members = null;

        /** @var PDO */
        $pdo = $this->container->get(PDO::class);

        if ($enableMembers) {
            if ($team['leader_id']) {
                $sql = 'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1';
                /** @var \PDOStatement */
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$team['leader_id']]);
                $leader = $this->factoryContestantPb($stmt->fetch());
            }
            $sql = 'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1';
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$team['leader_id']]);
            $members = array_map(
                function(array $member): Contestant {
                    return $this->factoryContestantPb($member);
                },
                $stmt->fetchAll()
            );
        }

        return new Team([
            'id' => isset($team['id']) ? (int)$team['id'] : null,
            'name' => $team['name'] ?? null,
            'leader_id' => isset($team['leader_id']) ? (int)$team['leader_id'] : null,
            'member_ids' => array_map(
                function(Contestant $member) {
                    return $member->getId();
                },
                $members
            ),
            'withdrawn' => isset($team['withdrawn']) ? (bool)$team['withdrawn'] : false,
            'detail' => $detail ? new StudentStatus([
                'email_address' => $team['email_address'],
                'invite_token' => $team['invite_token'],
            ]) : null,
            'leader' => $leader,
            'members' => $members,
            'student' => isset($team['student']) ? new StudentStatus([
                'status' => ($team['student'] !== '0' && !!$team['student']),
            ]) : null,
        ]);
    }

    public function getNotifier()
    {
        /** @var \PDO */
        $pdo = $this->container->get(PDO::class);
        return new Notifier($pdo);
    }

    private static function requestToRouteString(Request $request): string
    {
        $context = RouteContext::fromRequest($request);
        return sprintf('%s %s', $request->getMethod(), $context->getRoute()->getPattern());
    }
}