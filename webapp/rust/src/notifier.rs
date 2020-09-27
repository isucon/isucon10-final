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
                base64::decode_config(&self.push_subscription.p256dh, base64::URL_SAFE_NO_PAD)
                    .expect("Failed to decode p256dh");
            let auth = base64::decode_config(&self.push_subscription.auth, base64::URL_SAFE_NO_PAD)
                .expect("Failed to decode auth");
            let endpoint =
                Url::parse(&self.push_subscription.endpoint).expect("Failed to parse endpoint");
            let payload = crate::webpush::build_payload(&auth, &p256dh, &self.encoded_message)
                .expect("Failed to build WebPush payload");
            let vapid_key = WEBPUSH_VAPID_KEY
                .as_ref()
                .expect("VapidKey is not available");
            let signer = WebPushSigner::new(
                &vapid_key.encoding_key,
                &vapid_key.public_key_for_push_header,
            );
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
    let contestants: Vec<(String, Option<i64>)> = if clar.disclosed == Some(true) {
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
                        owned: contestant
                            .1
                            .map(|team_id| team_id == clar.team_id)
                            .unwrap_or(false),
                        updated,
                    },
                ),
            ),
        };
        notify(conn, &notification, &contestant.0)?;
        if WEBPUSH_VAPID_KEY.is_some() {
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
        if WEBPUSH_VAPID_KEY.is_some() {
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

struct VapidKey {
    encoding_key: jsonwebtoken::EncodingKey,
    public_key_for_push_header: String,
}

lazy_static::lazy_static! {
    static ref WEBPUSH_VAPID_KEY: Option<VapidKey> = load_webpush_vapid_private_key();
}
const WEBPUSH_VAPID_PRIVATE_KEY_PATH: &str = "../vapid_private.pem";

fn load_webpush_vapid_private_key() -> Option<VapidKey> {
    let pem_content = match std::fs::File::open(WEBPUSH_VAPID_PRIVATE_KEY_PATH) {
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
            return None;
        }
    };
    let ec_key = openssl::ec::EcKey::private_key_from_pem(&pem_content);
    if let Err(e) = ec_key {
        log::warn!(
            "Failed to parse WebPush VAPID private key {}: {:?}",
            WEBPUSH_VAPID_PRIVATE_KEY_PATH,
            e
        );
        return None;
    }
    let ec_key = ec_key.unwrap();

    let mut ctx = openssl::bn::BigNumContext::new().unwrap();
    let public_key = ec_key.public_key();
    let key_bytes = public_key
        .to_bytes(
            ec_key.group(),
            openssl::ec::PointConversionForm::UNCOMPRESSED,
            &mut ctx,
        )
        .unwrap();
    let public_key_for_push_header = data_encoding::BASE64URL_NOPAD.encode(&key_bytes);

    let pkey =
        openssl::pkey::PKey::from_ec_key(ec_key).expect("Failed to construct PKey from EcKey");
    let pkcs8 = pkey
        .private_key_to_pem_pkcs8()
        .expect("Failed to get private key from PKey");
    let encoding_key = jsonwebtoken::EncodingKey::from_ec_pem(&pkcs8)
        .expect("Failed to construct EncodingKey from PKey");

    Some(VapidKey {
        encoding_key,
        public_key_for_push_header,
    })
}

pub fn get_public_key_for_push_header() -> Option<String> {
    WEBPUSH_VAPID_KEY
        .as_ref()
        .map(|key| key.public_key_for_push_header.clone())
}

pub fn is_webpush_available() -> bool {
    WEBPUSH_VAPID_KEY.is_some()
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
}
