use crate::webpush::WebPushSigner;
use mysql::prelude::*;
use url::Url;

#[derive(Debug)]
pub enum WebPushError {
    ExpiredSubscription(crate::PushSubscription, reqwest::Response),
    InvalidSubscription(crate::PushSubscription, reqwest::Response),
    Unauthorized(crate::PushSubscription, reqwest::Response),
    PayloadTooLarge(crate::PushSubscription, reqwest::Response),
    TooManyRequests(crate::PushSubscription, reqwest::Response),
    PushServiceError(crate::PushSubscription, reqwest::Response),
    ResponseError(crate::PushSubscription, reqwest::Response),
    ReqwestError(crate::PushSubscription, reqwest::Error),
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
    push_subscription: crate::PushSubscription,
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
            tx.send(result).expect("Failed to send WebPush response");
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

    let subs: Vec<crate::PushSubscription> = conn.exec(
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
