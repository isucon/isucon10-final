use crate::proto::services::audience::{
    list_teams_response::TeamListItem, DashboardResponse, ListTeamsResponse,
};
use actix_protobuf::ProtoBufResponseBuilder;
use actix_web::{web, Error as AWError, HttpResponse};
use mysql::prelude::*;

pub async fn list_teams(db: web::Data<crate::Pool>) -> Result<HttpResponse, AWError> {
    let items = web::block::<_, _, mysql::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let teams: Vec<crate::Team> = conn
            .query("SELECT * FROM `teams` WHERE `withdrawn` = FALSE ORDER BY `created_at` DESC")?;
        let mut items = Vec::new();
        for team in teams {
            let members: Vec<crate::Contestant> = conn.exec(
                "SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`",
                (team.id,),
            )?;
            items.push(TeamListItem {
                team_id: team.id,
                name: team.name,
                is_student: members.iter().all(|c| c.student),
                member_names: members
                    .into_iter()
                    .map(|c| c.name.unwrap_or_else(|| "".to_owned()))
                    .collect(),
            });
        }
        Ok(items)
    })
    .await?;
    HttpResponse::Ok().protobuf(ListTeamsResponse { teams: items })
}

pub async fn dashboard(db: web::Data<crate::Pool>) -> Result<HttpResponse, AWError> {
    let leaderboard = web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        crate::leaderboard::get_leaderboard(&mut conn, 0)
    })
    .await?;
    HttpResponse::Ok().protobuf(DashboardResponse {
        leaderboard: Some(leaderboard),
    })
}
