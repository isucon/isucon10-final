import express from "express";
import mysql from "promise-mysql";
import crypto from 'crypto';
import fs from "fs";

import {InitializeRequest, InitializeResponse} from "./proto/xsuportal/services/admin/initialize_pb";
import {Error as PbError} from "./proto/xsuportal/error_pb";
import { Clarification } from "./proto/xsuportal/resources/clarification_pb";
import { ListClarificationsResponse, GetClarificationResponse, CreateClarificationRequest, RespondClarificationRequest, RespondClarificationResponse } from "./proto/xsuportal/services/admin/clarifications_pb";
import { Team } from "./proto/xsuportal/resources/team_pb";
import { Contestant } from "./proto/xsuportal/resources/contestant_pb";
import { Contest } from "./proto/xsuportal/resources/contest_pb";
import { GetCurrentSessionResponse } from "./proto/xsuportal/services/common/me_pb";
import { fstat } from "fs";
import { ListTeamsResponse as AdminListTeamsResponse } from "./proto/xsuportal/services/admin/teams_pb";
import { ListTeamsResponse as AudienceListTeamsResponse } from "./proto/xsuportal/services/audience/team_list_pb";
import { DashboardResponse as AudienceDashboardResponse } from "./proto/xsuportal/services/audience/dashboard_pb";
import { Leaderboard } from "./proto/xsuportal/resources/leaderboard_pb";
import { BenchmarkJob } from "./proto/xsuportal/resources/benchmark_job_pb";
import { EnqueueBenchmarkJobResponse, GetBenchmarkJobResponse } from "./proto/xsuportal/services/admin/benchmark_pb";
import { ListBenchmarkJobsResponse } from "./proto/xsuportal/services/contestant/benchmark_pb";
import { BenchmarkResult } from "./proto/xsuportal/resources/benchmark_result_pb";
import { DashboardResponse } from "./proto/xsuportal/services/admin/dashboard_pb";
import { ListNotificationsResponse, SubscribeNotificationRequest, SubscribeNotificationResponse, UnsubscribeNotificationRequest, UnsubscribeNotificationResponse } from "./proto/xsuportal/services/contestant/notifications_pb";

const TEAM_CAPACITY = 10
const MYSQL_ER_DUP_ENTRY = 1062
const ADMIN_ID = 'admin'
const ADMIN_PASSWORD = 'admin'
const DEBUG_CONTEST_STATUS_FILE_PATH = '/tmp/XSUPORTAL_CONTEST_STATUS'
const hash = crypto.createHash('sha256');

const connection = mysql.createConnection({
  host: process.env['MYSQL_HOSTNAME'] ?? '127.0.0.1',
  port: Number.parseInt(process.env['MYSQL_PORT'] ?? '3306'),
  user: process.env['MYSQL_USER'] ?? 'isucon',
  database: process.env['MYSQL_DATABASE'] ?? 'xsuportal',
  password: process.env['MYSQL_PASS'] || 'isucon',
  charset: 'utf8mb4',
});

const haltPb = (res: express.Response, code: number, humanMessage: string) => {
  res.contentType('application/vnd.google.protobuf; proto=xsuportal.proto.Error');
  res.status(code);
  const error = new PbError();
  error.setCode(code);
  error.setHumanMessage(humanMessage);
  res.end(Buffer.from(error.serializeBinary()));
};

const haltPbWithError = (res: express.Response, code: number, humanMessage: string, err: Error) => {
  res.contentType('application/vnd.google.protobuf; proto=xsuportal.proto.Error');
  res.status(code);
  const error = new PbError();
  error.setCode(code);
  error.setHumanMessage(humanMessage);
  error.setHumanDescriptionsList([err.stack ?? err.message]);
  res.end(Buffer.from(error.serializeBinary()));
};

const app = express();

app.use(express.static("../public"));
// TODO session

// rawbody
app.use(function(req, res, next) {
  req.body = '';
  req.on('data', function(chunk) { 
    req.body += chunk;
  });
  req.on('end', function() {
    next();
  });
});

const getCurrentContestant = function() {
  let currentContestant = null
  return async ({ lock = false } = {}) => {
    const db = await connection;
    const id = '1'/* session['contestant_id'] */;
    if (!id) return null;
    const result = db.query(
      lock
        ? "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1 FOR UPDATE"
        : "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1",
      id
    )
    currentContestant ??= result?.[0]
    return currentContestant
  }
}()

const getCurrentTeam = function() {
  let currentTeam = null
  return async ({ lock = false } = {}) => {
    const db = await connection;
    const currentContestant = await getCurrentContestant()
    if (!currentContestant) return null
    const result = db.query(
      lock
        ? "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1 FOR UPDATE"
        : "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
      currentContestant['team_id']
    )
    currentTeam ??= result?.[0]
    return currentTeam
  }
}()

const getCurrentContestStatus = async () => {
    const db = await connection;
    const [contest] = await db.query(`
      SELECT
        *,
        NOW(6) AS current_time,
        CASE
          WHEN NOW(6) < registration_open_at THEN 'standby'
          WHEN registration_open_at <= NOW(6) AND NOW(6) < contest_starts_at THEN 'registration'
          WHEN contest_starts_at <= NOW(6) AND NOW(6) < contest_ends_at THEN 'started'
          WHEN contest_ends_at <= NOW(6) THEN 'finished'
          ELSE 'unknown'
        END AS status,
        IF(contest_starts_at <= NOW(6) AND NOW(6) < contest_freezes_at, 1, 0) AS frozen
      FROM contest_config
    `);

    let contestStatusStr = contest.status;
    if (process.env['APP_ENV'] != "production" && fs.existsSync(DEBUG_CONTEST_STATUS_FILE_PATH)) {
      contestStatusStr = fs.readFileSync(DEBUG_CONTEST_STATUS_FILE_PATH).toString();
    }

    let status: Contest.Status;
    switch(contestStatusStr) {
      case "standby":
        status = Contest.Status.STANDBY;
        break;
      case "registration":
        status = Contest.Status.REGISTRATION;
        break;
      case "started":
        status = Contest.Status.STARTED;
        break;
      case "finished":
        status = Contest.Status.FINISHED;
        break;
      default:
        throw new Error(`Unexpected contest status: ${contestStatusStr}`);
    }

    return ({
      contest: {
        registration_open_at: contest.registration_open_at,
        contest_starts_at: contest.contest_starts_at,
        contest_freezes_at: contest.contest_freezes_at,
        contest_ends_at: contest.contest_ends_at,
        frozen: contest.frozen === 1,
        status: status,
      },
      current_time: contest.current_time,
    });
};

const loginRequired: (res: express.Response, opts?: { team?: boolean, lock?: boolean }) => boolean = (res, { team = true, lock = false } = {}) => {
  if (!getCurrentContestant({ lock })) {
    haltPb(res, 401, "ログインが必要です")
    return false;
  }
  if (!getCurrentTeam({ lock })) {
    haltPb(res, 403, "参加登録が必要です")
    return false;
  }
  return true;
}

async function contestStatusRestricted(res: express.Response, statuses: Array<Contest.Status>, msg: string): Promise<boolean> {
  const currentContest = await getCurrentContestStatus();
  if (statuses.includes(currentContest.contest.status)) {
    haltPb(res, 403, msg)
    return false;
  }
  return true;
}

function getContestantResource(contestant: any, detail: boolean = false) {
  const contestantResource = new Contestant();
  contestantResource.setId(contestant.id);
  contestantResource.setTeamId(contestant.team_id);
  contestantResource.setName(contestant.name);
  contestantResource.setIsStudent(contestant.student);
  contestantResource.setIsStaff(contestant.staff);
  return contestantResource;
}

async function getTeamResource(team: any, detail: boolean = false, enableMembers: boolean = true, memberDetail: boolean = false) {
  const db = await connection;
  const teamResource = new Team();
  
  let members = null;
  let leader = null;

  let leader_pb = null;
  let members_pb = null;
  if (enableMembers) {
    if (team.leader_id != null) {
      [leader] = await db.query(
        'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1',
        [team.leader_id]
      )
    }
    members = await db.query(
      'SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`',
      [team.id]
    );
    leader_pb = leader ? getContestantResource(leader, memberDetail) : null;
    members_pb = members ? members.map((m: any) => getContestantResource(m, memberDetail)) : null;
  }

  teamResource.setId(team.id);
  teamResource.setName(team.name);
  teamResource.setLeaderId(team.leader_id);
  teamResource.setMemberIdsList(members ? members.map((m: any) => m.id) : null);
  teamResource.setWithdrawn(team.withdrawn);
  if (detail) {
    const teamDetail = new Team.TeamDetail();
    teamDetail.setEmailAddress(team.email_address);
    teamDetail.setInviteToken(team.invite_token);
    teamResource.setDetail(teamDetail);
  }
  if (leader_pb) {
    teamResource.setLeader(leader_pb);
  }
  teamResource.setMembersList(members_pb);
  if (team.student) {
    const studentStatus = new Team.StudentStatus();
    studentStatus.setStatus(team.student != 0 && !!team.student);
    teamResource.setStudent(studentStatus);
  }
  return teamResource;
}

async function getBenchmarkJobResource(job) {
  const benchmarkJob = new BenchmarkJob();
  benchmarkJob.setId(job.id);
  benchmarkJob.setTeamId(job.team_id);
  benchmarkJob.setStatus(job.status);
  benchmarkJob.setTargetHostname(job.target_hostname);
  benchmarkJob.setCreatedAt(job.created_at);
  benchmarkJob.setUpdatedAt(job.updated_at);
  benchmarkJob.setStartedAt(job.started_at);
  benchmarkJob.setFinishedAt(job.finished_at);
  benchmarkJob.setResult(job.finished_at ? await getBenchmarkResultResource(job) : null);
}

async function getBenchmarkJobsResource(limit?: number) {
  const db = await connection;
  const currentTeam = await getCurrentTeam();
  const jobs = await db.query(
    `SELECT * FROM benchmark_jobs WHERE team_id = ? ORDER BY created_at DESC ${limit ? `LIMIT ${limit}` : ''}`,
    [currentTeam.id]
  )
  return jobs.map(job => getBenchmarkJobResource(job))
}

async function getBenchmarkResultResource(job) {
  const hasScore = job.score_raw && job.score_deducation
  const result = new BenchmarkResult();
  result.setFinished(!!job.finished_at);
  result.setPassed(job.passed);
  if (hasScore) {
    result.setScore(job.score_raw - job.score_deducation);
    const scoreBreakdown = new BenchmarkResult.ScoreBreakdown();
    scoreBreakdown.setRaw(job.score_raw);
    scoreBreakdown.setDeduction(job.score_deducation);
    result.setScoreBreakdown(scoreBreakdown);
  }
  result.setReason(job.reason);
  return result;
}

async function getClarificationResource(clar: any, team: any) {
  const clarificationResource = new Clarification();
  clarificationResource.setId(clar.id);
  clarificationResource.setTeamId(clar.team_id);
  clarificationResource.setAnswer(clar.answer);
  clarificationResource.setAnswered(!!clar.answered_at);
  clarificationResource.setDisclosed(clar.disclosed);
  clarificationResource.setCreatedAt(clar.created_at);
  const t = await getTeamResource(team);
  clarificationResource.setTeam(t);
  return clarificationResource;
}

function getContestResource(contest: any) {
  const contestResource = new Contest();
  contestResource.setStatus(contest.status);
  contestResource.setContestStartsAt(contest.contest_starts_at);
  contestResource.setContestEndsAt(contest.contest_ends_at);
  contestResource.setContestFreezesAt(contest.contest_freezes_at);
  contestResource.setRegistrationOpenAt(contest.registration_open_at);
  contestResource.setFrozen(contest.frozen);
  return contestResource;
}

async function getLeaderboardResource(teamId: number = 0) {
  const db = await connection;
  const contest = (await getCurrentContest()).contest;
  const contestFinished = contest.status === Contest.Status.FINISHED;
  const contestFreezesAt = contest.contest_freezes_at;

  let leaderboard = null;
  let jobResults = null;
  let teamGraphScores: any = {};
  await db.beginTransaction();
  leaderboard = await db.query(`
    SELECT
      teams.id AS id,
      teams.name AS name,
      teams.leader_id AS leader_id,
      teams.withdrawn AS withdrawn,
      team_student_flags.student AS student,
      (best_score_jobs.score_raw - best_score_jobs.score_deduction) AS best_score,
      best_score_jobs.started_at AS best_score_started_at,
      best_score_jobs.finished_at AS best_score_marked_at,
      (latest_score_jobs.score_raw - latest_score_jobs.score_deduction) AS latest_score,
      latest_score_jobs.started_at AS latest_score_started_at,
      latest_score_jobs.finished_at AS latest_score_marked_at,
      latest_score_job_ids.finish_count AS finish_count
    FROM
      teams
    -- latest scores
    LEFT JOIN (
      SELECT
        MAX(id) AS id,
        team_id,
        COUNT(*) AS finish_count
      FROM
        benchmark_jobs
      WHERE
        finished_at IS NOT NULL
    -- score freeze
      AND (team_id = ? OR (team_id != ? AND (? = TRUE OR finished_at < ?)))
      GROUP BY
        team_id
    ) latest_score_job_ids ON latest_score_job_ids.team_id = teams.id
    LEFT JOIN benchmark_jobs latest_score_jobs ON latest_score_job_ids.id = latest_score_jobs.id
    -- best scores
    LEFT JOIN (
      SELECT
        MAX(j.id) AS id,
        j.team_id AS team_id
      FROM
        (
          SELECT
            team_id,
            MAX(score_raw - score_deduction) AS score
          FROM
            benchmark_jobs
          WHERE
            finished_at IS NOT NULL
    -- score freeze
            AND (team_id = ? OR (team_id != ? AND (? = TRUE OR finished_at < ?)))
          GROUP BY
            team_id
      ) best_scores
      LEFT JOIN benchmark_jobs j ON (j.score_raw - j.score_deduction) = best_scores.score
        AND j.team_id = best_scores.team_id
      GROUP BY
        j.team_id
    ) best_score_job_ids ON best_score_job_ids.team_id = teams.id
    LEFT JOIN benchmark_jobs best_score_jobs ON best_score_jobs.id = best_score_job_ids.id
  -- check student teams
    LEFT JOIN (
      SELECT
        team_id,
        (SUM(student) = COUNT(*)) AS student
      FROM
        contestants
      GROUP BY
        contestants.team_id
      ) team_student_flags ON team_student_flags.team_id = teams.id
    ORDER BY
      latest_score DESC,
      latest_score_marked_at ASC
  `, [teamId, teamId, contestFinished, contestFinished, teamId, teamId, contestFinished, contestFinished]);
   
  jobResults = await db.query(`
    SELECT
      team_id AS team_id,
      (score_raw - score_deduction) AS score,
      started_at AS started_at,
      finished_at AS finished_at
    FROM
      benchmark_jobs
    WHERE
      started_at IS NOT NULL
    AND (
      finished_at IS NOT NULL
      -- score freeze
      AND (team_id = ? OR (team_id != ? AND (? = TRUE OR finished_at < ?)))
    )
    ORDER BY finished_at,
  `, [ teamId, teamId, contestFinished, contestFreezesAt ]);


  for (const result of jobResults) {
    teamGraphScores[result.team_id] = teamGraphScores[result.team_id] ?? [];
    const lbs = new Leaderboard.LeaderboardItem.LeaderboardScore();
    lbs.setScore(result.score);
    lbs.setStartedAt(result.started_at);
    lbs.setMarkedAt(result.finished_at);
    teamGraphScores[result.team_id].push(lbs);
  }
    
  const teams = []
  const generalTeams = []
  const studentTeams = []
  
  for (const team of leaderboard) {
    const item = new Leaderboard.LeaderboardItem();
    item.setScoresList(teamGraphScores[team.id]);
    const bs = new Leaderboard.LeaderboardItem.LeaderboardScore();
    bs.setScore(team.best_score);
    bs.setStartedAt(team.best_score_started_at);
    bs.setMarkedAt(team.best_score_marked_at);
    item.setBestScore(bs);
    const ls = new Leaderboard.LeaderboardItem.LeaderboardScore();
    ls.setScore(team.latest_score);
    ls.setStartedAt(team.latest_score_started_at);
    ls.setMarkedAt(team.latest_score_marked_at);
    item.setLatestScore(ls);
    const teamResource = await getTeamResource(team, false, false, false);
    item.setTeam(teamResource);
    item.setFinishCount(team.finish_count);

    if (team.student === 1) {
      studentTeams.push(team);
    } else {
      generalTeams.push(team);
    }
    teams.push(item);
  }

  const leaderboardResource = new Leaderboard();
  leaderboardResource.setTeamsList(teams);
  leaderboardResource.setGeneralTeamsList(generalTeams);
  leaderboardResource.setStudentTeamsList(studentTeams);
  const contestResource = getContestResource(contest);
  leaderboardResource.setContest(contestResource);
  return leaderboardResource;
}


app.post("/initialize", async (req, res, next) => {
  const db = await connection;
  const request = InitializeRequest.deserializeBinary(Buffer.from(req.body));
  await db.query('TRUNCATE `teams`');
  await db.query('TRUNCATE `contestants`')
  await db.query('TRUNCATE `benchmark_jobs`')
  await db.query('TRUNCATE `clarifications`')
  await db.query('TRUNCATE `notifications`')
  await db.query('TRUNCATE `push_subscriptions`')
  await db.query('TRUNCATE `contest_config`')

  await db.query(
    'INSERT `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, TRUE, NOW(6))',
    [ADMIN_ID, hash.update(ADMIN_PASSWORD).copy().digest("hex")]
  )
  
  const contest = request.getContest();
  if (contest) {
    const openAt = contest.getRegistrationOpenAt();
    const startsAt = contest.getContestStartsAt();
    const freezeAt = contest.getContestFreezesAt();
    const endsAt = contest.getContestFreezesAt();

    if (openAt == null || startsAt == null || freezeAt == null || endsAt == null) {
      return haltPb(res, 400, "initialize の時間が不正です。");
    }
    
    await db.query(`INSERT contest_config (registration_open_at, contest_starts_at, contest_freezes_at, contest_ends_at) VALUES (?, ?, ?, ?)`, [
      new Date(openAt.getSeconds()).toUTCString(),
      new Date(startsAt.getSeconds()).toUTCString(),
      new Date(freezeAt.getSeconds()).toUTCString(),
      new Date(endsAt.getSeconds()).toUTCString(),
    ]);
  } else {
    await db.query(`
    INSERT contest_config (registration_open_at, contest_starts_at, contest_freezes_at, contest_ends_at) VALUES 
    (
      TIMESTAMPADD(SECOND, 0, NOW(6)),
      TIMESTAMPADD(SECOND, 5, NOW(6)),
      TIMESTAMPADD(SECOND, 40, NOW(6)),
      TIMESTAMPADD(SECOND, 50, NOW(6))
    )
    `);
  }

  // TODO 負荷レベルの指定
  const response = new InitializeResponse();
  response.setLanguage("nodejs");
  // 実ベンチマーカーに伝える仮想ベンチマークサーバー(gRPC)のホスト情報
  const benchmarkServer = new InitializeResponse.BenchmarkServer();
  benchmarkServer.setHost("localhost");
  benchmarkServer.setPort(50051);
  response.setBenchmarkServer(benchmarkServer);

  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/admin/clarifications", async (req, res, next) => {
  const db = await connection;
  const loginSuccess = loginRequired(res, { team: false });
  if (!loginSuccess) {
    return;
  }

  const contestatnt = await getCurrentContestant();
  if (contestatnt?.staff == null) {
    haltPb(res, 403, '管理者権限が必要です');
    return;
  }

  const clars = await db.query('SELECT * FROM `clarifications` ORDER BY `updated_at` DESC');

  const clarPbs = [];
  for (const clar of clars) {
    const team = await db.query('SELECT * FROM `teams` WHERE `id` = ? LIMIT 1', [clar.team_id]);
    const clarPb = new Clarification();
    clarPb.setTeam(team);
    clarPbs.push(clarPb);
  }
  
  const response = new ListClarificationsResponse();
  response.setClarificationsList(clarPbs);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/admin/clarifications/:id", async (req, res, next) => {
  const db = await connection;
  const loginSuccess = loginRequired(res, { team: false });
  if (!loginSuccess) {
    return;
  }

  const contestatnt = await getCurrentContestant();
  if (contestatnt?.staff == null) {
    haltPb(res, 403, '管理者権限が必要です');
    return;
  }  const [clar] = await db.query('SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1', [req.params.id]);

  
  const team = await db.query('SELECT * FROM `teams` WHERE `id` = ? LIMIT 1', [clar.team_id]);
  const clarPb = new Clarification();
  clarPb.setTeam(team);
  
  const response = new GetClarificationResponse();
  response.setClarification(clarPb);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.put("/api/admin/clarifications/:id", async (req, res, next) => {
  const db = await connection;
  const loginSuccess = loginRequired(res, { team: false });
  if (!loginSuccess) {
    return;
  }
  const request = RespondClarificationRequest.deserializeBinary(Buffer.from(req.body));
  let clarPb = null;
  await db.beginTransaction();
  const [clarBefore] = await db.query('SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1 FOR UPDATE', [req.params.id]);

  if (clarBefore == null) {
    await db.rollback();
    haltPb(res, 404, '質問が見つかりません');
    return; 
  }
  const wasAnswered = !!clarBefore.answered_at;
  const wasDisclosed = clarBefore.disclosed;

  await db.query(`UPDATE clarifications SET
        disclosed = ?,
        answer = ?,
        updated_at = NOW(6),
        answered_at = NOW(6)
      WHERE id = ?
      LIMIT 1`,
    [request.getDisclose(),
    request.getAnswer(),
    req.params.id]
  )

  const [c] = await db.query(
    'SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1',
    [req.params.id],
  );

  const [team] = await db.query(
    'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1',
    c.team_id,
  );

  // TODO Notifier
  //notifier.notify_clarification_answered(clar, updated: was_answered && was_disclosed == clar[:disclosed])
  clarPb = await getClarificationResource(c, team);

  await db.commit();

  const response = new RespondClarificationResponse();
  response.setClarification(clarPb);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/session", async (req, res, next) => {
  const response = new GetCurrentSessionResponse();
  const contestant = await getCurrentContestant();
  response.setContestant(getContestantResource(contestant));
  const team = await getCurrentTeam({ lock: false });
  const teamResource = await getTeamResource(team);
  response.setTeam(teamResource);
  const contest = await getCurrentContestStatus();
  const contestResource = getContestResource(contest.contest);
  response.setContest(contestResource);
  // TODO set notifier

  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/session", async (req, res, next) => {
  const response = new GetCurrentSessionResponse();
  const contestant = await getCurrentContestant();
  response.setContestant(getContestantResource(contestant));
  const team = await getCurrentTeam({ lock: false });
  const teamResource = await getTeamResource(team);
  response.setTeam(teamResource);
  const contest = await getCurrentContestStatus();
  const contestResource = getContestResource(contest.contest);
  response.setContest(contestResource);
  // TODO set notifier

  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/audience/teams", async (req, res, next) => {
  const db = await connection;
  const teams = await db.query('SELECT * FROM `teams` WHERE `withdrawn` = FALSE ORDER BY `created_at` DESC');
  const items = [];
  for (const team of teams) {
    const members = await db.query('SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`', [team.id]);
    const teamListItem = new AudienceListTeamsResponse.TeamListItem();
    teamListItem.setTeamId(team.id);
    teamListItem.setName(team.name);
    teamListItem.setIsStudent(members.every((member: any) => !!member.student));
    teamListItem.setMemberNamesList(members.map((member: any) => member.name));
    items.push(teamListItem);
  }
  const response = new AudienceListTeamsResponse();
  response.setTeamsList(items);

  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/audience/dashboard", async (req, res, next) => {
  const response = new AudienceDashboardResponse();
  const leaderboard = await getLeaderboardResource();
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.post("/api/contestant/benchmark_jobs", async (req, res, next) => {
  const db = await connection;
  const request = InitializeRequest.deserializeBinary(Buffer.from(req.body));

  await db.beginTransaction();
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  const passRestricted = await contestStatusRestricted(res, [Contest.Status.STARTED], "競技時間外はベンチマークを実行できません");
  if (!passRestricted) {
    return;
  }

  const currentTeam = await getCurrentTeam();
  const [jobCount] = await db.query(
    'SELECT COUNT(*) AS `cnt` FROM `benchmark_jobs` WHERE `team_id` = ? AND `finished_at` IS NULL',
    currentTeam.id
  );
  await db.query(
    'INSERT INTO `benchmark_jobs` (`team_id`, `target_hostname`, `status`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))',
    [currentTeam.id, req.hostname, BenchmarkJob.Status.PENDING]
  )

  const [job] = await db.query('SELECT * FROM `benchmark_jobs` WHERE `id` = (SELECT LAST_INSERT_ID()) LIMIT 1')
  await db.commit();

  const response = new EnqueueBenchmarkJobResponse();
  response.setJob(job);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/contestant/benchmark_jobs", async (req, res, next) => {
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  const response = new ListBenchmarkJobsResponse();
  response.setJobsList(await getBenchmarkJobsResource());
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.get("/api/contestant/benchmark_jobs/:id", async (req, res, next) => {
  const db = await connection;
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  const currentTeam = await getCurrentTeam();
  const [job] = await db.query(
    'SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? AND `id` = ? LIMIT 1',
    [currentTeam.id, req.params.id]
  );

  if (!job) {
    haltPb(res, 404, "ベンチマークジョブが見つかりません")
    return;
  }

  const response = new GetBenchmarkJobResponse();
  response.setJob(job);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
})

app.get("/api/contestant/clarifications", async (req, res, next) => {
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  const currentTeam = await getCurrentTeam();
  const db = await connection;
  const clars = await db.query(
    'SELECT * FROM `clarifications` WHERE `team_id` = ? OR `disclosed` = TRUE ORDER BY `id` DESC',
    currentTeam.id,
  ).map(async (clar: any) => {
    const [team] = await db.query(
      'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1',
      clar.team_id,
    );
    return getClarificationResource(clar, team);
  });

  const response = new ListClarificationsResponse();
  response.setClarificationsList(clars);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
})

app.post("/api/contestant/clarifications", async (req, res, next) => {
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  const request = RespondClarificationRequest.deserializeBinary(Buffer.from(req.body));
  const currentTeam = await getCurrentTeam();
  const db = await connection;
  await db.beginTransaction();

  await db.query(
    'INSERT INTO `clarifications` (`team_id`, `question`, `created_at`, `updated_at`) VALUES (?, ?, NOW(6), NOW(6))',
    [currentTeam.id, request.getQuestion()]
  )

  const [clar] = await db.query('SELECT * FROM `clarifications` WHERE `id` = LAST_INSERT_ID() LIMIT 1')

  await db.commit();

  const response = new RespondClarificationResponse();
  response.setClarification(clar);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
})

app.get("/api/contestant/dashboard", async (req, res, next) => {
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  const response = new DashboardResponse();
  const currentTeam = await getCurrentTeam();
  const leaderboard = await getLeaderboardResource(currentTeam.id);
  response.setLeaderboard(leaderboard);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
})

app.get("/api/contestant/notifications", async (req, res, next) => {
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  const after = req.query.after;
  const db = await connection;
  await db.beginTransaction();
  const currentContestant = await getCurrentContestant();

  const notifications = await db.query(
    after
      ? 'SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `id` > ? ORDER BY `id`'
      : 'SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `read` = FALSE ORDER BY `id`',
    [currentContestant.id, after]
  );

  await db.query(
    'UPDATE `notifications` SET `read` = TRUE WHERE `contestant_id` = ? AND `read` = FALSE',
    [currentContestant.id],
  );

  await db.commit();

  const currentTeam = await getCurrentTeam();
  const [lastAnsweredClar] = await db.query(
    'SELECT `id` FROM `clarifications` WHERE (`team_id` = ? OR `disclosed` = TRUE) AND `answered_at` IS NOT NULL ORDER BY `id` DESC LIMIT 1',
    [currentTeam.id]
  );

  const response = new ListNotificationsResponse();
  response.setLastAnsweredClarificationId(lastAnsweredClar?.id);
  response.setNotificationsList(notifications);
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.post("/api/contestant/push_subscriptions", async (req, res, next) => {
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  /* TODO: notifier
  if (!notifier.vapid_key) {
    haltPb(res, 503, "Web Push は未対応です")
    return
  }
  */

  const request = SubscribeNotificationRequest.deserializeBinary(Buffer.from(req.body));
  const currentContestant = await getCurrentContestant();
  const db = await connection;
  await db.query(
    'INSERT INTO `push_subscriptions` (`contestant_id`, `endpoint`, `p256dh`, `auth`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, NOW(6), NOW(6))',
    [currentContestant.id, request.getEndpoint(), request.getP256dh(), request.getAuth()]
  );

  const response = new SubscribeNotificationResponse();
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.delete("/api/contestant/push_subscriptions", async (req, res, next) => {
  const loginSuccess = loginRequired(res);
  if (!loginSuccess) {
    return;
  }

  /* TODO: notifier
  if (!notifier.vapid_key) {
    haltPb(res, 503, "Web Push は未対応です")
    return
  }
  */

  const request = UnsubscribeNotificationRequest.deserializeBinary(Buffer.from(req.body));
  const currentContestant = await getCurrentContestant();
  const db = await connection;
  await db.query(
    'DELETE FROM `push_subscriptions` WHERE `contestant_id` = ? AND `endpoint` = ? LIMIT 1',
    [currentContestant.id, request.getEndpoint()]
  );

  const response = new UnsubscribeNotificationResponse();
  res.contentType(`application/vnd.google.protobuf`);
  res.end(Buffer.from(response.serializeBinary()));
});

app.listen(process.env.PORT ?? 9292, () => {
  console.log("Listening on 9292");
});