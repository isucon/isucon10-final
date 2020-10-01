use crate::proto::services::admin::{
    initialize_response::BenchmarkServer, GetClarificationResponse, InitializeRequest,
    InitializeResponse, ListClarificationsResponse, RespondClarificationRequest,
    RespondClarificationResponse,
};
use actix_protobuf::{ProtoBuf, ProtoBufResponseBuilder};
use actix_session::Session;
use actix_web::{http::StatusCode, web, Error as AWError, HttpResponse};
use mysql::prelude::*;
use std::ops::DerefMut;

pub async fn initialize(
    db: web::Data<crate::Pool>,
    message: ProtoBuf<InitializeRequest>,
) -> Result<HttpResponse, AWError> {
    const ADMIN_ID: &str = "admin";
    const ADMIN_PASSWORD: &str = "admin";
    let message = message.0;

    web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        conn.query_drop("TRUNCATE `teams`")?;
        conn.query_drop("TRUNCATE `contestants`")?;
        conn.query_drop("TRUNCATE `benchmark_jobs`")?;
        conn.query_drop("TRUNCATE `clarifications`")?;
        conn.query_drop("TRUNCATE `notifications`")?;
        conn.query_drop("TRUNCATE `push_subscriptions`")?;
        conn.query_drop("TRUNCATE `contest_config`")?;

        conn.exec_drop("INSERT `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, TRUE, NOW(6))", (ADMIN_ID, crate::sha256_hexdigest(ADMIN_PASSWORD)))?;

        if let Some(contest) = message.contest {
            let registration_open_at = crate::protobuf_timestamp_to_chrono(&contest.registration_open_at.expect("registration_open_at is missing"));
            let contest_starts_at = crate::protobuf_timestamp_to_chrono(&contest.contest_starts_at.expect("contest_starts_at is missing"));
            let contest_freezes_at = crate::protobuf_timestamp_to_chrono(&contest.contest_freezes_at.expect("contest_freezes_at is missing"));
            let contest_ends_at = crate::protobuf_timestamp_to_chrono(&contest.contest_ends_at.expect("contest_ends_at is missing"));
            conn.exec_drop(r#"
                INSERT `contest_config` (
                  `registration_open_at`,
                  `contest_starts_at`,
                  `contest_freezes_at`,
                  `contest_ends_at`
                ) VALUES (?, ?, ?, ?)
            "#, (registration_open_at, contest_starts_at, contest_freezes_at, contest_ends_at))?;
        } else {
            conn.query_drop(r#"
                INSERT `contest_config` (
                  `registration_open_at`,
                  `contest_starts_at`,
                  `contest_freezes_at`,
                  `contest_ends_at`
                ) VALUES (
                  TIMESTAMPADD(SECOND, 0, NOW(6)),
                  TIMESTAMPADD(SECOND, 5, NOW(6)),
                  TIMESTAMPADD(SECOND, 40, NOW(6)),
                  TIMESTAMPADD(SECOND, 50, NOW(6))
                )
            "#)?;
        }
        Ok(())
    })
    .await.map_err(crate::unwrap_blocking_error)?;
    HttpResponse::Ok().protobuf(InitializeResponse {
        // 実装言語
        language: "rust".to_owned(),
        // 実ベンチマーカーに伝える仮想ベンチマークサーバー(gRPC)のホスト情報
        benchmark_server: Some(BenchmarkServer {
            host: std::env::var("BENCHMARK_SERVER_HOST").unwrap_or_else(|_| "localhost".to_owned()),
            port: std::env::var("BENCHMARK_SERVER_PORT")
                .map(|port_str| {
                    port_str
                        .parse()
                        .expect("Failed to parse $BENCHMARK_SERVER_PORT")
                })
                .unwrap_or(50051),
        }),
    })
}

pub async fn list_clarifications(
    session: Session,
    db: web::Data<crate::Pool>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;

    let clarifications = web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let current_contestant =
            crate::require_current_contestant(conn.deref_mut(), &contestant_id, false)?;
        if !current_contestant.staff {
            return Err(crate::Error::UserError(
                StatusCode::FORBIDDEN,
                "管理者権限が必要です",
            ));
        }

        let clars: Vec<crate::Clarification> =
            conn.query("SELECT * FROM `clarifications` ORDER BY `updated_at` DESC")?;
        let mut clar_pbs = Vec::new();
        for clar in clars {
            let team = conn
                .exec_first(
                    "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
                    (clar.team_id,),
                )?
                .expect("team is not found");
            clar_pbs.push(crate::proto::resources::Clarification {
                id: clar.id,
                team_id: clar.team_id,
                answered: clar.answered_at.is_some(),
                disclosed: clar.disclosed.unwrap_or_default(),
                question: clar.question.unwrap_or_default(),
                answer: clar.answer.unwrap_or_default(),
                created_at: Some(crate::chrono_timestamp_to_protobuf(clar.created_at)),
                answered_at: clar.answered_at.map(crate::chrono_timestamp_to_protobuf),
                team: Some(crate::build_team_pb(conn.deref_mut(), team, false)?),
            });
        }
        Ok(clar_pbs)
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(ListClarificationsResponse { clarifications })
}

pub async fn get_clarification(
    session: Session,
    db: web::Data<crate::Pool>,
    info: web::Path<(i64,)>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let id = info.into_inner().0;

    let clarification = web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let current_contestant =
            crate::require_current_contestant(conn.deref_mut(), &contestant_id, false)?;
        if !current_contestant.staff {
            return Err(crate::Error::UserError(
                StatusCode::FORBIDDEN,
                "管理者権限が必要です",
            ));
        }

        let clar: crate::Clarification = conn
            .exec_first(
                "SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1",
                (id,),
            )?
            .expect("clarification is not found");
        let team = conn
            .exec_first(
                "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
                (clar.team_id,),
            )?
            .expect("team is not found");
        Ok(crate::proto::resources::Clarification {
            id: clar.id,
            team_id: clar.team_id,
            answered: clar.answered_at.is_some(),
            disclosed: clar.disclosed.unwrap_or_default(),
            question: clar.question.unwrap_or_default(),
            answer: clar.answer.unwrap_or_default(),
            created_at: Some(crate::chrono_timestamp_to_protobuf(clar.created_at)),
            answered_at: clar.answered_at.map(crate::chrono_timestamp_to_protobuf),
            team: Some(crate::build_team_pb(conn.deref_mut(), team, false)?),
        })
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(GetClarificationResponse {
        clarification: Some(clarification),
    })
}

pub async fn respond_clarification(
    session: Session,
    db: web::Data<crate::Pool>,
    info: web::Path<(i64,)>,
    message: ProtoBuf<RespondClarificationRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let id = info.into_inner().0;
    let message = message.0;

    let clarification = web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let current_contestant =
            crate::require_current_contestant(conn.deref_mut(), &contestant_id, false)?;
        if !current_contestant.staff {
            return Err(crate::Error::UserError(
                StatusCode::FORBIDDEN,
                "管理者権限が必要です",
            ));
        }

        let mut tx = conn.start_transaction(mysql::TxOpts::default())?;
        let clar_before: Option<crate::Clarification> = tx.exec_first(
            "SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1 FOR UPDATE",
            (id,),
        )?;
        if clar_before.is_none() {
            return Err(crate::Error::UserError(
                StatusCode::NOT_FOUND,
                "質問が見つかりません",
            ));
        }
        let clar_before = clar_before.unwrap();
        let was_answered = clar_before.answered_at.is_some();
        let was_disclosed = clar_before.disclosed;

        tx.exec_drop(
            r#"
            UPDATE `clarifications` SET
              `disclosed` = ?,
              `answer` = ?,
              `updated_at` = NOW(6),
              `answered_at` = NOW(6)
            WHERE `id` = ?
            LIMIT 1
        "#,
            (message.disclose, message.answer, id),
        )?;
        let clar: crate::Clarification = tx
            .exec_first(
                "SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1",
                (id,),
            )?
            .expect("clarification is not found");
        let team = tx
            .exec_first(
                "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
                (clar.team_id,),
            )?
            .expect("team is not found");
        let team_pb = crate::build_team_pb(&mut tx, team, false)?;
        tx.commit()?;
        crate::notifier::notify_clarification_answered(
            conn.deref_mut(),
            &clar,
            was_answered && was_disclosed == clar.disclosed,
        )?;
        Ok(crate::proto::resources::Clarification {
            id: clar.id,
            team_id: clar.team_id,
            answered: clar.answered_at.is_some(),
            disclosed: clar.disclosed.unwrap_or_default(),
            question: clar.question.unwrap_or_default(),
            answer: clar.answer.unwrap_or_default(),
            created_at: Some(crate::chrono_timestamp_to_protobuf(clar.created_at)),
            answered_at: clar.answered_at.map(crate::chrono_timestamp_to_protobuf),
            team: Some(team_pb),
        })
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(RespondClarificationResponse {
        clarification: Some(clarification),
    })
}
