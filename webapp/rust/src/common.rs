use crate::proto::services::common::GetCurrentSessionResponse;
use actix_protobuf::ProtoBufResponseBuilder;
use actix_session::Session;
use actix_web::{web, Error as AWError, HttpResponse};
use std::ops::DerefMut;

pub async fn get_current_session(
    session: Session,
    db: web::Data<crate::Pool>,
) -> Result<HttpResponse, AWError> {
    let contestant_id: Option<String> = session.get("contestant_id")?;
    let resp = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let current_contestant =
            crate::get_current_contestant(conn.deref_mut(), &contestant_id, false)?;
        let team = if let Some(ref c) = current_contestant {
            if let Some(team) = crate::get_current_team(conn.deref_mut(), c, false)? {
                Some(crate::build_team_pb(conn.deref_mut(), team, true)?)
            } else {
                None
            }
        } else {
            None
        };
        let contest_status = crate::get_current_contest_status(conn.deref_mut())?;
        Ok(GetCurrentSessionResponse {
            contestant: current_contestant.map(|c| c.into_message()),
            team,
            contest: Some(crate::proto::resources::Contest {
                registration_open_at: Some(crate::chrono_timestamp_to_protobuf(
                    contest_status.contest.registration_open_at,
                )),
                contest_starts_at: Some(crate::chrono_timestamp_to_protobuf(
                    contest_status.contest.contest_starts_at,
                )),
                contest_ends_at: Some(crate::chrono_timestamp_to_protobuf(
                    contest_status.contest.contest_ends_at,
                )),
                contest_freezes_at: Some(crate::chrono_timestamp_to_protobuf(
                    contest_status.contest.contest_freezes_at,
                )),
                frozen: contest_status.contest.frozen,
                status: contest_status.contest.status as i32,
            }),
            push_vapid_key: crate::notifier::get_public_key_for_push_header().unwrap_or_default(),
        })
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;
    HttpResponse::Ok().protobuf(resp)
}
