use chrono::NaiveDateTime;
use mysql::prelude::*;
use std::ops::DerefMut;

struct LeaderboardRow {
    id: i64,
    name: String,
    leader_id: Option<String>,
    withdrawn: bool,
    student: i32,
    best_score: Option<i64>,
    best_score_started_at: Option<NaiveDateTime>,
    best_score_marked_at: Option<NaiveDateTime>,
    latest_score: Option<i64>,
    latest_score_started_at: Option<NaiveDateTime>,
    latest_score_marked_at: Option<NaiveDateTime>,
    finish_count: Option<i64>,
}
impl FromRow for LeaderboardRow {
    fn from_row_opt(mut row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self {
            id: row
                .take_opt("id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            name: row
                .take_opt("name")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            leader_id: row
                .take_opt("leader_id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            withdrawn: row
                .take_opt("withdrawn")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            student: row
                .get_opt("student")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            best_score: row
                .take_opt("best_score")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            best_score_started_at: row
                .take_opt("best_score_started_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            best_score_marked_at: row
                .take_opt("best_score_marked_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            latest_score: row
                .take_opt("latest_score")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            latest_score_started_at: row
                .take_opt("latest_score_started_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            latest_score_marked_at: row
                .take_opt("latest_score_marked_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            finish_count: row
                .take_opt("finish_count")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
        })
    }
}

pub fn get_leaderboard(
    conn: &mut crate::PooledConnection,
    team_id: i64,
) -> Result<crate::proto::resources::Leaderboard, mysql::Error> {
    let contest_status = crate::get_current_contest_status(conn.deref_mut())?;
    let contest = contest_status.contest;
    let contest_finished = contest.status == crate::proto::resources::contest::Status::Finished;
    let contest_freezes_at = &contest.contest_freezes_at;

    let mut tx = conn.start_transaction(mysql::TxOpts::default())?;
    let leaderboard_query = r#"
              SELECT
                `teams`.`id` AS `id`,
                `teams`.`name` AS `name`,
                `teams`.`leader_id` AS `leader_id`,
                `teams`.`withdrawn` AS `withdrawn`,
                `team_student_flags`.`student` AS `student`,
                (`best_score_jobs`.`score_raw` - `best_score_jobs`.`score_deduction`) AS `best_score`,
                `best_score_jobs`.`started_at` AS `best_score_started_at`,
                `best_score_jobs`.`finished_at` AS `best_score_marked_at`,
                (`latest_score_jobs`.`score_raw` - `latest_score_jobs`.`score_deduction`) AS `latest_score`,
                `latest_score_jobs`.`started_at` AS `latest_score_started_at`,
                `latest_score_jobs`.`finished_at` AS `latest_score_marked_at`,
                `latest_score_job_ids`.`finish_count` AS `finish_count`
              FROM
                `teams`
                -- latest scores
                LEFT JOIN (
                  SELECT
                    MAX(`id`) AS `id`,
                    `team_id`,
                    COUNT(*) AS `finish_count`
                  FROM
                    `benchmark_jobs`
                  WHERE
                    `finished_at` IS NOT NULL
                    -- score freeze
                    AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))
                  GROUP BY
                    `team_id`
                ) `latest_score_job_ids` ON `latest_score_job_ids`.`team_id` = `teams`.`id`
                LEFT JOIN `benchmark_jobs` `latest_score_jobs` ON `latest_score_job_ids`.`id` = `latest_score_jobs`.`id`
                -- best scores
                LEFT JOIN (
                  SELECT
                    MAX(`j`.`id`) AS `id`,
                    `j`.`team_id` AS `team_id`
                  FROM
                    (
                      SELECT
                        `team_id`,
                        MAX(`score_raw` - `score_deduction`) AS `score`
                      FROM
                        `benchmark_jobs`
                      WHERE
                        `finished_at` IS NOT NULL
                        -- score freeze
                        AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))
                      GROUP BY
                        `team_id`
                    ) `best_scores`
                    LEFT JOIN `benchmark_jobs` `j` ON (`j`.`score_raw` - `j`.`score_deduction`) = `best_scores`.`score`
                      AND `j`.`team_id` = `best_scores`.`team_id`
                  GROUP BY
                    `j`.`team_id`
                ) `best_score_job_ids` ON `best_score_job_ids`.`team_id` = `teams`.`id`
                LEFT JOIN `benchmark_jobs` `best_score_jobs` ON `best_score_jobs`.`id` = `best_score_job_ids`.`id`
                -- check student teams
                LEFT JOIN (
                  SELECT
                    `team_id`,
                    (SUM(`student`) = COUNT(*)) AS `student`
                  FROM
                    `contestants`
                  GROUP BY
                    `contestants`.`team_id`
                ) `team_student_flags` ON `team_student_flags`.`team_id` = `teams`.`id`
              ORDER BY
                `latest_score` DESC,
                `latest_score_marked_at` ASC
            "#;
    let leaderboard: Vec<LeaderboardRow> = tx.exec(
        leaderboard_query,
        (
            team_id,
            team_id,
            contest_finished,
            contest_freezes_at,
            team_id,
            team_id,
            contest_finished,
            contest_freezes_at,
        ),
    )?;

    let job_results_query = r#"
              SELECT
                `team_id` AS `team_id`,
                (`score_raw` - `score_deduction`) AS `score`,
                `started_at` AS `started_at`,
                `finished_at` AS `finished_at`
              FROM
                `benchmark_jobs`
              WHERE
                `started_at` IS NOT NULL
                AND (
                  `finished_at` IS NOT NULL
                  -- score freeze
                  AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))
                )
              ORDER BY
                `finished_at`
    "#;
    let job_results: Vec<mysql::Row> = tx.exec(
        job_results_query,
        (team_id, team_id, contest_finished, contest_freezes_at),
    )?;
    let mut team_graph_scores = std::collections::HashMap::new();
    for result in job_results {
        let team_id: i64 = result.get("team_id").expect("team_id column is missing");
        let started_at: NaiveDateTime = result
            .get("started_at")
            .expect("started_at column is missing");
        let finished_at: NaiveDateTime = result
            .get("finished_at")
            .expect("finished_at column is missing");
        let score = crate::proto::resources::leaderboard::leaderboard_item::LeaderboardScore {
            score: result.get("score").expect("score column is missing"),
            started_at: Some(crate::chrono_timestamp_to_protobuf(started_at)),
            marked_at: Some(crate::chrono_timestamp_to_protobuf(finished_at)),
        };
        team_graph_scores
            .entry(team_id)
            .or_insert_with(Vec::new)
            .push(score);
    }
    tx.commit()?;

    let mut teams = Vec::new();
    let mut general_teams = Vec::new();
    let mut student_teams = Vec::new();
    for row in leaderboard {
        let item = crate::proto::resources::leaderboard::LeaderboardItem {
            scores: team_graph_scores.remove(&row.id).unwrap_or_default(),
            best_score: Some(
                crate::proto::resources::leaderboard::leaderboard_item::LeaderboardScore {
                    score: row.best_score.unwrap_or_default(),
                    started_at: row
                        .best_score_started_at
                        .map(crate::chrono_timestamp_to_protobuf),
                    marked_at: row
                        .best_score_marked_at
                        .map(crate::chrono_timestamp_to_protobuf),
                },
            ),
            latest_score: Some(
                crate::proto::resources::leaderboard::leaderboard_item::LeaderboardScore {
                    score: row.latest_score.unwrap_or_default(),
                    started_at: row
                        .latest_score_started_at
                        .map(crate::chrono_timestamp_to_protobuf),
                    marked_at: row
                        .latest_score_marked_at
                        .map(crate::chrono_timestamp_to_protobuf),
                },
            ),
            finish_count: row.finish_count.unwrap_or_default(),
            team: Some(crate::proto::resources::Team {
                id: row.id,
                name: row.name,
                leader_id: row.leader_id.unwrap_or_else(|| "".to_owned()),
                member_ids: Vec::new(),
                withdrawn: row.withdrawn,
                student: Some(crate::proto::resources::team::StudentStatus {
                    status: row.student == 1,
                }),
                detail: None,
                leader: None,
                members: Vec::new(),
            }),
        };

        teams.push(item.clone());
        if row.student == 1 {
            student_teams.push(item);
        } else {
            general_teams.push(item);
        }
    }
    Ok(crate::proto::resources::Leaderboard {
        teams,
        general_teams,
        student_teams,
        progresses: Vec::new(),
        contest: Some(crate::proto::resources::Contest {
            registration_open_at: Some(crate::chrono_timestamp_to_protobuf(
                contest.registration_open_at,
            )),
            contest_starts_at: Some(crate::chrono_timestamp_to_protobuf(
                contest.contest_starts_at,
            )),
            contest_freezes_at: Some(crate::chrono_timestamp_to_protobuf(
                contest.contest_freezes_at,
            )),
            contest_ends_at: Some(crate::chrono_timestamp_to_protobuf(contest.contest_ends_at)),
            status: contest.status.into(),
            frozen: contest.frozen,
        }),
    })
}
