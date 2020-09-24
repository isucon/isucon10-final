use actix_session::CookieSession;
use actix_web::dev::Service;
use actix_web::{middleware, web, App, HttpServer};
use futures::future::FutureExt;
use listenfd::ListenFd;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    if env::var("RUST_LOG").is_err() {
        env::set_var(
            "RUST_LOG",
            "actix_server=info,actix_web=info,xsuportal=info",
        );
    }
    env_logger::init();

    let mysql_connection_env = xsuportal::MySQLConnectionEnv::default();

    let manager = r2d2_mysql::MysqlConnectionManager::new(
        mysql::OptsBuilder::new()
            .ip_or_hostname(Some(&mysql_connection_env.host))
            .tcp_port(mysql_connection_env.port)
            .user(Some(&mysql_connection_env.user))
            .db_name(Some(&mysql_connection_env.db_name))
            .pass(Some(&mysql_connection_env.password))
            .init(vec!["SET time_zone='+00:00'".to_owned()]),
    );
    let pool = r2d2::Pool::builder()
        .max_size(10)
        .build(manager)
        .expect("Failed to create connection pool");

    let mut listenfd = ListenFd::from_env();
    let mut secret = b"tagomoris".to_vec();
    secret.resize(32, 0);
    let server = HttpServer::new(move || {
        let mut app = App::new()
            .data(pool.clone())
            .wrap(middleware::Logger::default())
            .wrap_fn(|mut req, srv| {
                let headers = req.headers_mut();
                if let Some(content_type) = headers.get(actix_web::http::header::CONTENT_TYPE) {
                    if content_type == "application/vnd.google.protobuf" {
                        // actix-protobuf は Content-Type として application/protobuf を指定してい
                        // るが、ベンチマーカーは application/vnd.google.protobuf を指定・期待して
                        // いるので middleware で書き換える。
                        headers.insert(
                            actix_web::http::header::CONTENT_TYPE,
                            actix_web::http::HeaderValue::from_static("application/protobuf"),
                        );
                    }
                }
                srv.call(req).map(|resp| match resp {
                    Ok(mut resp) => {
                        let success = resp.status().is_success();
                        let headers = resp.headers_mut();
                        if let Some(content_type) = headers.get(actix_web::http::header::CONTENT_TYPE) {
                            if content_type == "application/protobuf" {
                                if success {
                                    headers.insert(actix_web::http::header::CONTENT_TYPE, actix_web::http::HeaderValue::from_static("application/vnd.google.protobuf"));
                                } else {
                                    headers.insert(actix_web::http::header::CONTENT_TYPE, actix_web::http::HeaderValue::from_static("application/vnd.google.protobuf; proto=xsuportal.proto.Error"));
                                }
                            }
                        }
                        Ok(resp)
                    }
                    Err(e) => Err(e),
                })
            })
            .wrap(
                CookieSession::signed(&secret)
                    .secure(false)
                    .name("session_xsucon")
                    .max_age(3600),
            )
            .route("/initialize", web::post().to(xsuportal::admin::initialize))
            .route("/api/admin/clarifications", web::get().to(xsuportal::admin::list_clarifications))
            .route("/api/admin/clarifications/{id}", web::get().to(xsuportal::admin::get_clarification))
            .route("/api/admin/clarifications/{id}", web::put().to(xsuportal::admin::respond_clarification))
            .route("/api/session", web::get().to(xsuportal::common::get_current_session))
            .route("/api/audience/teams", web::get().to(xsuportal::audience::list_teams))
            .route("/api/audience/dashboard", web::get().to(xsuportal::audience::dashboard))
            .route("/api/registration/session", web::get().to(xsuportal::registration::get_session))
            .route("/api/registration/team", web::post().to(xsuportal::registration::create_team))
            .route("/api/registration/contestant", web::post().to(xsuportal::registration::join_team))
            .route("/api/registration", web::put().to(xsuportal::registration::update_registration))
            .route("/api/registration", web::delete().to(xsuportal::registration::delete_registration))
            .route("/api/contestant/benchmark_jobs", web::post().to(xsuportal::contestant::enqueue_benchmark_job))
            .route("/api/contestant/benchmark_jobs", web::get().to(xsuportal::contestant::list_benchmark_jobs))
            .route("/api/contestant/benchmark_jobs/{id}", web::get().to(xsuportal::contestant::get_benchmark_job))
            .route("/api/contestant/clarifications", web::get().to(xsuportal::contestant::list_clarifications))
            .route("/api/contestant/clarifications", web::post().to(xsuportal::contestant::request_clarification))
            .route("/api/contestant/dashboard", web::get().to(xsuportal::contestant::dashboard))
            .route("/api/contestant/notifications", web::get().to(xsuportal::contestant::list_notifications))
            .route("/api/contestant/push_subscriptions", web::post().to(xsuportal::contestant::subscribe_notification))
            .route("/api/contestant/push_subscriptions", web::delete().to(xsuportal::contestant::unsubscribe_notification))
            .route("/api/signup", web::post().to(xsuportal::contestant::signup))
            .route("/api/login", web::post().to(xsuportal::contestant::login))
            .route("/api/logout", web::post().to(xsuportal::contestant::logout))
            ;
        for path in &[
            "/",
            "/registration",
            "/signup",
            "/login",
            "/logout",
            "/teams",
        ] {
            app = app.route(path, web::get().to(audience_html));
        }
        for path in &[
            "/contestant",
            "/contestant/benchmark_jobs",
            "/contestant/benchmark_jobs/{id}",
            "/contestant/clarifications",
        ] {
            app = app.route(path, web::get().to(contestant_html));
        }
        for path in &[
            "/admin",
            "/admin/",
            "/admin/clarifications",
            "/admin/clarifications/{id}",
        ] {
            app = app.route(path, web::get().to(admin_html));
        }
        app.service(
            web::scope("")
                .wrap_fn(|req, srv| {
                    srv.call(req).map(|res| {
                        res.map(|mut res| {
                            let headers = res.headers_mut();
                            if let Some(content_type) =
                                headers.get(actix_web::http::header::CONTENT_TYPE)
                            {
                                // Content-Type ヘッダに charset=utf-8 をつけないとブラウザで JS 内
                                // の日本語が UTF-8 で解釈されないので middleware で書き換える
                                // https://github.com/actix/actix-web/issues/1683
                                match content_type.to_str() {
                                    Ok(ct @ "text/css") | Ok(ct @ "application/javascript") => {
                                        let utf8_ct = format!("{}; charset=utf-8", ct);
                                        headers.insert(
                                            actix_web::http::header::CONTENT_TYPE,
                                            actix_web::http::header::HeaderValue::from_str(
                                                &utf8_ct,
                                            )
                                            .unwrap(),
                                        );
                                    }
                                    _ => {}
                                }
                            }
                            res
                        })
                    })
                })
                .service(actix_files::Files::new("/", "public").disable_content_disposition()),
        )
    });
    let server = if let Some(l) = listenfd.take_tcp_listener(0)? {
        server.listen(l)?
    } else {
        server.bind((
            "0.0.0.0",
            std::env::var("PORT")
                .map(|port_str| port_str.parse().expect("Failed to parse $PORT"))
                .unwrap_or(9292),
        ))?
    };
    server.run().await
}

async fn audience_html() -> Result<actix_files::NamedFile, std::io::Error> {
    actix_files::NamedFile::open("public/audience.html").map(|f| {
        f.disable_content_disposition()
            .set_content_type(mime::TEXT_HTML_UTF_8)
    })
}

async fn contestant_html() -> Result<actix_files::NamedFile, std::io::Error> {
    actix_files::NamedFile::open("public/contestant.html").map(|f| {
        f.disable_content_disposition()
            .set_content_type(mime::TEXT_HTML_UTF_8)
    })
}

async fn admin_html() -> Result<actix_files::NamedFile, std::io::Error> {
    actix_files::NamedFile::open("public/admin.html").map(|f| {
        f.disable_content_disposition()
            .set_content_type(mime::TEXT_HTML_UTF_8)
    })
}
