require 'griffin'
require 'socket'
require 'xsuportal/resources/benchmark_result_pb'
require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/reporting_services_pb'
require 'pry-byebug'

socket = TCPSocket.new('localhost', 50051)
stub = Xsuportal::Proto::Services::Bench::BenchmarkReport::Stub.new(socket)

10.times do
  call = stub.report_benchmark_result({})

  t = Thread.new do
    call.each do |rn|
      GRPC.logger.info("Receved message: #{rn.inspect}")
    end
  end

  req0 = Xsuportal::Proto::Services::Bench::ReportBenchmarkResultRequest.new(
    job_id: 1,
    nonce: 0,
    result: Xsuportal::Proto::Resources::BenchmarkResult.new(
      finished: false,
    )
  )
  call.send_msg(req0)

  req1 = Xsuportal::Proto::Services::Bench::ReportBenchmarkResultRequest.new(
    job_id: 1,
    nonce: 1,
    result: Xsuportal::Proto::Resources::BenchmarkResult.new(
      finished: true,
      passed: true,
      reason: 'yeah',
    )
  )
  call.send_msg(req1)

  # call.send_msg(Xsuportal::Proto::Services::Bench::FooRequest.new({msg: "end"})
  call.close_and_send
  t.join
end

socket.close
puts 'finished'
