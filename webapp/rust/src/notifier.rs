use crate::webpush::WebPushSigner;
use chrono::NaiveDateTime;
use mysql::prelude::*;
use url::Url;

pub struct WebPushNotifier {
    push_subscription: PushSubscription,
    encoded_message: String,
}
impl WebPushNotifier {
    pub async fn send(self) -> Result<reqwest::Response, reqwest::Error> {
        // reqwest が返す future が Sync を実装しておらず ReportService::ReportBenchmarkResultStream
        // の中で使えないので、tokio::oneshot::channel() 経由にする。
        let (tx, rx) = tokio::sync::oneshot::channel();
        tokio::spawn(async move {
            let p256dh =
                base64::decode(&self.push_subscription.p256dh).expect("Failed to decode p256dh");
            let auth = base64::decode(&self.push_subscription.auth).expect("Failed to decode auth");
            let endpoint =
                Url::parse(&self.push_subscription.endpoint).expect("Failed to parse endpoint");
            let payload = crate::webpush::build_payload(&auth, &p256dh, &self.encoded_message)
                .expect("Failed to build WebPush payload");
            let signer = WebPushSigner::new(&WEBPUSH_VAPID_PRIVATE_KEY)
                .expect("Failed to create WebPushSigner");
            const WEBPUSH_SUBJECT: &str = "xsuportal@example.com";
            let headers = signer
                .sign(&endpoint, WEBPUSH_SUBJECT)
                .expect("Failed to build WebPush headers");

            let client = reqwest::Client::new();
            let result = client
                .post(endpoint)
                .headers(headers)
                .body(payload)
                .send()
                .await;
            tx.send(result).expect("Failed to send WebPush response");
        });
        rx.await.expect("Failed to receive WebPush response")
    }
}

pub fn notify_clarification_answered<Q>(
    conn: &mut Q,
    clar: &crate::Clarification,
    updated: bool,
) -> Result<Vec<WebPushNotifier>, mysql::Error>
where
    Q: Queryable,
{
    let contestants: Vec<(String, i64)> = if clar.disclosed == Some(true) {
        conn.query("SELECT `id`, `team_id` FROM `contestants`")
    } else {
        conn.exec(
            "SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?",
            (clar.team_id,),
        )
    }?;
    let mut notifiers = Vec::with_capacity(contestants.len());
    for contestant in contestants {
        let notification = crate::proto::resources::Notification {
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
        notify(conn, &notification, &contestant.0)?;
        if !WEBPUSH_VAPID_PRIVATE_KEY.is_empty() {
            notifiers.extend(build_webpush_notifier(conn, &notification, &contestant.0)?);
        }
    }
    Ok(notifiers)
}

pub fn notify_benchmark_job_finished<Q>(
    conn: &mut Q,
    job: &crate::BenchmarkJob,
) -> Result<Vec<WebPushNotifier>, mysql::Error>
where
    Q: Queryable,
{
    let contestants: Vec<(String, i64)> = conn.exec(
        "SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?",
        (job.team_id,),
    )?;
    let mut notifiers = Vec::with_capacity(contestants.len());
    for contestant in contestants {
        let notification = crate::proto::resources::Notification {
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
        notify(conn, &notification, &contestant.0)?;
        if !WEBPUSH_VAPID_PRIVATE_KEY.is_empty() {
            notifiers.extend(build_webpush_notifier(conn, &notification, &contestant.0)?);
        }
    }
    Ok(notifiers)
}

fn notify<Q>(
    conn: &mut Q,
    notification: &crate::proto::resources::Notification,
    contestant_id: &str,
) -> Result<(), mysql::Error>
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
      )
}

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

lazy_static::lazy_static! {
    static ref WEBPUSH_VAPID_PRIVATE_KEY: Vec<u8> = load_webpush_vapid_private_key();
    static ref EC_GROUP: openssl::ec::EcGroup = openssl::ec::EcGroup::from_curve_name(openssl::nid::Nid::X9_62_PRIME256V1).expect("EC Prime256v1 is not supported");
}

fn load_webpush_vapid_private_key() -> Vec<u8> {
    const WEBPUSH_VAPID_PRIVATE_KEY_PATH: &str = "../vapid_private.pem";
    match std::fs::File::open(WEBPUSH_VAPID_PRIVATE_KEY_PATH) {
        Ok(mut file) => {
            use std::io::Read;
            let mut buf = Vec::new();
            file.read_to_end(&mut buf)
                .expect("Failed to read WebPush VAPID private key");
            buf
        }
        Err(e) => {
            log::warn!(
                "Failed to open WebPush VAPID private key {}: {:?}",
                WEBPUSH_VAPID_PRIVATE_KEY_PATH,
                e
            );
            Vec::new()
        }
    }
}

pub fn get_public_key_for_push_header() -> Option<String> {
    if WEBPUSH_VAPID_PRIVATE_KEY.is_empty() {
        None
    } else {
        openssl::ec::EcKey::private_key_from_pem(&WEBPUSH_VAPID_PRIVATE_KEY)
            .map_err(|e| {
                log::warn!("Failed to parse WebPush VAPID private key: {:?}", e);
                e
            })
            .ok()
            .map(|ec_key| {
                let mut ctx = openssl::bn::BigNumContext::new().unwrap();
                let key = ec_key.public_key();
                let key_bytes = key
                    .to_bytes(
                        &*EC_GROUP,
                        openssl::ec::PointConversionForm::UNCOMPRESSED,
                        &mut ctx,
                    )
                    .unwrap();
                data_encoding::BASE64URL_NOPAD.encode(&key_bytes)
            })
    }
}

pub fn is_webpush_available() -> bool {
    !WEBPUSH_VAPID_PRIVATE_KEY.is_empty()
}

fn build_webpush_notifier<Q>(
    conn: &mut Q,
    notification: &crate::proto::resources::Notification,
    contestant_id: &str,
) -> Result<Vec<WebPushNotifier>, mysql::Error>
where
    Q: Queryable,
{
    use prost::Message;

    let mut proto = Vec::with_capacity(notification.encoded_len());
    notification
        .encode(&mut proto)
        .expect("Failed to encode Notification to protobuf");
    let encoded_message = data_encoding::BASE64.encode(proto.as_slice());

    let subs: Vec<PushSubscription> = conn.exec(
        "SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?",
        (contestant_id,),
    )?;
    Ok(subs
        .into_iter()
        .map(|push_subscription| WebPushNotifier {
            push_subscription,
            encoded_message: encoded_message.clone(),
        })
        .collect())
    /*
    for sub in subs {
    }
    Ok(())
        */
}
