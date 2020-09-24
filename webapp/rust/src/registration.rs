use crate::proto::services::registration::{
    CreateTeamRequest, CreateTeamResponse, DeleteRegistrationResponse, JoinTeamRequest,
    JoinTeamResponse, UpdateRegistrationRequest, UpdateRegistrationResponse,
};
use actix_protobuf::{ProtoBuf, ProtoBufResponseBuilder};
use actix_session::Session;
use actix_web::{http::StatusCode, web, Error as AWError, HttpResponse};
use mysql::prelude::*;
use std::ops::DerefMut;

struct LockTablesTransaction<'a> {
    inner: Option<mysql::Transaction<'a>>,
}
impl<'a> LockTablesTransaction<'a> {
    fn new(mut tx: mysql::Transaction<'a>) -> Result<Self, mysql::Error> {
        tx.query_drop("LOCK TABLES `teams` WRITE, `contestants` WRITE")?;
        Ok(Self { inner: Some(tx) })
    }

    fn get_mut(&mut self) -> &mut mysql::Transaction<'a> {
        self.inner.as_mut().unwrap()
    }

    fn finish(mut self) -> Result<mysql::Transaction<'a>, mysql::Error> {
        self.get_mut().query_drop("UNLOCK TABLES")?;
        Ok(self.inner.take().unwrap())
    }
}
impl<'a> Drop for LockTablesTransaction<'a> {
    fn drop(&mut self) {
        if let Some(inner) = self.inner.as_mut() {
            let _ = inner.query_drop("UNLOCK TABLES");
        }
    }
}
impl<'a> Queryable for LockTablesTransaction<'a> {
    fn query_iter<Q>(
        &mut self,
        query: Q,
    ) -> Result<mysql::QueryResult<'_, '_, '_, mysql::Text>, mysql::Error>
    where
        Q: AsRef<str>,
    {
        self.get_mut().query_iter(query)
    }
    fn prep<Q>(&mut self, query: Q) -> Result<mysql::Statement, mysql::Error>
    where
        Q: AsRef<str>,
    {
        self.get_mut().prep(query)
    }
    fn close(&mut self, stmt: mysql::Statement) -> Result<(), mysql::Error> {
        self.get_mut().close(stmt)
    }
    fn exec_iter<S, P>(
        &mut self,
        stmt: S,
        params: P,
    ) -> Result<mysql::QueryResult<'_, '_, '_, mysql::Binary>, mysql::Error>
    where
        S: mysql::prelude::AsStatement,
        P: Into<mysql::Params>,
    {
        self.get_mut().exec_iter(stmt, params)
    }
}

pub async fn create_team(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<CreateTeamRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let req = message.0;

    let team_id = web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let current_contestant = crate::require_current_contestant(conn.deref_mut(), &contestant_id, false)?;

        let contest_status = crate::get_current_contest_status(conn.deref_mut())?;
        if contest_status.contest.status != crate::proto::resources::contest::Status::Registration {
            return Err(crate::Error::UserError(StatusCode::FORBIDDEN, "チーム登録期間ではありません"));
        }

        let tx = conn.start_transaction(mysql::TxOpts::default())?;

        let mut locked_tx = LockTablesTransaction::new(tx)?;
        let rng = ring::rand::SystemRandom::new();
        let random_bytes: [u8; 64] = ring::rand::generate(&rng)
            .expect("Failed to generate random number")
            .expose();
        let invite_token = data_encoding::BASE64URL.encode(&random_bytes);

        const TEAM_CAPACITY: i32 = 10;
        let within_capacity: Option<(i32,)> = locked_tx.exec_first(
            "SELECT COUNT(*) < ? AS `within_capacity` FROM `teams`",
            (TEAM_CAPACITY,),
        )?;
        if within_capacity.unwrap_or((0,)).0 != 1 {
            return Err(crate::Error::UserError(StatusCode::FORBIDDEN, "チーム登録数上限です"));
        }

        locked_tx.exec_drop("INSERT INTO `teams` (`name`, `email_address`, `invite_token`, `created_at`) VALUES (?, ?, ?, NOW(6))", (req.team_name, req.email_address, invite_token))?;
        let team_id: Option<(i64,)> = locked_tx.query_first("SELECT LAST_INSERT_ID() AS `id`")?;
        if team_id.is_none() {
            return Err(crate::Error::ServerError(StatusCode::INTERNAL_SERVER_ERROR, "チームを登録できませんでした"));
        }
        let team_id = team_id.unwrap().0;

        locked_tx.exec_drop("UPDATE `contestants` SET `name` = ?, `student` = ?, `team_id` = ? WHERE `id` = ? LIMIT 1", (req.name, req.is_student, team_id, &current_contestant.id))?;

        locked_tx.exec_drop("UPDATE `teams` SET `leader_id` = ? WHERE `id` = ? LIMIT 1", (&current_contestant.id, team_id))?;

        let tx = locked_tx.finish()?;
        tx.commit()?;
        Ok(team_id)
    })
    .await.map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(CreateTeamResponse { team_id })
}

#[derive(Debug, serde::Deserialize)]
pub struct GetSessionQuery {
    pub team_id: Option<i64>,
    pub invite_token: Option<String>,
}

pub async fn get_session(
    session: Session,
    db: web::Data<crate::Pool>,
    query: web::Query<GetSessionQuery>,
) -> Result<HttpResponse, AWError> {
    let contestant_id: Option<String> = session.get("contestant_id")?;
    let query = query.0;

    let resp = web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let current_contestant = crate::get_current_contestant(conn.deref_mut(), &contestant_id, false)?;
        let current_team = if let Some(ref current_contestant) = current_contestant {
            crate::get_current_team(conn.deref_mut(), current_contestant, false)?
        } else {
            None
        };
        let team = if current_team.is_some() {
            current_team.clone()
        } else if let (Some(team_id), Some(invite_token)) = (query.team_id, query.invite_token) {
            let t = conn.exec_first("SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1", (team_id, invite_token))?;
            if t.is_some() {
                t
            } else {
                return Err(crate::Error::UserError(StatusCode::NOT_FOUND, "招待URLが無効です"));
            }
        } else {
            None
        };
        let members: Vec<crate::Contestant> = if let Some(ref team) = team {
            conn.exec("SELECT * FROM `contestants` WHERE `team_id` = ?", (team.id,))?
        } else {
            vec![]
        };

        use crate::proto::services::registration::get_registration_session_response::Status as RegistrationStatus;
        let status = if current_contestant.as_ref().and_then(|c| c.team_id).is_some() {
            RegistrationStatus::Joined
        } else if team.is_some() && members.len() >= 3 {
            RegistrationStatus::NotJoinable
        } else if current_contestant.is_none() {
            RegistrationStatus::NotLoggedIn
        } else if team.is_some() {
            RegistrationStatus::Joinable
        } else if team.is_none() {
            RegistrationStatus::Creatable
        } else {
            panic!("undeterminable status");
        };

        let team_pb = if let Some(ref team) = team {
            let detail = current_contestant.as_ref().map(|c| &c.id) == current_team.as_ref().and_then(|t| t.leader_id.as_ref());
            Some(crate::build_team_pb(conn.deref_mut(), team.clone(), detail)?)
        } else {
            None
        };
        Ok(crate::proto::services::registration::GetRegistrationSessionResponse {
            team: team_pb,
            status: status as i32,
            member_invite_url: if let Some(ref t) = team { format!("/registration?team_id={}&invite_token={}", t.id, t.invite_token) } else { "".to_owned() },
            invite_token: team.map(|t| t.invite_token).unwrap_or_default(),
        })
    })
    .await.map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(resp)
}

pub async fn update_registration(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<UpdateRegistrationRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let message = message.0;

    web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let mut tx = conn.start_transaction(mysql::TxOpts::default())?;

        let (current_contestant, current_team) =
            crate::require_current_contestant_and_team(&mut tx, &contestant_id, true)?;

        if current_team.leader_id.as_ref() == Some(&current_contestant.id) {
            tx.exec_drop(
                "UPDATE `teams` SET `name` = ?, `email_address` = ? WHERE `id` = ? LIMIT 1",
                (message.team_name, message.email_address, current_team.id),
            )?;
        }
        tx.exec_drop(
            "UPDATE `contestants` SET `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1",
            (message.name, message.is_student, current_contestant.id),
        )?;
        tx.commit()?;
        Ok(())
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(UpdateRegistrationResponse {})
}

pub async fn delete_registration(
    session: Session,
    db: web::Data<crate::Pool>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;

    web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let mut tx = conn.start_transaction(mysql::TxOpts::default())?;

        let (current_contestant, current_team) =
            crate::require_current_contestant_and_team(&mut tx, &contestant_id, true)?;

        let current_contest_status = crate::get_current_contest_status(&mut tx)?;
        if current_contest_status.contest.status
            != crate::proto::resources::contest::Status::Registration
        {
            return Err(crate::Error::UserError(
                StatusCode::FORBIDDEN,
                "チーム登録期間外は辞退できません",
            ));
        }

        if current_team.leader_id.as_ref() == Some(&current_contestant.id) {
            tx.exec_drop(
                "UPDATE `teams` SET `withdrawn` = TRUE, `leader_id` = NULL WHERE `id` = ? LIMIT 1",
                (current_team.id,),
            )?;
            tx.exec_drop(
                "UPDATE `contestants` SET `team_id` = NULL WHERE `team_id` = ?",
                (current_team.id,),
            )?;
        } else {
            tx.exec_drop(
                "UPDATE `contestants` SET `team_id` = NULL WHERE `id` = ? LIMIT 1",
                (current_contestant.id,),
            )?;
        }
        tx.commit()?;
        Ok(())
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(DeleteRegistrationResponse {})
}

pub async fn join_team(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<JoinTeamRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let message = message.0;

    web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let mut tx = conn.start_transaction(mysql::TxOpts::default())?;

        let current_contestant =
            crate::require_current_contestant(&mut tx, &contestant_id, true)?;

        let current_contest_status = crate::get_current_contest_status(&mut tx)?;
        if current_contest_status.contest.status
            != crate::proto::resources::contest::Status::Registration
        {
            return Err(crate::Error::UserError(
                StatusCode::FORBIDDEN,
                "チーム登録期間ではありません",
            ));
        }

        let team: Option<crate::Team> = tx.exec_first("SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1 FOR UPDATE", (message.team_id, message.invite_token))?;
        if team.is_none() {
            return Err(crate::Error::UserError(StatusCode::BAD_REQUEST, "招待URLが不正です"));
        }

        let members: (i64,) = tx.exec_first("SELECT COUNT(*) AS `cnt` FROM `contestants` WHERE `team_id` = ?", (message.team_id,))?.expect("No rows are returned");
        if members.0 >= 3 {
            return Err(crate::Error::UserError(StatusCode::BAD_REQUEST, "チーム人数の上限に達しています"));
        }

        tx.exec_drop("UPDATE `contestants` SET `team_id` = ?, `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1", (message.team_id, message.name, message.is_student, current_contestant.id))?;
        tx.commit()?;
        Ok(())
    })
    .await.map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(JoinTeamResponse {})
}
