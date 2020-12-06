<?php
declare(strict_types=1);

namespace App\Domain;

use Xsuportal\Proto;

class Routes
{
    public const PB_TABLE = [
        'POST /initialize' => [
            Proto\Services\Admin\InitializeRequest::class,
            Proto\Services\Admin\InitializeResponse::class,
        ],
        'GET /api/admin/clarifications' => [
            null,
            Proto\Services\Admin\ListClarificationsResponse::class,
        ],
        'GET /api/admin/clarifications/{id}' => [
            null,
            Proto\Services\Admin\GetClarificationResponse::class,
        ],
        'PUT /api/admin/clarifications/{id}' => [
            Proto\Services\Admin\RespondClarificationRequest::class,
            Proto\Services\Admin\RespondClarificationResponse::class,
        ],
        'GET /api/session' => [
            null,
            Proto\Services\Common\GetCurrentSessionResponse::class,
        ],
        'GET /api/audience/teams' => [
            null,
            Proto\Services\Audience\ListTeamsResponse::class,
        ],
        'GET /api/audience/dashboard' => [
            null,
            Proto\Services\Audience\DashboardResponse::class,
        ],
        'GET /api/registration/session' => [
            null,
            Proto\Services\Registration\GetRegistrationSessionResponse::class,
        ],
        'POST /api/registration/team' => [
            Proto\Services\Registration\CreateTeamRequest::class,
            Proto\Services\Registration\CreateTeamResponse::class,
        ],
        'POST /api/registration/contestant' => [
            Proto\Services\Registration\JoinTeamRequest::class,
            Proto\Services\Registration\JoinTeamResponse::class,
        ],
        'PUT /api/registration' => [
            Proto\Services\Registration\UpdateRegistrationRequest::class,
            Proto\Services\Registration\UpdateRegistrationResponse::class,
        ],
        'DELETE /api/registration' => [
            Proto\Services\Registration\DeleteRegistrationRequest::class,
            Proto\Services\Registration\DeleteRegistrationResponse::class,
        ],
        'POST /api/contestant/benchmark_jobs' => [
            Proto\Services\Contestant\EnqueueBenchmarkJobRequest::class,
            Proto\Services\Contestant\EnqueueBenchmarkJobResponse::class,
        ],
        'GET /api/contestant/benchmark_jobs' => [
            null,
            Proto\Services\Contestant\ListBenchmarkJobsResponse::class,
        ],
        'GET /api/contestant/benchmark_jobs/{id}' => [
            null,
            Proto\Services\Contestant\GetBenchmarkJobResponse::class,
        ],
        'GET /api/contestant/dashboard' => [
            null,
            Proto\Services\Contestant\DashboardResponse::class,
        ],
        'GET /api/contestant/clarifications' => [
            null,
            Proto\Services\Contestant\ListClarificationsResponse::class,
        ],
        'POST /api/contestant/clarifications' => [
            Proto\Services\Contestant\RequestClarificationRequest::class,
            Proto\Services\Contestant\RequestClarificationResponse::class,
        ],
        'GET /api/contestant/notifications' => [
            null,
            Proto\Services\Contestant\ListNotificationsResponse::class,
        ],
        'POST /api/contestant/push_subscriptions' => [
            Proto\Services\Contestant\SubscribeNotificationRequest::class,
            Proto\Services\Contestant\SubscribeNotificationResponse::class,
        ],
        'DELETE /api/contestant/push_subscriptions' => [
            Proto\Services\Contestant\UnsubscribeNotificationRequest::class,
            Proto\Services\Contestant\UnsubscribeNotificationResponse::class,
        ],
        'POST /api/signup' => [
            Proto\Services\Contestant\SignupRequest::class,
            Proto\Services\Contestant\SignupResponse::class,
        ],
        'POST /api/login' => [
            Proto\Services\Contestant\LoginRequest::class,
            Proto\Services\Contestant\LoginResponse::class,
        ],
        'POST /api/logout' => [
            Proto\Services\Contestant\LogoutRequest::class,
            Proto\Services\Contestant\LogoutResponse::class,
        ],
    ];
}