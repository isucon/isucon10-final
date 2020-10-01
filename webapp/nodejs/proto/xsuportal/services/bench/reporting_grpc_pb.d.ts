// package: xsuportal.proto.services.bench
// file: xsuportal/services/bench/reporting.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as xsuportal_services_bench_reporting_pb from "../../../xsuportal/services/bench/reporting_pb";
import * as xsuportal_resources_benchmark_result_pb from "../../../xsuportal/resources/benchmark_result_pb";

interface IBenchmarkReportService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    reportBenchmarkResult: IBenchmarkReportService_IReportBenchmarkResult;
}

interface IBenchmarkReportService_IReportBenchmarkResult extends grpc.MethodDefinition<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest, xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse> {
    path: "/xsuportal.proto.services.bench.BenchmarkReport/ReportBenchmarkResult";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest>;
    requestDeserialize: grpc.deserialize<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest>;
    responseSerialize: grpc.serialize<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
    responseDeserialize: grpc.deserialize<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
}

export const BenchmarkReportService: IBenchmarkReportService;

export interface IBenchmarkReportServer {
    reportBenchmarkResult: grpc.handleBidiStreamingCall<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest, xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
}

export interface IBenchmarkReportClient {
    reportBenchmarkResult(): grpc.ClientDuplexStream<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest, xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
    reportBenchmarkResult(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest, xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
    reportBenchmarkResult(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest, xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
}

export class BenchmarkReportClient extends grpc.Client implements IBenchmarkReportClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public reportBenchmarkResult(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest, xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
    public reportBenchmarkResult(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest, xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse>;
}
