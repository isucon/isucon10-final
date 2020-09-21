use actix_protobuf::ProtoBufResponseBuilder;
use actix_web::{error::BlockingError, http::StatusCode, ResponseError};
use chrono::NaiveDateTime;
use mysql::prelude::*;
use std::env;

pub(crate) type Pool = r2d2::Pool<r2d2_mysql::MysqlConnectionManager>;
pub(crate) type PooledConnection = r2d2::PooledConnection<r2d2_mysql::MysqlConnectionManager>;

#[derive(Debug)]
pub struct MySQLConnectionEnv {
    pub host: String,
    pub port: u16,
    pub user: String,
    pub db_name: String,
    pub password: String,
}

impl Default for MySQLConnectionEnv {
    fn default() -> Self {
        let port = if let Ok(port) = env::var("MYSQL_PORT") {
            port.parse().unwrap_or(3306)
        } else {
            3306
        };
        Self {
            host: env::var("MYSQL_HOST").unwrap_or_else(|_| "127.0.0.1".to_owned()),
            port,
            user: env::var("MYSQL_USER").unwrap_or_else(|_| "isucon".to_owned()),
            db_name: env::var("MYSQL_DBNAME").unwrap_or_else(|_| "xsuportal".to_owned()),
            password: env::var("MYSQL_PASS").unwrap_or_else(|_| "isucon".to_owned()),
        }
    }
}

#[derive(Debug)]
pub enum Error {
    UserError(StatusCode, &'static str),
    ServerError(StatusCode, &'static str),
    DatabaseError(mysql::Error),
}
impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> Result<(), std::fmt::Error> {
        match self {
            Self::UserError(_, msg) => write!(f, "{}", msg),
            Self::ServerError(_, msg) => write!(f, "{}", msg),
            Self::DatabaseError(e) => write!(f, "{}", e),
        }
    }
}
impl ResponseError for Error {
    fn status_code(&self) -> StatusCode {
        match *self {
            Self::UserError(code, _) => code,
            Self::ServerError(code, _) => code,
            Self::DatabaseError(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> actix_web::HttpResponse {
        actix_web::dev::HttpResponseBuilder::new(self.status_code())
            .protobuf(crate::proto::Error {
                code: self.status_code().as_u16() as i32,
                name: "".to_owned(), // TODO
                human_message: format!("{}", self),
                human_descriptions: vec![format!("{}", self)],
                debug_info: None,
            })
            .expect("Failed to build Error response")
    }
}
impl std::error::Error for Error {}
impl From<mysql::Error> for Error {
    fn from(e: mysql::Error) -> Self {
        Self::DatabaseError(e)
    }
}

#[derive(Debug, Clone)]
pub struct Team {
    pub id: i64,
    pub name: String,
    pub leader_id: Option<String>,
    pub email_address: String,
    pub invite_token: String,
    pub withdrawn: bool,
    pub created_at: NaiveDateTime,
}
impl FromRow for Team {
    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        fn convert(row: &mysql::Row) -> Result<Team, ()> {
            Ok(Team {
                id: row.get("id").ok_or(())?,
                name: row.get("name").ok_or(())?,
                leader_id: row.get("leader_id").ok_or(())?,
                email_address: row.get("email_address").ok_or(())?,
                invite_token: row.get("invite_token").ok_or(())?,
                withdrawn: row.get("withdrawn").ok_or(())?,
                created_at: row.get("created_at").ok_or(())?,
            })
        }
        convert(&row).map_err(|_| mysql::FromRowError(row))
    }
}

pub struct Contestant {
    pub id: String,
    pub password: String,
    pub team_id: Option<i64>,
    pub name: Option<String>,
    pub student: bool,
    pub staff: bool,
    pub created_at: NaiveDateTime,
}
impl Contestant {
    pub fn into_message(self) -> crate::proto::resources::Contestant {
        crate::proto::resources::Contestant {
            id: self.id,
            team_id: self.team_id.unwrap_or(0),
            name: self.name.unwrap_or_else(|| "".to_owned()),
            is_student: self.student,
            is_staff: self.staff,
        }
    }
}
impl FromRow for Contestant {
    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        fn convert(row: &mysql::Row) -> Result<Contestant, ()> {
            Ok(Contestant {
                id: row.get("id").ok_or(())?,
                password: row.get("password").ok_or(())?,
                team_id: row.get("team_id").ok_or(())?,
                name: row.get("name").ok_or(())?,
                student: row.get("student").ok_or(())?,
                staff: row.get("staff").ok_or(())?,
                created_at: row.get("created_at").ok_or(())?,
            })
        }
        convert(&row).map_err(|_| mysql::FromRowError(row))
    }
}

#[derive(Debug)]
pub struct Clarification {
    pub id: i64,
    pub team_id: i64,
    pub disclosed: Option<bool>,
    pub question: Option<String>,
    pub answer: Option<String>,
    pub answered_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
impl FromRow for Clarification {
    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        fn convert(row: &mysql::Row) -> Result<Clarification, mysql::FromValueError> {
            Ok(Clarification {
                id: row.get_opt("id").expect("id column is missing")?,
                team_id: row.get_opt("team_id").expect("team_id column is missing")?,
                disclosed: row
                    .get_opt("disclosed")
                    .expect("disclosed column is missing")?,
                question: row
                    .get_opt("question")
                    .expect("question column is missing")?,
                answer: row.get_opt("answer").expect("answer column is missing")?,
                answered_at: row
                    .get_opt("answered_at")
                    .expect("answered_at column is missing")?,
                created_at: row
                    .get_opt("created_at")
                    .expect("created_at column is missing")?,
                updated_at: row
                    .get_opt("updated_at")
                    .expect("updated_at column is missing")?,
            })
        }
        convert(&row).map_err(|_| mysql::FromRowError(row))
    }
}

#[derive(Debug)]
pub struct BenchmarkJob {
    pub id: i64,
    pub team_id: i64,
    pub status: i32,
    pub target_hostname: String,
    pub score_raw: Option<i64>,
    pub score_deduction: Option<i64>,
    pub reason: Option<String>,
    pub passed: Option<bool>,
    pub started_at: Option<NaiveDateTime>,
    pub finished_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
impl FromRow for BenchmarkJob {
    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self {
            id: row.get("id").expect("id column is missing"),
            team_id: row.get("team_id").expect("team_id column is missing"),
            status: row.get("status").expect("status column is missing"),
            target_hostname: row
                .get("target_hostname")
                .expect("target_hostname column is missing"),
            score_raw: row.get("score_raw").expect("score_raw column is missing"),
            score_deduction: row
                .get("score_deduction")
                .expect("score_deduction column is missing"),
            reason: row.get("reason").expect("reason column is missing"),
            passed: row.get("passed").expect("passed column is missing"),
            started_at: row.get("started_at").expect("started_at column is missing"),
            finished_at: row
                .get("finished_at")
                .expect("finished_at column is missing"),
            created_at: row.get("created_at").expect("created_at column is missing"),
            updated_at: row.get("updated_at").expect("updated_at column is missing"),
        })
    }
}

pub mod admin;
pub mod audience;
pub mod bench;
pub mod common;
pub mod contestant;
pub mod leaderboard;
pub mod notifier;
pub mod proto;
pub mod registration;

pub(crate) fn team_pb<Q>(
    conn: &mut Q,
    team: Team,
    detail: bool,
    enable_members: bool,
    _member_detail: bool,
    is_student: Option<bool>,
) -> Result<crate::proto::resources::Team, mysql::Error>
where
    Q: Queryable,
{
    let mut leader: Option<Contestant> = None;
    let members: Vec<Contestant> = if enable_members {
        let leader_id = team.leader_id.clone();
        let team_id = team.id;
        leader = if let Some(ref leader_id) = leader_id {
            conn.exec_first(
                "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1",
                (leader_id,),
            )?
        } else {
            None
        };
        conn.exec(
            "SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`",
            (team_id,),
        )?
    } else {
        vec![]
    };
    Ok(crate::proto::resources::Team {
        id: team.id,
        name: team.name,
        leader_id: team.leader_id.unwrap_or_else(|| "".to_owned()),
        member_ids: members.iter().map(|c| c.id.to_owned()).collect(),
        withdrawn: team.withdrawn,
        student: is_student.map(|status| crate::proto::resources::team::StudentStatus { status }),
        detail: if detail {
            Some(crate::proto::resources::team::TeamDetail {
                email_address: team.email_address,
                invite_token: team.invite_token,
            })
        } else {
            None
        },
        leader: leader.map(|c| c.into_message()),
        members: members.into_iter().map(|c| c.into_message()).collect(),
    })
}

pub(crate) fn sha256_hexdigest(s: &str) -> String {
    data_encoding::HEXLOWER
        .encode(ring::digest::digest(&ring::digest::SHA256, s.as_bytes()).as_ref())
}

pub(crate) fn require_current_contestant<Q>(
    conn: &mut Q,
    contestant_id: &Option<String>,
    lock: bool,
) -> Result<crate::Contestant, Error>
where
    Q: Queryable,
{
    if let Some(contestant_id) = contestant_id {
        let contestant = if lock {
            conn.exec_first(
                "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1 FOR UPDATE",
                (contestant_id,),
            )
        } else {
            conn.exec_first(
                "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1",
                (contestant_id,),
            )
        }?;
        if let Some(contestant) = contestant {
            Ok(contestant)
        } else {
            Err(Error::UserError(
                StatusCode::UNAUTHORIZED,
                "ログインが必要です",
            ))
        }
    } else {
        Err(Error::UserError(
            StatusCode::UNAUTHORIZED,
            "ログインが必要です",
        ))
    }
}

pub(crate) fn get_current_contestant<Q>(
    conn: &mut Q,
    contestant_id: &Option<String>,
    lock: bool,
) -> Result<Option<crate::Contestant>, mysql::Error>
where
    Q: Queryable,
{
    if let Some(contestant_id) = contestant_id {
        if lock {
            conn.exec_first(
                "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1 FOR UPDATE",
                (contestant_id,),
            )
        } else {
            conn.exec_first(
                "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1",
                (contestant_id,),
            )
        }
    } else {
        Ok(None)
    }
}

pub(crate) fn get_current_team<Q>(
    conn: &mut Q,
    contestant: &Contestant,
    lock: bool,
) -> Result<Option<Team>, mysql::Error>
where
    Q: Queryable,
{
    let team_id = contestant.team_id;
    let team = if lock {
        conn.exec_first(
            "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1 FOR UPDATE",
            (team_id,),
        )
    } else {
        conn.exec_first("SELECT * FROM `teams` WHERE `id` = ? LIMIT 1", (team_id,))
    }?;
    Ok(team)
}

pub(crate) fn require_current_contestant_and_team<Q>(
    conn: &mut Q,
    contestant_id: &Option<String>,
    lock: bool,
) -> Result<(Contestant, Team), Error>
where
    Q: Queryable,
{
    let contestant = require_current_contestant(conn, contestant_id, lock)?;
    if let Some(team) = get_current_team(conn, &contestant, lock)? {
        Ok((contestant, team))
    } else {
        Err(Error::UserError(
            StatusCode::FORBIDDEN,
            "参加登録が必要です",
        ))
    }
}

pub(crate) fn chrono_timestamp_to_protobuf(timestamp: NaiveDateTime) -> prost_types::Timestamp {
    prost_types::Timestamp {
        seconds: timestamp.timestamp(),
        nanos: timestamp.timestamp_subsec_nanos() as i32,
    }
}

pub struct ContestStatus {
    pub contest: Contest,
    pub current_time: NaiveDateTime,
}

pub struct Contest {
    pub registration_open_at: NaiveDateTime,
    pub contest_starts_at: NaiveDateTime,
    pub contest_freezes_at: NaiveDateTime,
    pub contest_ends_at: NaiveDateTime,
    pub status: crate::proto::resources::contest::Status,
    pub frozen: bool,
}

pub(crate) fn get_current_contest_status<Q>(conn: &mut Q) -> Result<ContestStatus, mysql::Error>
where
    Q: Queryable,
{
    let row: mysql::Row = conn.query_first(
        r#"
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
    "#,
    )?.expect("No contest_config");

    let registration_open_at = row
        .get("registration_open_at")
        .expect("registration_open_at column is missing");
    let contest_starts_at = row
        .get("contest_starts_at")
        .expect("contest_starts_at column is missing");
    let contest_freezes_at = row
        .get("contest_freezes_at")
        .expect("contest_freezes_at column is missing");
    let contest_ends_at = row
        .get("contest_ends_at")
        .expect("contest_ends_at column is missing");
    let status: String = row.get("status").expect("status column is missing");
    let frozen: i32 = row.get("frozen").expect("frozen column is missing");
    let current_time = row
        .get("current_time")
        .expect("current_time column is missing");
    Ok(ContestStatus {
        contest: Contest {
            registration_open_at,
            contest_starts_at,
            contest_freezes_at,
            contest_ends_at,
            status: match status.as_str() {
                "standby" => crate::proto::resources::contest::Status::Standby,
                "registration" => crate::proto::resources::contest::Status::Registration,
                "started" => crate::proto::resources::contest::Status::Started,
                "finished" => crate::proto::resources::contest::Status::Finished,
                _ => panic!("Unexpected contest status: {}", status),
            },
            frozen: frozen == 1,
        },
        current_time,
    })
}

pub(crate) fn unwrap_blocking_error<E>(e: BlockingError<E>) -> actix_web::Error
where
    E: ResponseError + 'static,
{
    if let BlockingError::Error(inner) = e {
        actix_web::Error::from(inner)
    } else {
        actix_web::Error::from(e)
    }
}
