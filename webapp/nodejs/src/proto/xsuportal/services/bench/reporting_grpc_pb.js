// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xsuportal_services_bench_reporting_pb = require('../../../xsuportal/services/bench/reporting_pb.js');
var xsuportal_resources_benchmark_result_pb = require('../../../xsuportal/resources/benchmark_result_pb.js');

function serialize_xsuportal_proto_services_bench_ReportBenchmarkResultRequest(arg) {
  if (!(arg instanceof xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest)) {
    throw new Error('Expected argument of type xsuportal.proto.services.bench.ReportBenchmarkResultRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xsuportal_proto_services_bench_ReportBenchmarkResultRequest(buffer_arg) {
  return xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xsuportal_proto_services_bench_ReportBenchmarkResultResponse(arg) {
  if (!(arg instanceof xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse)) {
    throw new Error('Expected argument of type xsuportal.proto.services.bench.ReportBenchmarkResultResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xsuportal_proto_services_bench_ReportBenchmarkResultResponse(buffer_arg) {
  return xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var BenchmarkReportService = exports.BenchmarkReportService = {
  reportBenchmarkResult: {
    path: '/xsuportal.proto.services.bench.BenchmarkReport/ReportBenchmarkResult',
    requestStream: true,
    responseStream: true,
    requestType: xsuportal_services_bench_reporting_pb.ReportBenchmarkResultRequest,
    responseType: xsuportal_services_bench_reporting_pb.ReportBenchmarkResultResponse,
    requestSerialize: serialize_xsuportal_proto_services_bench_ReportBenchmarkResultRequest,
    requestDeserialize: deserialize_xsuportal_proto_services_bench_ReportBenchmarkResultRequest,
    responseSerialize: serialize_xsuportal_proto_services_bench_ReportBenchmarkResultResponse,
    responseDeserialize: deserialize_xsuportal_proto_services_bench_ReportBenchmarkResultResponse,
  },
};

exports.BenchmarkReportClient = grpc.makeGenericClientConstructor(BenchmarkReportService);
