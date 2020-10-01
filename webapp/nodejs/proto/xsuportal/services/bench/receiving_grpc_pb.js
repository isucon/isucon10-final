// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xsuportal_services_bench_receiving_pb = require('../../../xsuportal/services/bench/receiving_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobRequest(arg) {
  if (!(arg instanceof xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest)) {
    throw new Error('Expected argument of type xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobRequest(buffer_arg) {
  return xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobResponse(arg) {
  if (!(arg instanceof xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse)) {
    throw new Error('Expected argument of type xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobResponse(buffer_arg) {
  return xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var BenchmarkQueueService = exports.BenchmarkQueueService = {
  receiveBenchmarkJob: {
    path: '/xsuportal.proto.services.bench.BenchmarkQueue/ReceiveBenchmarkJob',
    requestStream: false,
    responseStream: false,
    requestType: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobRequest,
    responseType: xsuportal_services_bench_receiving_pb.ReceiveBenchmarkJobResponse,
    requestSerialize: serialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobRequest,
    requestDeserialize: deserialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobRequest,
    responseSerialize: serialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobResponse,
    responseDeserialize: deserialize_xsuportal_proto_services_bench_ReceiveBenchmarkJobResponse,
  },
};

exports.BenchmarkQueueClient = grpc.makeGenericClientConstructor(BenchmarkQueueService);
