// package: xsuportal.proto.services.bench
// file: xsuportal/services/bench/receiving.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as xsuportal_services_bench_receiving_pb from "../../../xsuportal/services/bench/receiving_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IBenchmarkQueueService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    receiveBenchmarkJob: IBenchmarkQueueService_IReceiveBenchmarkJob;
}

interface IBenchmarkQueueService_IReceiveBenchmarkJob extends grpc.MethodDefinition<xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse> {
    path: "/xsuportal.proto.services.bench.BenchmarkQueue/ReceiveBenchmarkJob";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest>;
    requestDeserialize: grpc.deserialize<xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest>;
    responseSerialize: grpc.serialize<xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse>;
    responseDeserialize: grpc.deserialize<xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse>;
}

export const BenchmarkQueueService: IBenchmarkQueueService;

export interface IBenchmarkQueueServer {
    receiveBenchmarkJob: grpc.handleUnaryCall<xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse>;
}

export interface IBenchmarkQueueClient {
    receiveBenchmarkJob(request: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, callback: (error: grpc.ServiceError | null, response: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse) => void): grpc.ClientUnaryCall;
    receiveBenchmarkJob(request: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse) => void): grpc.ClientUnaryCall;
    receiveBenchmarkJob(request: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse) => void): grpc.ClientUnaryCall;
}

export class BenchmarkQueueClient extends grpc.Client implements IBenchmarkQueueClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public receiveBenchmarkJob(request: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, callback: (error: grpc.ServiceError | null, response: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse) => void): grpc.ClientUnaryCall;
    public receiveBenchmarkJob(request: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse) => void): grpc.ClientUnaryCall;
    public receiveBenchmarkJob(request: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse) => void): grpc.ClientUnaryCall;
}
