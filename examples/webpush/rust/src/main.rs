use mysql::prelude::*;
use prost::Message;
use rand::prelude::*;
use std::io::Read;
use structopt::StructOpt;

#[derive(Debug, StructOpt)]
struct Opt {
    #[structopt(short = "c")]
    contestant_id: String,
    #[structopt(short = "i")]
    vapid_private_key_path: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();

    let opt = Opt::from_args();

    let vapid_key = xsuportal::webpush::VapidKey::open(&opt.vapid_private_key_path)
        .expect("Failed to load VAPID key");
    let mut file = std::fs::File::open(&opt.vapid_private_key_path)?;
    let mut pem_content = Vec::new();
    file.read_to_end(&mut pem_content)?;

    let mysql_env = xsuportal::MySQLConnectionEnv::default();
    let pool = mysql::Pool::new(
        mysql::OptsBuilder::new()
            .ip_or_hostname(Some(&mysql_env.host))
            .tcp_port(mysql_env.port)
            .user(Some(&mysql_env.user))
            .db_name(Some(&mysql_env.db_name))
            .pass(Some(&mysql_env.password))
            .init(vec!["SET time_zone='+00:00'".to_owned()]),
    )?;
    let mut conn = pool.get_conn()?;
    let subs = get_push_subscriptions(&mut conn, &opt.contestant_id)?;
    let mut notification_pb = make_test_notification_pb();
    let notification = insert_notification(&mut conn, &notification_pb, &opt.contestant_id)?;
    notification_pb.id = notification.id;
    notification_pb.created_at = Some(xsuportal::chrono_timestamp_to_protobuf(
        notification.created_at,
    ));

    println!("Notification={:?}", notification_pb);

    for sub in subs {
        println!("Sending web push: push_subscription={:?}", sub);
        send_web_push(&vapid_key, &notification_pb, &sub).await?;
    }

    println!("Finished");

    Ok(())
}

fn get_push_subscriptions<Q>(
    conn: &mut Q,
    contestant_id: &str,
) -> Result<Vec<xsuportal::PushSubscription>, mysql::Error>
where
    Q: Queryable,
{
    let subs = conn.exec(
        "SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?",
        (contestant_id,),
    )?;
    if subs.is_empty() {
        panic!(
            "No push subscriptions found: contestant_id={}",
            contestant_id
        );
    } else {
        Ok(subs)
    }
}

fn make_test_notification_pb() -> xsuportal::proto::resources::Notification {
    let now = chrono::Utc::now();
    let mut rng = rand::thread_rng();
    xsuportal::proto::resources::Notification {
        id: 0,
        created_at: Some(xsuportal::chrono_timestamp_to_protobuf(now.naive_utc())),
        content: Some(
            xsuportal::proto::resources::notification::Content::ContentTest(
                xsuportal::proto::resources::notification::TestMessage {
                    something: rng.gen_range(0, 10000),
                },
            ),
        ),
    }
}

fn insert_notification<Q>(
    conn: &mut Q,
    notification_pb: &xsuportal::proto::resources::Notification,
    contestant_id: &str,
) -> Result<xsuportal::Notification, Box<dyn std::error::Error>>
where
    Q: Queryable,
{
    let mut pb = Vec::with_capacity(notification_pb.encoded_len());
    notification_pb.encode(&mut pb)?;
    let encoded_message = base64::encode(&pb);
    conn.exec_drop("INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))", (contestant_id, encoded_message))?;
    let notification: Option<xsuportal::Notification> =
        conn.query_first("SELECT * FROM `notifications` WHERE `id` = LAST_INSERT_ID()")?;
    Ok(notification.unwrap())
}

const WEBPUSH_SUBJECT: &str = "xsuportal-debug@example.com";

async fn send_web_push(
    vapid_key: &xsuportal::webpush::VapidKey,
    notification_pb: &xsuportal::proto::resources::Notification,
    sub: &xsuportal::PushSubscription,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut pb = Vec::with_capacity(notification_pb.encoded_len());
    notification_pb.encode(&mut pb)?;
    let message = base64::encode(&pb);

    let auth = base64::decode_config(&sub.auth, base64::URL_SAFE_NO_PAD)?;
    let p256dh = base64::decode_config(&sub.p256dh, base64::URL_SAFE_NO_PAD)?;
    let endpoint = url::Url::parse(&sub.endpoint)?;

    let payload = xsuportal::webpush::build_payload(&auth, &p256dh, &message)?;
    let signer = xsuportal::webpush::WebPushSigner::new(
        &vapid_key.encoding_key,
        &vapid_key.public_key_for_push_header,
    );
    let headers = signer
        .sign(&endpoint, WEBPUSH_SUBJECT)
        .expect("Failed to build WebPush headers");

    let client = reqwest::Client::new();
    let resp = client
        .post(endpoint)
        .headers(headers)
        .body(payload)
        .send()
        .await?;
    if resp.status().is_success() {
        Ok(())
    } else {
        eprintln!(
            "Web Push service returned an error: status={}",
            resp.status()
        );
        Ok(())
    }
}
