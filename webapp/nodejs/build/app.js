"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateToTimestamp = exports.app = exports.secureRandom = exports.notifier = exports.getDB = exports.dbinfo = void 0;
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const timestamp_pb_1 = require("google-protobuf/google/protobuf/timestamp_pb");
const notifier_1 = require("./notifier");
const initialize_pb_1 = require("../proto/xsuportal/services/admin/initialize_pb");
const error_pb_1 = require("../proto/xsuportal/error_pb");
const clarification_pb_1 = require("../proto/xsuportal/resources/clarification_pb");
const clarifications_pb_1 = require("../proto/xsuportal/services/admin/clarifications_pb");
const team_pb_1 = require("../proto/xsuportal/resources/team_pb");
const contestant_pb_1 = require("../proto/xsuportal/resources/contestant_pb");
const contest_pb_1 = require("../proto/xsuportal/resources/contest_pb");
const me_pb_1 = require("../proto/xsuportal/services/common/me_pb");
const team_list_pb_1 = require("../proto/xsuportal/services/audience/team_list_pb");
const dashboard_pb_1 = require("../proto/xsuportal/services/audience/dashboard_pb");
const leaderboard_pb_1 = require("../proto/xsuportal/resources/leaderboard_pb");
const benchmark_job_pb_1 = require("../proto/xsuportal/resources/benchmark_job_pb");
const benchmark_pb_1 = require("../proto/xsuportal/services/admin/benchmark_pb");
const benchmark_pb_2 = require("../proto/xsuportal/services/contestant/benchmark_pb");
const benchmark_result_pb_1 = require("../proto/xsuportal/resources/benchmark_result_pb");
const dashboard_pb_2 = require("../proto/xsuportal/services/admin/dashboard_pb");
const notifications_pb_1 = require("../proto/xsuportal/services/contestant/notifications_pb");
const signup_pb_1 = require("../proto/xsuportal/services/contestant/signup_pb");
const login_pb_1 = require("../proto/xsuportal/services/contestant/login_pb");
const logout_pb_1 = require("../proto/xsuportal/services/contestant/logout_pb");
const session_pb_1 = require("../proto/xsuportal/services/registration/session_pb");
const create_team_pb_1 = require("../proto/xsuportal/services/registration/create_team_pb");
const join_pb_1 = require("../proto/xsuportal/services/registration/join_pb");
const clarifications_pb_2 = require("../proto/xsuportal/services/contestant/clarifications_pb");
const TEAM_CAPACITY = 10;
const MYSQL_ER_DUP_ENTRY = 1062;
const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'admin';
const DEBUG_CONTEST_STATUS_FILE_PATH = '/tmp/XSUPORTAL_CONTEST_STATUS';
exports.dbinfo = {
    host: process.env['MYSQL_HOSTNAME'] ?? '127.0.0.1',
    port: Number.parseInt(process.env['MYSQL_PORT'] ?? '3306'),
    user: process.env['MYSQL_USER'] ?? 'isucon',
    database: process.env['MYSQL_DATABASE'] ?? 'xsuportal',
    password: process.env['MYSQL_PASS'] || 'isucon',
    charset: 'utf8mb4',
    timezone: '+00:00'
};
const pool = promise_mysql_1.default.createPool(exports.dbinfo);
exports.getDB = async () => (await pool).getConnection();
exports.notifier = new notifier_1.Notifier(pool);
const haltPb = (res, code, humanMessage) => {
    res.contentType('application/vnd.google.protobuf; proto=xsuportal.proto.Error');
    res.status(code);
    const error = new error_pb_1.Error();
    error.setCode(code);
    error.setHumanMessage(humanMessage);
    console.error(code, humanMessage);
    res.end(Buffer.from(error.serializeBinary()));
};
exports.secureRandom = (size) => {
    const buffer = crypto_1.default.randomBytes(size);
    const base64 = buffer.toString('base64');
    return base64;
};
exports.app = express_1.default();
exports.app.set('trust proxy', 1);
exports.app.use(express_1.default.static("../public"));
// app.use(morgan('combined'));
exports.app.use(cookie_session_1.default({
    secret: 'tagomoris',
    name: 'session_xsucon',
    maxAge: 60 * 60 * 1000
}));
// rawbody
exports.app.use(express_1.default.raw({ type: "application/vnd.google.protobuf" }));
exports.app.use((req, res, next) => {
    req.context = {};
    next();
});
exports.convertDateToTimestamp = (date) => {
    const timestamp = new timestamp_pb_1.Timestamp();
    timestamp.fromDate(date);
    return timestamp;
};
const getCurrentContestant = function () {
    return async (req, db, { lock = false } = {}) => {
        if (req.context.currentContestant) {
            return req.context.currentContestant;
        }
        const id = req.session.contestant_id;
        if (!id)
            return null;
        const result = await db.query(lock
            ? "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1 FOR UPDATE"
            : "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1", id);
        req.context.currentContestant = result?.[0];
        return req.context.currentContestant;
    };
}();
const getCurrentTeam = function () {
    return async (req, db, { lock = false } = {}) => {
        if (req.context.currentTeam) {
            return req.context.currentTeam;
        }
        const currentContestant = await getCurrentContestant(req, db);
        if (!currentContestant)
            return null;
        const result = await db.query(lock
            ? "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1 FOR UPDATE"
            : "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1", [currentContestant['team_id']]);
        req.context.currentTeam = result?.[0];
        return req.context.currentTeam;
    };
}();
const getCurrentContestStatus = async (db) => {
    const [contest] = await db.query(`
      SELECT
        *,
        NOW(6) AS \`current_time\`,
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
    if (process.env['APP_ENV'] != "production" && fs_1.default.existsSync(DEBUG_CONTEST_STATUS_FILE_PATH)) {
        contestStatusStr = fs_1.default.readFileSync(DEBUG_CONTEST_STATUS_FILE_PATH).toString();
    }
    let status;
    switch (contestStatusStr) {
        case "standby":
            status = contest_pb_1.Contest.Status.STANDBY;
            break;
        case "registration":
            status = contest_pb_1.Contest.Status.REGISTRATION;
            break;
        case "started":
            status = contest_pb_1.Contest.Status.STARTED;
            break;
        case "finished":
            status = contest_pb_1.Contest.Status.FINISHED;
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
const loginRequired = async (req, res, db, { team = true, lock = false } = {}) => {
    const currentContestant = await getCurrentContestant(req, db, { lock });
    if (!currentContestant) {
        haltPb(res, 401, "ログインが必要です");
        return false;
    }
    if (!team)
        return true;
    const currentTeam = await getCurrentTeam(req, db, { lock });
    if (!currentTeam) {
        haltPb(res, 403, "参加登録が必要です");
        return false;
    }
    return true;
};
async function contestStatusRestricted(res, statuses, msg, db) {
    const currentContest = await getCurrentContestStatus(db);
    if (!statuses.includes(currentContest.contest.status)) {
        haltPb(res, 403, msg);
        return false;
    }
    return true;
}
function getContestantResource(contestant, detail = false) {
    const contestantResource = new contestant_pb_1.Contestant();
    contestantResource.setId(contestant.id);
    contestantResource.setTeamId(contestant.team_id);
    contestantResource.setName(contestant.name);
    contestantResource.setIsStudent(contestant.student);
    contestantResource.setIsStaff(contestant.staff);
    return contestantResource;
}
async function getTeamResource(team, db, detail = false, enableMembers = true, memberDetail = false) {
    const teamResource = new team_pb_1.Team();
    let members = null;
    let leader = null;
    let leader_pb = null;
    let members_pb = null;
    if (enableMembers) {
        if (team.leader_id != null) {
            [leader] = await db.query('SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1', [team.leader_id]);
        }
        members = await db.query('SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`', [team.id]);
        leader_pb = leader ? getContestantResource(leader, memberDetail) : null;
        members_pb = members ? members.map((m) => getContestantResource(m, memberDetail)) : null;
    }
    teamResource.setId(team.id);
    teamResource.setName(team.name);
    teamResource.setLeaderId(team.leader_id);
    teamResource.setMemberIdsList(members ? members.map((m) => m.id) : null);
    teamResource.setWithdrawn(team.withdrawn);
    if (detail) {
        const teamDetail = new team_pb_1.Team.TeamDetail();
        teamDetail.setEmailAddress(team.email_address);
        teamDetail.setInviteToken(team.invite_token);
        teamResource.setDetail(teamDetail);
    }
    if (leader_pb) {
        teamResource.setLeader(leader_pb);
    }
    teamResource.setMembersList(members_pb);
    if (team.student) {
        const studentStatus = new team_pb_1.Team.StudentStatus();
        studentStatus.setStatus(team.student != 0 && !!team.student);
        teamResource.setStudent(studentStatus);
    }
    return teamResource;
}
async function getBenchmarkJobResource(job) {
    const benchmarkJob = new benchmark_job_pb_1.BenchmarkJob();
    benchmarkJob.setId(job.id);
    benchmarkJob.setTeamId(job.team_id);
    benchmarkJob.setStatus(job.status);
    benchmarkJob.setTargetHostname(job.target_hostname);
    benchmarkJob.setCreatedAt(job.created_at ? exports.convertDateToTimestamp(job.created_at) : null);
    benchmarkJob.setUpdatedAt(job.updated_at ? exports.convertDateToTimestamp(job.updated_at) : null);
    benchmarkJob.setStartedAt(job.started_at ? exports.convertDateToTimestamp(job.started_at) : null);
    benchmarkJob.setFinishedAt(job.finished_at ? exports.convertDateToTimestamp(job.finished_at) : null);
    benchmarkJob.setResult(job.finished_at ? await getBenchmarkResultResource(job) : null);
    return benchmarkJob;
}
async function getBenchmarkJobsResource(req, db, limit) {
    const currentTeam = await getCurrentTeam(req, db);
    const jobs = await db.query(`SELECT * FROM benchmark_jobs WHERE team_id = ? ORDER BY created_at DESC ${limit ? `LIMIT ${limit}` : ''}`, [currentTeam.id]);
    return await Promise.all(jobs.map(job => getBenchmarkJobResource(job)));
}
async function getBenchmarkResultResource(job) {
    const hasScore = job.score_raw && job.score_deducation;
    const result = new benchmark_result_pb_1.BenchmarkResult();
    result.setFinished(!!job.finished_at);
    result.setPassed(job.passed);
    if (hasScore) {
        result.setScore(job.score_raw - job.score_deducation);
        const scoreBreakdown = new benchmark_result_pb_1.BenchmarkResult.ScoreBreakdown();
        scoreBreakdown.setRaw(job.score_raw);
        scoreBreakdown.setDeduction(job.score_deducation);
        result.setScoreBreakdown(scoreBreakdown);
    }
    result.setReason(job.reason);
    return result;
}
async function getClarificationResource(clar, team, db) {
    const clarificationResource = new clarification_pb_1.Clarification();
    clarificationResource.setId(clar.id);
    clarificationResource.setTeamId(clar.team_id);
    clarificationResource.setQuestion(clar.question);
    clarificationResource.setAnswer(clar.answer);
    clarificationResource.setAnswered(!!clar.answered_at);
    clarificationResource.setDisclosed(clar.disclosed);
    clarificationResource.setCreatedAt(clar.created_at ? exports.convertDateToTimestamp(clar.created_at) : null);
    const t = await getTeamResource(team, db);
    clarificationResource.setTeam(t);
    return clarificationResource;
}
function getContestResource(contest) {
    const contestResource = new contest_pb_1.Contest();
    contestResource.setStatus(contest.status);
    contestResource.setContestStartsAt(contest.contest_starts_at ? exports.convertDateToTimestamp(contest.contest_starts_at) : null);
    contestResource.setContestEndsAt(contest.contest_ends_at ? exports.convertDateToTimestamp(contest.contest_ends_at) : null);
    contestResource.setContestFreezesAt(contest.contest_freezes_at ? exports.convertDateToTimestamp(contest.contest_freezes_at) : null);
    contestResource.setRegistrationOpenAt(contest.registration_open_at ? exports.convertDateToTimestamp(contest.registration_open_at) : null);
    contestResource.setFrozen(contest.frozen);
    return contestResource;
}
async function getLeaderboardResource(db, teamId = 0) {
    const contest = (await getCurrentContestStatus(db)).contest;
    const contestFinished = contest.status === contest_pb_1.Contest.Status.FINISHED;
    const contestFreezesAt = contest.contest_freezes_at;
    let leaderboard = null;
    let jobResults = null;
    let teamGraphScores = {};
    try {
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
      ORDER BY finished_at
    `, [teamId, teamId, contestFinished, contestFreezesAt]);
        await db.commit();
    }
    catch (e) {
        await db.rollback();
    }
    for (const result of jobResults) {
        teamGraphScores[result.team_id] = teamGraphScores[result.team_id] ?? [];
        const lbs = new leaderboard_pb_1.Leaderboard.LeaderboardItem.LeaderboardScore();
        lbs.setScore(result.score);
        lbs.setStartedAt(result.started_at ? exports.convertDateToTimestamp(result.started_at) : null);
        lbs.setMarkedAt(result.finished_at ? exports.convertDateToTimestamp(result.finished_at) : null);
        teamGraphScores[result.team_id].push(lbs);
    }
    const teams = [];
    const generalTeams = [];
    const studentTeams = [];
    for (const team of leaderboard) {
        const item = new leaderboard_pb_1.Leaderboard.LeaderboardItem();
        item.setScoresList(teamGraphScores[team.id]);
        const bs = new leaderboard_pb_1.Leaderboard.LeaderboardItem.LeaderboardScore();
        bs.setScore(team.best_score);
        bs.setStartedAt(team.best_score_started_at ? exports.convertDateToTimestamp(team.best_score_started_at) : null);
        bs.setMarkedAt(team.best_score_marked_at ? exports.convertDateToTimestamp(team.best_score_marked_at) : null);
        item.setBestScore(bs);
        const ls = new leaderboard_pb_1.Leaderboard.LeaderboardItem.LeaderboardScore();
        ls.setScore(team.latest_score);
        ls.setStartedAt(team.latest_score_started_at ? exports.convertDateToTimestamp(team.latest_score_started_at) : null);
        ls.setMarkedAt(team.latest_score_marked_at ? exports.convertDateToTimestamp(team.latest_score_marked_at) : null);
        item.setLatestScore(ls);
        const teamResource = await getTeamResource(team, db, false, false, false);
        item.setTeam(teamResource);
        item.setFinishCount(team.finish_count);
        if (team.student === 1) {
            studentTeams.push(item);
        }
        else {
            generalTeams.push(item);
        }
        teams.push(item);
    }
    const leaderboardResource = new leaderboard_pb_1.Leaderboard();
    leaderboardResource.setTeamsList(teams);
    leaderboardResource.setGeneralTeamsList(generalTeams);
    leaderboardResource.setStudentTeamsList(studentTeams);
    const contestResource = getContestResource(contest);
    leaderboardResource.setContest(contestResource);
    return leaderboardResource;
}
const audiencePaths = "/ /registration /signup /login /logout /teams".split(" ");
for (const audiencePath of audiencePaths) {
    exports.app.get(audiencePath, (req, res, next) => {
        res.sendFile(path_1.default.resolve("public", "audience.html"));
    });
}
const contestantPaths = "/contestant /contestant/benchmark_jobs /contestant/benchmark_jobs/:id /contestant/clarifications".split(" ");
for (const contestantPath of contestantPaths) {
    exports.app.get(contestantPath, (req, res, next) => {
        res.sendFile(path_1.default.resolve("public", "contestant.html"));
    });
}
const adminPaths = "/admin /admin/ /admin/clarifications /admin/clarifications/:id".split(" ");
for (const adminPath of adminPaths) {
    exports.app.get(adminPath, (req, res, next) => {
        res.sendFile(path_1.default.resolve("public", "admin.html"));
    });
}
exports.app.use(express_1.default.static(path_1.default.resolve("public")));
exports.app.post("/initialize", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const request = initialize_pb_1.InitializeRequest.deserializeBinary(Uint8Array.from(req.body));
        await db.query('TRUNCATE `teams`');
        await db.query('TRUNCATE `contestants`');
        await db.query('TRUNCATE `benchmark_jobs`');
        await db.query('TRUNCATE `clarifications`');
        await db.query('TRUNCATE `notifications`');
        await db.query('TRUNCATE `push_subscriptions`');
        await db.query('TRUNCATE `contest_config`');
        await db.query('INSERT `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, TRUE, NOW(6))', [ADMIN_ID, crypto_1.default.createHash('sha256').update(ADMIN_PASSWORD).copy().digest("hex")]);
        const contest = request.getContest();
        if (contest) {
            const openAt = contest.getRegistrationOpenAt();
            const startsAt = contest.getContestStartsAt();
            const freezeAt = contest.getContestFreezesAt();
            const endsAt = contest.getContestEndsAt();
            if (openAt == null || startsAt == null || freezeAt == null || endsAt == null) {
                return haltPb(res, 400, "initialize の時間が不正です。");
            }
            await db.query(`INSERT contest_config (registration_open_at, contest_starts_at, contest_freezes_at, contest_ends_at) VALUES (?, ?, ?, ?)`, [
                openAt.toDate(),
                startsAt.toDate(),
                freezeAt.toDate(),
                endsAt.toDate()
            ]);
        }
        else {
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
        const response = new initialize_pb_1.InitializeResponse();
        response.setLanguage("nodejs");
        // 実ベンチマーカーに伝える仮想ベンチマークサーバー(gRPC)のホスト情報
        const benchmarkServer = new initialize_pb_1.InitializeResponse.BenchmarkServer();
        benchmarkServer.setHost("localhost");
        benchmarkServer.setPort(50051);
        response.setBenchmarkServer(benchmarkServer);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/admin/clarifications", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db, { team: false });
        if (!loginSuccess) {
            return;
        }
        const contestatnt = await getCurrentContestant(req, db);
        if (!contestatnt?.staff) {
            return haltPb(res, 403, '管理者権限が必要です');
        }
        const clars = await db.query('SELECT * FROM `clarifications` ORDER BY `updated_at` DESC');
        const clarPbs = [];
        for (const clar of clars) {
            const [team] = await db.query('SELECT * FROM `teams` WHERE `id` = ? LIMIT 1', [clar.team_id]);
            clarPbs.push(await getClarificationResource(clar, team, db));
        }
        const response = new clarifications_pb_1.ListClarificationsResponse();
        response.setClarificationsList(clarPbs);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/admin/clarifications/:id", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db, { team: false });
        if (!loginSuccess) {
            return;
        }
        const contestatnt = await getCurrentContestant(req, db);
        if (!contestatnt?.staff) {
            return haltPb(res, 403, '管理者権限が必要です');
        }
        const [clar] = await db.query('SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1', [req.params.id]);
        const [team] = await db.query('SELECT * FROM `teams` WHERE `id` = ? LIMIT 1', [clar.team_id]);
        const response = new clarifications_pb_1.GetClarificationResponse();
        response.setClarification(await getClarificationResource(clar, team, db));
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.put("/api/admin/clarifications/:id", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        await db.beginTransaction();
        const loginSuccess = await loginRequired(req, res, db, { team: false });
        if (!loginSuccess) {
            await db.rollback();
            return;
        }
        const contestatnt = await getCurrentContestant(req, db);
        if (!contestatnt?.staff) {
            await db.rollback();
            return haltPb(res, 403, '管理者権限が必要です');
        }
        const request = clarifications_pb_1.RespondClarificationRequest.deserializeBinary(Uint8Array.from(req.body));
        const [clarBefore] = await db.query('SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1 FOR UPDATE', [req.params.id]);
        if (clarBefore == null) {
            await db.rollback();
            return haltPb(res, 404, '質問が見つかりません');
        }
        const wasAnswered = !!clarBefore.answered_at;
        const wasDisclosed = clarBefore.disclosed;
        await db.query(`UPDATE clarifications SET
          disclosed = ?,
          answer = ?,
          updated_at = NOW(6),
          answered_at = NOW(6)
        WHERE id = ?
        LIMIT 1`, [request.getDisclose(),
            request.getAnswer(),
            req.params.id]);
        const [clar] = await db.query('SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1', [req.params.id]);
        const [team] = await db.query('SELECT * FROM `teams` WHERE `id` = ? LIMIT 1', clar.team_id);
        await db.commit();
        exports.notifier.notifyClarificationAnswered(clar, wasAnswered && wasDisclosed == clar.disclosed);
        const clarPb = await getClarificationResource(clar, team, db);
        const response = new clarifications_pb_1.RespondClarificationResponse();
        response.setClarification(clarPb);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        await db.rollback();
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/session", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const response = new me_pb_1.GetCurrentSessionResponse();
        const contestant = await getCurrentContestant(req, db);
        response.setContestant(contestant ? getContestantResource(contestant) : null);
        const team = await getCurrentTeam(req, db, { lock: false });
        response.setTeam(team ? await getTeamResource(team, db) : null);
        const contest = await getCurrentContestStatus(db);
        const contestResource = getContestResource(contest.contest);
        response.setContest(contestResource);
        response.setPushVapidKey(exports.notifier.getVAPIDKey()?.publicKey);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/audience/teams", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const teams = await db.query('SELECT * FROM `teams` WHERE `withdrawn` = FALSE ORDER BY `created_at` DESC');
        const items = [];
        for (const team of teams) {
            const members = await db.query('SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`', [team.id]);
            const teamListItem = new team_list_pb_1.ListTeamsResponse.TeamListItem();
            teamListItem.setTeamId(team.id);
            teamListItem.setName(team.name);
            teamListItem.setIsStudent(members.every((member) => !!member.student));
            teamListItem.setMemberNamesList(members.map((member) => member.name));
            items.push(teamListItem);
        }
        const response = new team_list_pb_1.ListTeamsResponse();
        response.setTeamsList(items);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/audience/dashboard", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const response = new dashboard_pb_1.DashboardResponse();
        const leaderboard = await getLeaderboardResource(db);
        response.setLeaderboard(leaderboard);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/registration/session", async (req, res, next) => {
    let team = null;
    const db = await exports.getDB();
    try {
        const currentTeam = await getCurrentTeam(req, db);
        if (currentTeam) {
            team = currentTeam;
        }
        else if (req.query && req.query.team_id && req.query.invite_token) {
            let [t] = await db.query('SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1', [req.query.team_id, req.query.invite_token]);
            if (t == null) {
                return haltPb(res, 404, "招待URLが無効です");
            }
            team = t;
        }
        let members;
        if (team) {
            members = await db.query('SELECT * FROM `contestants` WHERE `team_id` = ?', [team.id]);
        }
        const currentContestant = await getCurrentContestant(req, db);
        let status = null;
        if (currentContestant?.team_id) {
            status = session_pb_1.GetRegistrationSessionResponse.Status.JOINED;
        }
        else if (team != null && members.length >= 3) {
            status = session_pb_1.GetRegistrationSessionResponse.Status.NOT_JOINABLE;
        }
        else if (currentContestant == null) {
            status = session_pb_1.GetRegistrationSessionResponse.Status.NOT_LOGGED_IN;
        }
        else if (team != null) {
            status = session_pb_1.GetRegistrationSessionResponse.Status.JOINABLE;
        }
        else if (team == null) {
            status = session_pb_1.GetRegistrationSessionResponse.Status.CREATABLE;
        }
        else {
            throw new Error("undeteminable status");
        }
        const response = new session_pb_1.GetRegistrationSessionResponse();
        if (team) {
            const teamResource = await getTeamResource(team, db, currentContestant.id == currentTeam.leader_id, true, false);
            response.setTeam(teamResource);
            response.setMemberInviteUrl(`/registration?team_id=${team.id}&invite_token=${team.invite_token}`);
            response.setInviteToken(team.invite_token);
        }
        response.setStatus(status);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.post("/api/registration/team", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const request = create_team_pb_1.CreateTeamRequest.deserializeBinary(Uint8Array.from(req.body));
        const loginSuccess = await loginRequired(req, res, db, { team: false });
        if (!loginSuccess) {
            return;
        }
        const currentContestStatus = await getCurrentContestStatus(db);
        if (currentContestStatus.contest.status !== contest_pb_1.Contest.Status.REGISTRATION) {
            return haltPb(res, 403, "チーム登録期間ではありません");
        }
        const currentContestant = await getCurrentContestant(req, db);
        await db.query('LOCK TABLES `teams` WRITE, `contestants` WRITE');
        const inviteToken = exports.secureRandom(64);
        const [withinCapacity] = await db.query('SELECT COUNT(*) < ? AS `within_capacity` FROM `teams`', [TEAM_CAPACITY]);
        if (withinCapacity.within_capacity != 1) {
            return haltPb(res, 403, "チーム登録数上限です");
        }
        await db.query('INSERT INTO `teams` (`name`, `email_address`, `invite_token`, `created_at`) VALUES (?, ?, ?, NOW(6))', [request.getTeamName(), request.getEmailAddress(), inviteToken]);
        const [{ id: teamId }] = await db.query('SELECT LAST_INSERT_ID() AS `id`');
        if (teamId == null) {
            return haltPb(res, 500, "チームを登録できませんでした");
        }
        await db.query('UPDATE `contestants` SET `name` = ?, `student` = ?, `team_id` = ? WHERE `id` = ? LIMIT 1', [
            request.getName(),
            request.getIsStudent(),
            teamId,
            currentContestant.id,
        ]);
        await db.query('UPDATE `teams` SET `leader_id` = ? WHERE `id` = ? LIMIT 1', [currentContestant.id, teamId]);
        const response = new create_team_pb_1.CreateTeamResponse();
        response.setTeamId(teamId);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.query('UNLOCK TABLES');
        await db.release();
    }
});
exports.app.post("/api/registration/contestant", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        await db.beginTransaction();
        const request = join_pb_1.JoinTeamRequest.deserializeBinary(Uint8Array.from(req.body));
        const currentContestant = await getCurrentContestant(req, db);
        const currentContestStatus = await getCurrentContestStatus(db);
        if (currentContestStatus.contest.status !== contest_pb_1.Contest.Status.REGISTRATION) {
            await db.rollback();
            return haltPb(res, 403, "チーム登録期間ではありません");
        }
        const loginSuccess = await loginRequired(req, res, db, { team: false, lock: true });
        if (!loginSuccess) {
            await db.rollback();
            return;
        }
        const [team] = await db.query('SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1 FOR UPDATE', [
            request.getTeamId(), request.getInviteToken()
        ]);
        if (team == null) {
            await db.rollback();
            return haltPb(res, 400, '招待URLが不正です');
        }
        const [members] = await db.query('SELECT COUNT(*) AS `cnt` FROM `contestants` WHERE `team_id` = ?', [request.getTeamId()]);
        if (members.cnt >= 3) {
            await db.rollback();
            return haltPb(res, 400, 'チーム人数の上限に達しています');
        }
        await db.query('UPDATE `contestants` SET `team_id` = ?, `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1', [
            request.getTeamId(),
            request.getName(),
            request.getIsStudent(),
            currentContestant.id,
        ]);
        await db.commit();
        const response = new join_pb_1.JoinTeamResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        await db.rollback();
    }
    finally {
        await db.release();
    }
});
exports.app.put("/api/registration", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        await db.beginTransaction();
        const request = session_pb_1.UpdateRegistrationRequest.deserializeBinary(Uint8Array.from(req.body));
        const currentContestant = await getCurrentContestant(req, db);
        const currentTeam = await getCurrentTeam(req, db);
        const loginSuccess = await loginRequired(req, res, db, { team: false, lock: true });
        if (!loginSuccess) {
            await db.rollback();
            return;
        }
        if (currentTeam.leader_id == currentContestant.id) {
            await db.query('UPDATE `teams` SET `name` = ?, `email_address` = ? WHERE `id` = ? LIMIT 1', [request.getTeamName(), request.getEmailAddress(), currentTeam.id]);
        }
        await db.query('UPDATE `contestants` SET `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1', [
            request.getName(), request.getIsStudent(), currentContestant.id
        ]);
        await db.commit();
        const response = new session_pb_1.UpdateRegistrationResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
        await db.rollback();
    }
    finally {
        await db.release();
    }
});
exports.app.delete("/api/registration", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        await db.beginTransaction();
        const currentContestant = await getCurrentContestant(req, db);
        const currentTeam = await getCurrentTeam(req, db);
        const loginSuccess = await loginRequired(req, res, db, { team: false, lock: true });
        if (!loginSuccess) {
            await db.rollback();
            return;
        }
        const currentContestStatus = await getCurrentContestStatus(db);
        if (currentContestStatus.contest.status !== contest_pb_1.Contest.Status.REGISTRATION) {
            await db.rollback();
            return haltPb(res, 403, "チーム登録期間外は辞退できません");
        }
        if (currentTeam.leader_id == currentTeam.id) {
            await db.query('UPDATE `teams` SET `withdrawn` = TRUE, `leader_id` = NULL WHERE `id` = ? LIMIT 1', [currentTeam.id]);
            await db.query('UPDATE `contestants` SET `team_id` = NULL WHERE `team_id` = ?', [currentTeam.id]);
        }
        else {
            await db.query('UPDATE `contestants` SET `team_id` = NULL WHERE `id` = ? LIMIT 1', [currentContestant.id]);
        }
        await db.commit();
        const response = new session_pb_1.DeleteRegistrationResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        await db.rollback();
    }
    finally {
        await db.release();
    }
});
exports.app.post("/api/contestant/benchmark_jobs", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        await db.beginTransaction();
        const request = benchmark_pb_2.EnqueueBenchmarkJobRequest.deserializeBinary(Uint8Array.from(req.body));
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            await db.rollback();
            return;
        }
        const passRestricted = await contestStatusRestricted(res, [contest_pb_1.Contest.Status.STARTED], "競技時間外はベンチマークを実行できません", db);
        if (!passRestricted) {
            await db.rollback();
            return;
        }
        const currentTeam = await getCurrentTeam(req, db);
        const [jobCount] = await db.query('SELECT COUNT(*) AS `cnt` FROM `benchmark_jobs` WHERE `team_id` = ? AND `finished_at` IS NULL', currentTeam.id);
        if (jobCount && jobCount.cnt > 0) {
            await db.rollback();
            return haltPb(res, 403, "既にベンチマークを実行中です");
        }
        await db.query('INSERT INTO `benchmark_jobs` (`team_id`, `target_hostname`, `status`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))', [currentTeam.id, request.getTargetHostname(), benchmark_job_pb_1.BenchmarkJob.Status.PENDING]);
        await db.commit();
        const [job] = await db.query('SELECT * FROM `benchmark_jobs` WHERE `id` = (SELECT LAST_INSERT_ID()) LIMIT 1');
        const response = new benchmark_pb_2.EnqueueBenchmarkJobResponse();
        response.setJob(await getBenchmarkJobResource(job));
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        await db.rollback();
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/contestant/benchmark_jobs", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            return;
        }
        const response = new benchmark_pb_2.ListBenchmarkJobsResponse();
        response.setJobsList(await getBenchmarkJobsResource(req, db));
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/contestant/benchmark_jobs/:id", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            return;
        }
        const currentTeam = await getCurrentTeam(req, db);
        const [job] = await db.query('SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? AND `id` = ? LIMIT 1', [currentTeam.id, req.params.id]);
        if (!job) {
            return haltPb(res, 404, "ベンチマークジョブが見つかりません");
        }
        const response = new benchmark_pb_1.GetBenchmarkJobResponse();
        response.setJob(await getBenchmarkJobResource(job));
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/contestant/clarifications", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            return;
        }
        const currentTeam = await getCurrentTeam(req, db);
        const rows = await db.query('SELECT * FROM `clarifications` WHERE `team_id` = ? OR `disclosed` = TRUE ORDER BY `id` DESC', currentTeam.id);
        const clars = [];
        for (const row of rows) {
            const [team] = await db.query('SELECT * FROM `teams` WHERE `id` = ? LIMIT 1', row.team_id);
            clars.push(await getClarificationResource(row, team, db));
        }
        const response = new clarifications_pb_1.ListClarificationsResponse();
        response.setClarificationsList(clars);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.post("/api/contestant/clarifications", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        await db.beginTransaction();
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            await db.rollback();
            return;
        }
        const request = clarifications_pb_2.RequestClarificationRequest.deserializeBinary(Uint8Array.from(req.body));
        const currentTeam = await getCurrentTeam(req, db);
        await db.query('INSERT INTO `clarifications` (`team_id`, `question`, `created_at`, `updated_at`) VALUES (?, ?, NOW(6), NOW(6))', [currentTeam.id, request.getQuestion()]);
        await db.commit();
        const [clar] = await db.query('SELECT * FROM `clarifications` WHERE `id` = LAST_INSERT_ID() LIMIT 1');
        const response = new clarifications_pb_2.RequestClarificationResponse();
        response.setClarification(await getClarificationResource(clar, currentTeam, db));
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        await db.rollback();
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/contestant/dashboard", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            return;
        }
        const response = new dashboard_pb_2.DashboardResponse();
        const currentTeam = await getCurrentTeam(req, db);
        const leaderboard = await getLeaderboardResource(db, currentTeam.id);
        response.setLeaderboard(leaderboard);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.get("/api/contestant/notifications", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        await db.beginTransaction();
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            await db.rollback();
            return;
        }
        const after = req.query.after;
        const currentContestant = await getCurrentContestant(req, db);
        const notifications = await db.query(after
            ? 'SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `id` > ? ORDER BY `id`'
            : 'SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `read` = FALSE ORDER BY `id`', [currentContestant.id, after]);
        await db.query('UPDATE `notifications` SET `read` = TRUE WHERE `contestant_id` = ? AND `read` = FALSE', [currentContestant.id]);
        await db.commit();
        const currentTeam = await getCurrentTeam(req, db);
        const [lastAnsweredClar] = await db.query('SELECT `id` FROM `clarifications` WHERE (`team_id` = ? OR `disclosed` = TRUE) AND `answered_at` IS NOT NULL ORDER BY `id` DESC LIMIT 1', [currentTeam.id]);
        const response = new notifications_pb_1.ListNotificationsResponse();
        response.setLastAnsweredClarificationId(lastAnsweredClar?.id);
        response.setNotificationsList(notifications);
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        await db.rollback();
    }
    finally {
        await db.release();
    }
});
exports.app.post("/api/contestant/push_subscriptions", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            return;
        }
        if (!exports.notifier.getVAPIDKey()) {
            haltPb(res, 503, "Web Push は未対応です");
            return;
        }
        const request = notifications_pb_1.SubscribeNotificationRequest.deserializeBinary(Uint8Array.from(req.body));
        const currentContestant = await getCurrentContestant(req, db);
        await db.query('INSERT INTO `push_subscriptions` (`contestant_id`, `endpoint`, `p256dh`, `auth`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, NOW(6), NOW(6))', [currentContestant.id, request.getEndpoint(), request.getP256dh(), request.getAuth()]);
        const response = new notifications_pb_1.SubscribeNotificationResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.delete("/api/contestant/push_subscriptions", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const loginSuccess = await loginRequired(req, res, db);
        if (!loginSuccess) {
            return;
        }
        if (!exports.notifier.getVAPIDKey()) {
            haltPb(res, 503, "Web Push は未対応です");
            return;
        }
        const request = notifications_pb_1.UnsubscribeNotificationRequest.deserializeBinary(Uint8Array.from(req.body));
        const currentContestant = await getCurrentContestant(req, db);
        await db.query('DELETE FROM `push_subscriptions` WHERE `contestant_id` = ? AND `endpoint` = ? LIMIT 1', [currentContestant.id, request.getEndpoint()]);
        const response = new notifications_pb_1.UnsubscribeNotificationResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.post("/api/signup", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const request = signup_pb_1.SignupRequest.deserializeBinary(Uint8Array.from(req.body));
        await db.query('INSERT INTO `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, FALSE, NOW(6))', [request.getContestantId(), crypto_1.default.createHash('sha256').update(request.getPassword(), "utf8").digest('hex')]);
        req.session.contestant_id = request.getContestantId();
        const response = new signup_pb_1.SignupResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        if (e.code !== 'ER_DUP_ENTRY')
            throw e;
        haltPb(res, 400, "IDが既に登録されています");
    }
    finally {
        await db.release();
    }
});
exports.app.post("/api/login", async (req, res, next) => {
    const db = await exports.getDB();
    try {
        const request = login_pb_1.LoginRequest.deserializeBinary(Uint8Array.from(req.body));
        const [contestant] = await db.query('SELECT `password` FROM `contestants` WHERE `id` = ? LIMIT 1', [request.getContestantId()]);
        if (contestant?.password === crypto_1.default.createHash('sha256').update(request.getPassword(), "utf8").digest('hex')) {
            req.session.contestant_id = request.getContestantId();
        }
        else {
            return haltPb(res, 400, "ログインIDまたはパスワードが正しくありません");
        }
        const response = new login_pb_1.LoginResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    catch (e) {
        console.error(e);
        haltPb(res, 500, "予期せぬエラーが発生しました");
    }
    finally {
        await db.release();
    }
});
exports.app.post("/api/logout", async (req, res, next) => {
    if (req.session.contestant_id) {
        req.session.contestant_id = null;
        const response = new logout_pb_1.LogoutResponse();
        res.contentType(`application/vnd.google.protobuf`);
        res.end(Buffer.from(response.serializeBinary()));
    }
    else {
        haltPb(res, 401, "ログインしていません");
    }
});
