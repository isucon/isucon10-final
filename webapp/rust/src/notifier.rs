use crate::webpush::WebPushSigner;
use chrono::NaiveDateTime;
use mysql::prelude::*;
use url::Url;

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

#[derive(Debug)]
pub enum WebPushError {
    ExpiredSubscription(PushSubscription, reqwest::Response),
    InvalidSubscription(PushSubscription, reqwest::Response),
    Unauthorized(PushSubscription, reqwest::Response),
    PayloadTooLarge(PushSubscription, reqwest::Response),
    TooManyRequests(PushSubscription, reqwest::Response),
    PushServiceError(PushSubscription, reqwest::Response),
    ResponseError(PushSubscription, reqwest::Response),
    ReqwestError(PushSubscription, reqwest::Error),
}
impl std::fmt::Display for WebPushError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> Result<(), std::fmt::Error> {
        match self {
            Self::ExpiredSubscription(_, _) => write!(f, "ExpiredSubscription"),
            Self::InvalidSubscription(_, _) => write!(f, "InvalidSubscription"),
            Self::Unauthorized(_, _) => write!(f, "Unauthorized"),
            Self::PayloadTooLarge(_, _) => write!(f, "PayloadTooLarge"),
            Self::TooManyRequests(_, _) => write!(f, "TooManyRequests"),
            Self::PushServiceError(_, _) => write!(f, "PushServiceError"),
            Self::ResponseError(_, _) => write!(f, "ResponseError"),
            Self::ReqwestError(_, e) => write!(f, "{}", e),
        }
    }
}

pub struct WebPushNotifier {
    push_subscription: PushSubscription,
    encoded_message: String,
}
impl WebPushNotifier {
    pub async fn send(self) -> Result<(), WebPushError> {
        let p256dh = base64::decode_config(&self.push_subscription.p256dh, base64::URL_SAFE_NO_PAD)
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

        // reqwest が返す future が Sync を実装しておらず ReportService::ReportBenchmarkResultStream
        // の中で使えないので、tokio::oneshot::channel() 経由にする。
        let (tx, rx) = tokio::sync::oneshot::channel();
        tokio::spawn(async move {
            let client = reqwest::Client::new();
            let result = client
                .post(endpoint)
                .headers(headers)
                .body(payload)
                .send()
                .await;
            if let Err(result) = tx.send(result) {
                log::error!(
                    "Failed to send Web Push response via tokio::sync::oneshot: {:?}",
                    result
                );
            }
        });
        match rx.await.expect("Failed to receive WebPush response") {
            Ok(resp) => match resp.status().as_u16() {
                _ if resp.status().is_success() => Ok(()),
                _ if resp.status().is_server_error() => {
                    Err(WebPushError::PushServiceError(self.push_subscription, resp))
                }
                410 => Err(WebPushError::ExpiredSubscription(
                    self.push_subscription,
                    resp,
                )),
                404 => Err(WebPushError::InvalidSubscription(
                    self.push_subscription,
                    resp,
                )),
                401 | 403 => Err(WebPushError::Unauthorized(self.push_subscription, resp)),
                413 => Err(WebPushError::PayloadTooLarge(self.push_subscription, resp)),
                429 => Err(WebPushError::TooManyRequests(self.push_subscription, resp)),
                _ => Err(WebPushError::ResponseError(self.push_subscription, resp)),
            },
            Err(e) => Err(WebPushError::ReqwestError(self.push_subscription, e)),
        }
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
        conn.query("SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` IS NOT NULL")
    } else {
        conn.exec(
            "SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?",
            (clar.team_id,),
        )
    }?;
    let mut notifiers = Vec::with_capacity(contestants.len());
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
            notifiers.extend(build_webpush_notifier(
                conn,
                &notification_pb,
                &contestant.0,
            )?);
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
            notifiers.extend(build_webpush_notifier(
                conn,
                &notification_pb,
                &contestant.0,
            )?);
        }
    }
    Ok(notifiers)
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
