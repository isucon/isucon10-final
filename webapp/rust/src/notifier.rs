use mysql::prelude::*;

pub fn notify_clarification_answered<Q>(
    conn: &mut Q,
    clar: &crate::Clarification,
    updated: bool,
) -> Result<(), mysql::Error>
where
    Q: Queryable,
{
    let contestants: Vec<(String, i64)> = if clar.disclosed == Some(true) {
        conn.query("SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` IS NOT NULL")
    } else {
        conn.exec(
            "SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?",
            (clar.team_id,),
        )
    }?;
    for contestant in contestants {
        let mut notification_pb = crate::proto::resources::Notification {
            id: 0,
            created_at: None,
            content: Some(
                crate::proto::resources::notification::Content::ContentClarification(
                    crate::proto::resources::notification::ClarificationMessage {
                        clarification_id: clar.id,
                        owned: clar.team_id == contestant.1,
                        updated,
                    },
                ),
            ),
        };
        let notification = notify(conn, &notification_pb, &contestant.0)?;
        if WEBPUSH_VAPID_KEY.is_some() {
            notification_pb.id = notification.id;
            notification_pb.created_at =
                Some(crate::chrono_timestamp_to_protobuf(notification.created_at));
            // TODO: Web Push IIKANJI NI SHITE
        }
    }
    Ok(())
}

pub fn notify_benchmark_job_finished<Q>(
    conn: &mut Q,
    job: &crate::BenchmarkJob,
) -> Result<(), mysql::Error>
where
    Q: Queryable,
{
    let contestants: Vec<(String, i64)> = conn.exec(
        "SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?",
        (job.team_id,),
    )?;
    for contestant in contestants {
        let mut notification_pb = crate::proto::resources::Notification {
            id: 0,
            created_at: None,
            content: Some(
                crate::proto::resources::notification::Content::ContentBenchmarkJob(
                    crate::proto::resources::notification::BenchmarkJobMessage {
                        benchmark_job_id: job.id,
                    },
                ),
            ),
        };
        let notification = notify(conn, &notification_pb, &contestant.0)?;
        if WEBPUSH_VAPID_KEY.is_some() {
            notification_pb.id = notification.id;
            notification_pb.created_at =
                Some(crate::chrono_timestamp_to_protobuf(notification.created_at));
            // TODO: Web Push IIKANJI NI SHITE
        }
    }
    Ok(())
}

fn notify<Q>(
    conn: &mut Q,
    notification: &crate::proto::resources::Notification,
    contestant_id: &str,
) -> Result<crate::Notification, mysql::Error>
where
    Q: Queryable,
{
    use prost::Message;

    let mut proto = Vec::with_capacity(notification.encoded_len());
    notification
        .encode(&mut proto)
        .expect("Failed to encode Notification to protobuf");
    let encoded_message = data_encoding::BASE64.encode(proto.as_slice());
    conn.exec_drop(
        "INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))",
        (contestant_id, encoded_message),
      )?;
    Ok(conn
        .query_first("SELECT * FROM `notifications` WHERE `id` = LAST_INSERT_ID() LIMIT 1")?
        .expect("Inserted notification is not found"))
}

const WEBPUSH_VAPID_PRIVATE_KEY_PATH: &str = "../vapid_private.pem";
lazy_static::lazy_static! {
    static ref WEBPUSH_VAPID_KEY: Option<crate::webpush::VapidKey> = crate::webpush::VapidKey::open(WEBPUSH_VAPID_PRIVATE_KEY_PATH);
}

pub fn get_public_key_for_push_header() -> Option<String> {
    WEBPUSH_VAPID_KEY
        .as_ref()
        .map(|key| key.public_key_for_push_header.clone())
}

pub fn is_webpush_available() -> bool {
    WEBPUSH_VAPID_KEY.is_some()
}
