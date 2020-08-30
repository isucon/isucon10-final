#!/usr/bin/env ruby

$: << File.expand_path('../lib', __dir__)
require 'logger'
require 'grpc'
require 'grpc_kit'
require_relative '../grpc/benchmark_queue_service'
require_relative '../grpc/benchmark_report_service'
require 'database'

def main
  s = GRPC::RpcServer.new
  s.add_http2_port('0.0.0.0:50051', :this_port_is_insecure)
  s.handle(BenchmarkQueueService)
  s.handle(BenchmarkReportService)
  # Runs the server with SIGHUP, SIGINT and SIGQUIT signal handlers to
  #   gracefully shutdown.
  # User could also choose to run server via call to run_till_terminated
  s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])
end

main
