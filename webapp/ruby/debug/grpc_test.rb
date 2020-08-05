require 'griffin'
require 'socket'
require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/receiving_services_pb'
require 'xsuportal/services/bench/reporting_services_pb'
require 'pry-byebug'

socket = TCPSocket.new('localhost', 50051)
stub = Xsuportal::Proto::Services::Bench::BenchmarkQueue::Stub.new(socket)
req = Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobRequest.new({token: 'hoge'})

message = stub.receive_benchmark_job(req)

socket2 = TCPSocket.new('localhost', 50051)
stub = Xsuportal::Proto::Services::Bench::BenchmarkReport::Stub.new(socket2)

call = stub.report_benchmark_result({})

t = Thread.new do
  call.each do |rn|
    GRPC.logger.info("Receved message: #{rn.inspect}")
  end
end

(1..3).each do |i|
  req = Xsuportal::Proto::Services::Bench::ReportBenchmarkResultRequest.new({job_id: i})
  call.send_msg(req)
end
call.close_and_send
t.join

socket.close
puts 'finished'
