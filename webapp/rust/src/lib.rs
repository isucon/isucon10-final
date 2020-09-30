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
                name: "Error".to_owned(),
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
            email_address: row
                .take_opt("email_address")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            invite_token: row
                .take_opt("invite_token")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            withdrawn: row
                .take_opt("withdrawn")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            created_at: row
                .take_opt("created_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
        })
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
    fn from_row_opt(mut row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self {
            id: row
                .take_opt("id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            password: row
                .take_opt("password")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            team_id: row
                .take_opt("team_id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            name: row
                .take_opt("name")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            student: row
                .take_opt("student")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            staff: row
                .take_opt("staff")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            created_at: row
                .take_opt("created_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
        })
    }
}

#[derive(Debug)]
pub struct Notification {
    pub id: i64,
    pub contestant_id: String,
    pub read: bool,
    pub encoded_message: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
impl FromRow for Notification {
    fn from_row_opt(mut row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self {
            id: row
                .take_opt("id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            contestant_id: row
                .take_opt("contestant_id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            read: row
                .take_opt("read")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            encoded_message: row
                .take_opt("encoded_message")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            created_at: row
                .take_opt("created_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            updated_at: row
                .take_opt("updated_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
        })
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
    fn from_row_opt(mut row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self {
            id: row
                .take_opt("id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            team_id: row
                .take_opt("team_id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            disclosed: row
                .take_opt("disclosed")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            question: row
                .take_opt("question")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            answer: row
                .take_opt("answer")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            answered_at: row
                .take_opt("answered_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            created_at: row
                .take_opt("created_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            updated_at: row
                .take_opt("updated_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
        })
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
    fn from_row_opt(mut row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self {
            id: row
                .take_opt("id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            team_id: row
                .take_opt("team_id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            status: row
                .take_opt("status")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            target_hostname: row
                .take_opt("target_hostname")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            score_raw: row
                .take_opt("score_raw")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            score_deduction: row
                .take_opt("score_deduction")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            reason: row
                .take_opt("reason")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            passed: row
                .take_opt("passed")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            started_at: row
                .take_opt("started_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            finished_at: row
                .take_opt("finished_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            created_at: row
                .take_opt("created_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            updated_at: row
                .take_opt("updated_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
        })
    }
}

#[derive(Debug)]
pub struct PushSubscription {
    pub id: i64,
    pub contestant_id: String,
    pub endpoint: String,
    pub p256dh: String,
    pub auth: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
impl FromRow for PushSubscription {
    fn from_row_opt(mut row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self {
            id: row
                .take_opt("id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            contestant_id: row
                .take_opt("contestant_id")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            endpoint: row
                .take_opt("endpoint")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            p256dh: row
                .take_opt("p256dh")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            auth: row
                .take_opt("auth")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            created_at: row
                .take_opt("created_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
            updated_at: row
                .take_opt("updated_at")
                .ok_or_else(|| mysql::FromRowError(row.clone()))?
                .map_err(|_| mysql::FromRowError(row.clone()))?,
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
pub mod webpush;

pub(crate) fn build_team_pb<Q>(
    conn: &mut Q,
    team: Team,
    detail: bool,
) -> Result<crate::proto::resources::Team, mysql::Error>
where
    Q: Queryable,
{
    let leader: Option<Contestant> = if let Some(ref leader_id) = team.leader_id {
        conn.exec_first(
            "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1",
            (leader_id,),
        )?
    } else {
        None
    };
    let members: Vec<Contestant> = conn.exec(
        "SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`",
        (team.id,),
    )?;
    Ok(crate::proto::resources::Team {
        id: team.id,
        name: team.name,
        leader_id: team.leader_id.unwrap_or_else(|| "".to_owned()),
        member_ids: members.iter().map(|c| c.id.to_owned()).collect(),
        withdrawn: team.withdrawn,
        student: None,
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

pub fn chrono_timestamp_to_protobuf(timestamp: NaiveDateTime) -> prost_types::Timestamp {
    prost_types::Timestamp {
        seconds: timestamp.timestamp(),
        nanos: timestamp.timestamp_subsec_nanos() as i32,
    }
}

pub fn protobuf_timestamp_to_chrono(timestamp: &prost_types::Timestamp) -> NaiveDateTime {
    NaiveDateTime::from_timestamp(timestamp.seconds, timestamp.nanos as u32)
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
