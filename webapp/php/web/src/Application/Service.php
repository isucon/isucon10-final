<?php
declare(strict_types=1);

namespace App\Application;

use App\Domain\Routes;
use Google\Protobuf\Internal\DescriptorPool;
use Google\Protobuf\Internal\Message;
use Google\Protobuf\Timestamp;
use PDO;
use PDOStatement;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Routing\RouteContext;
use Spiral\Http\Exception\ClientException\UnauthorizedException;
use Symfony\Component\HttpFoundation\Session\Session;
use Xsuportal\Proto\Resources\Clarification;
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

    private PDO $pdo;
    private Session $session;

    public function __construct(PDO $pdo, Session $session)
    {
        $this->pdo = $pdo;
        $this->session = $session;
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
        /** @var Message */
        $message = new $cls($payload);
        $contentType = sprintf('application/vnd.google.protobuf; proto=#%s', self::getPbFullName($cls));

        return [
            $contentType,
            $message->serializeToString(),
        ];
    }

    public function getCurrentContestant(bool $lock = false): ?array
    {
        if ($id = $this->session->get('contestant_id')) {
            $sql = 'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1' . ($lock ? ' FOR UPDATE' : '');
            /** @var \PDOStatement */
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$id]);

            if ($contestant = $stmt->fetch()) {
                return $contestant;
            }
        }

        return null;
    }

    public function getCurrentContestStatus(): ?array
    {
        if ($id = $this->session->get('contestant_id')) {
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
            $stmt = $this->pdo->prepare($sql);
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
            'id' => $contestant['id'] ?? null,
            'team_id' => isset($contestant['id']) ? (int)$contestant['id'] : null,
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
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([(int)$currentContestant['team_id']]);

            return $stmt->fetch() ?: [];
        }

        return null;
    }

    public function factoryTeamPb(array $team, bool $detail = false, $enableMembers = true): Team
    {
        $leaderPb = null;
        $members = null;

        if ($enableMembers) {
            if ($team['leader_id']) {
                $sql = 'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1';
                /** @var \PDOStatement */
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([$team['leader_id']]);
                if ($leader = $stmt->fetch()) {
                    $leaderPb = $this->factoryContestantPb($leader);
                }
            }
            $sql = 'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1';
            $stmt = $this->pdo->prepare($sql);
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
            'leader' => $leaderPb,
            'members' => $members,
            'student' => isset($team['student']) ? new StudentStatus([
                'status' => ($team['student'] !== '0' && !!$team['student']),
            ]) : null,
        ]);
    }

    public function getNotifier()
    {
        return new Notifier($this->pdo);
    }

    private static function requestToRouteString(Request $request): string
    {
        $context = RouteContext::fromRequest($request);
        return sprintf('%s %s', $request->getMethod(), $context->getRoute()->getPattern());
    }

    public function loginRequired(Request $request, bool $team = true, bool $lock = false)
    {
        if (!$this->getCurrentContestant($lock)) {
            throw new HttpUnauthorizedException($request, 'ログインが必要です');
        }
        if ($team && !$this->getCurrentTeam($lock)) {
            throw new HttpForbiddenException($request, '参加登録が必要です');
        }
    }

    public function factoryClarificationPb(array $clar, array $team = null)
    {
        return new Clarification([
            'id' => isset($clar['id']) ? (int)$clar['id'] : null,
            'team_id' => isset($clar['team_id']) ? (int)$clar['team_id'] : null,
            'answered' => isset($clar['answered_at']) ? !!$clar['answered_at'] : false,
            'disclosed' => isset($clar['disclosed']) ? $clar['disclosed'] === '1' : false,
            'question' => $clar['question'] ?? null,
            'answer' => $clar['answer'] ?? null,
            'created_at' => $clar['created_at'] ? new Timestamp(['seconds' => strtotime($clar['created_at'])]) : null,
            'answered_at' => $clar['answered_at'] ? new Timestamp(['seconds' => strtotime($clar['answered_at'])]) : null,
            'team' => $team ? $this->factoryTeamPb($team) : null,
        ]);
    }

    public static function getPbFullName(string $class): string
    {
        $pool = DescriptorPool::getGeneratedPool();
        $desc = $pool->getDescriptorByClassName($class);
        return $desc->getFullName();
    }
}