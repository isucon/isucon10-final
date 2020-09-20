#!/usr/bin/env ruby
$: << File.expand_path('../lib', __dir__)
require 'optparse'
require 'socket'
require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/receiving_services_pb'
require 'xsuportal/services/bench/reporting_services_pb'

def receive_benchmark_job(team_id)
  socket = TCPSocket.new('localhost', 50051)
  stub = Xsuportal::Proto::Services::Bench::BenchmarkQueue::Stub.new(socket)
  req = Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobRequest.new({team_id: team_id})

  stub.receive_benchmark_job(req)
end

def report_benchmark_result(job_handle)
  socket = TCPSocket.new('localhost', 50051)
  stub = Xsuportal::Proto::Services::Bench::BenchmarkReport::Stub.new(socket)
  nonce = rand(10000)

  call = stub.report_benchmark_result({})

  score_raw = rand(30000)
  score_deduction = [rand(2000) - 1800, 0].max
  marked_at = Time.now

  benchmark_result = Xsuportal::Proto::Resources::BenchmarkResult.new(
    finished: true,
    passed: true,
    score: [score_raw - score_deduction, 0].max,
    score_breakdown: Xsuportal::Proto::Resources::BenchmarkResult::ScoreBreakdown.new(
      raw: score_raw,
      deduction: score_deduction,
    ),
    reason: 'OK',
    marked_at: Google::Protobuf::Timestamp.new(
      seconds: marked_at.to_i,
      nanos: ((marked_at.to_f - marked_at.to_i) * (1000 ** 3)).to_i
    ),
  )

  call.send_msg(
    Xsuportal::Proto::Services::Bench::ReportBenchmarkResultRequest.new(
      job_id: job_handle.job_id,
      handle: job_handle.handle,
      nonce: nonce,
      result: Xsuportal::Proto::Resources::BenchmarkResult.new(
        finished: false,
      )
    )
  )

  call.each do |response|
    puts "Receved message: #{response.inspect}"
    raise "Unexpeced acked_nonce=#{response.acked_nonce}" if response.acked_nonce != nonce
    break
  end

  puts "Reported as running: job_id=#{job_handle.job_id}"

  call.send_msg(
    Xsuportal::Proto::Services::Bench::ReportBenchmarkResultRequest.new(
      job_id: job_handle.job_id,
      handle: job_handle.handle,
      nonce: nonce + 1,
      result: Xsuportal::Proto::Resources::BenchmarkResult.new(
        finished: true,
        passed: true,
        score: [score_raw - score_deduction, 0].max,
        score_breakdown: Xsuportal::Proto::Resources::BenchmarkResult::ScoreBreakdown.new(
          raw: score_raw,
          deduction: score_deduction,
        ),
        reason: 'OK',
        marked_at: Google::Protobuf::Timestamp.new(
          seconds: marked_at.to_i,
          nanos: ((marked_at.to_f - marked_at.to_i) * (1000 ** 3)).to_i
        ),
      )
    )
  )

  call.each do |response|
    puts "Receved message: #{response.inspect}"
    raise "Unexpeced acked_nonce=#{response.acked_nonce}" if response.acked_nonce != nonce + 1
    break
  end

  puts "Reported as finished: job_id=#{job_handle.job_id}"
end

team_id = nil
option_parser = OptionParser.new do |opt|
  opt.banner = "Usage: #{__FILE__} -t team_id"
  opt.on('-t team_id') {|x| team_id = x.to_i }
end
option_parser.parse!

abort option_parser.banner unless team_id

puts "Receiving queued job: team_id=#{team_id}"
job = receive_benchmark_job(team_id).job_handle

if job
  puts "Received a job: job_id=#{job.job_id}"

  report_benchmark_result(job)
else
  puts "Job not found"
end
