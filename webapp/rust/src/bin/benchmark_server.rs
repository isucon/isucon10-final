use listenfd::ListenFd;
use std::env;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    if env::var("RUST_LOG").is_err() {
        env::set_var("RUST_LOG", "xsuportal=info");
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
    let pool = Arc::new(
        r2d2::Pool::builder()
            .max_size(10)
            .build(manager)
            .expect("Failed to create connection pool"),
    );

    let server = tonic::transport::Server::builder()
        .add_service(
            xsuportal::proto::services::bench::benchmark_queue_server::BenchmarkQueueServer::new(
                xsuportal::bench::QueueService { db: pool.clone() },
            ),
        )
        .add_service(
            xsuportal::proto::services::bench::benchmark_report_server::BenchmarkReportServer::new(
                xsuportal::bench::ReportService { db: pool },
            ),
        );

    let mut listenfd = ListenFd::from_env();
    if let Some(l) = listenfd.take_tcp_listener(0)? {
        let mut listener = tokio::net::TcpListener::from_std(l)?;
        server.serve_with_incoming(listener.incoming()).await?;
    } else {
        server.serve("0.0.0.0:50051".parse().unwrap()).await?;
    }

    Ok(())
}
