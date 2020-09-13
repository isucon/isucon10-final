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
    let resp = web::block::<_, _, mysql::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let current_contestant =
            crate::get_current_contestant(conn.deref_mut(), &contestant_id, false)?;
        let team = if let Some(ref c) = current_contestant {
            if let Some(team) = crate::get_current_team(conn.deref_mut(), c, false)? {
                Some(crate::team_pb(
                    conn.deref_mut(),
                    team,
                    true,
                    true,
                    false,
                    None,
                )?)
            } else {
                None
            }
        } else {
            None
        };
        Ok(GetCurrentSessionResponse {
            contestant: current_contestant.map(|c| c.into_message()),
            team,
        })
    })
    .await?;
    HttpResponse::Ok().protobuf(resp)
}
