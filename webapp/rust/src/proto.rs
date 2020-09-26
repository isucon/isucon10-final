tonic::include_proto!("xsuportal.proto");

pub mod resources {
    tonic::include_proto!("xsuportal.proto.resources");
}

pub mod services {
    pub mod admin {
        tonic::include_proto!("xsuportal.proto.services.admin");
    }
    pub mod audience {
        tonic::include_proto!("xsuportal.proto.services.audience");
    }
    pub mod bench {
        tonic::include_proto!("xsuportal.proto.services.bench");
    }
    pub mod common {
        tonic::include_proto!("xsuportal.proto.services.common");
    }
    pub mod contestant {
        tonic::include_proto!("xsuportal.proto.services.contestant");
    }
    pub mod registration {
        tonic::include_proto!("xsuportal.proto.services.registration");
    }
}
