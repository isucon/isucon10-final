#!/usr/bin/env ruby

$: << File.expand_path('../lib', __dir__)
require 'etc'
require 'logger'
require 'griffin'
require 'grpc'
require 'griffin/interceptors/server/logging_interceptor'
require_relative '../grpc/benchmark_queue_service'
require_relative '../grpc/benchmark_report_service'

Griffin::Server.configure do |c|
  c.bind '0.0.0.0'

  c.services [
    BenchmarkQueueService,
    BenchmarkReportService,
  ]

  c.interceptors [
    Griffin::Interceptors::Server::LoggingInterceptor.new,
  ]

  # Number of processes
  c.workers 1
  # Min/Max number of threads per process to handle gRPC call (= maximum concurrent number of gRPC requests per process)
  c.pool_size 15,15
  # Min/Max number of threads per process to handle HTTP/2 connection (= maximum concurrent connection per process)
  c.connection_size 2,2

  c.logger Logger.new($stdout)
end

Griffin::Server.run(port: ENV.fetch('PORT', '50051')&.to_i)
