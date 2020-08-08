#!/usr/bin/env ruby

# 仮想ベンチマーカー本体
#
# 本番では実ベンチマーカーに統合され、このコードは配布されません
# 競技の際にはコードの中身は読めない体でおねがいします

$: << File.expand_path('../lib', __dir__)
require 'socket'
require 'csv'
require 'griffin'
require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/receiving_services_pb'
require 'xsuportal/services/bench/reporting_services_pb'

HOST = ENV.fetch('GRPC_HOST', 'localhost')
PORT = ENV.fetch('GRPC_PORT', 50051)
NUM_THREADS = ENV.fetch('NUM_THREADS', 3).to_i
SCORE_PATTERN_DIR = File.join(__dir__, '../../../data')
SCORE_PATTERN_INTERVAL_SEC = 5

class ServiceClientBase
  def socket
    @socket ||= TCPSocket.new(HOST, PORT)
  end

  def close
    @socket.close if @socket
  end
end

class ReportServiceClient < ServiceClientBase
  def stub
    @stub ||= Xsuportal::Proto::Services::Bench::BenchmarkReport::Stub.new(socket)
  end

  def report_benchmark_result
    @call = stub.report_benchmark_result({})
  end

  def call
    @call
  end

  def make_request(opts)
    Xsuportal::Proto::Services::Bench::ReportBenchmarkResultRequest.new(opts)
  end
end

class QueueServiceClient < ServiceClientBase
  def stub
    @stub ||= Xsuportal::Proto::Services::Bench::BenchmarkQueue::Stub.new(socket)
  end

  def receive_benchmark_job(request_opts)
    request = make_request(request_opts)
    stub.receive_benchmark_job(request)
  end

  def make_request(opts)
    Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobRequest.new(opts)
  end
end

class BenchmarkClient
  SLEEP_INTERVAL = 1

  def initialize
    load_score_patterns
  end

  def load_score_patterns
    @score_patterns = []
    Dir.glob("#{SCORE_PATTERN_DIR}/pattern*.tsv") do |path|
      tsv = CSV.read(path, col_sep: "\t", headers: true)
      pattern = []
      tsv.each do |line|
        pattern << {
          time: line['time'].to_i,
          status: line['status'],
          score_raw: line['score_raw'].to_i,
          deduction: line['deduction'].to_i,
        }
      end
      @score_patterns << pattern
    end
    @score_patterns
  end

  def score_patterns
    @score_patterns
  end

  def get_score(pattern_idx, seconds_since_contest_started)
    pattern = score_patterns[pattern_idx]
    raise "unexpected pattern index: #{pattern_idx}" unless pattern
    time_idx = (seconds_since_contest_started / SCORE_PATTERN_INTERVAL_SEC).floor
    pattern[[time_idx, pattern.length-1].min]
  end

  def start
    @stop_client = false
    log "Start"
    loop do
      # Thread.pass
      if stop?
        log "Stopped"
        break
      end
      response = queue_service_client.receive_benchmark_job({})
      if response.job_handle
        log "Received job: #{response.job_handle}"
        do_benchmark(response.job_handle)
      else
        sleep SLEEP_INTERVAL
      end
    end
  end

  def do_benchmark(job_handle)
    call = report_service_client.report_benchmark_result
    log "Executing benchmark..."
    # TODO: send and validate nonce
    request = report_service_client.make_request({
      job_id: job_handle.job_id,
      result: {
        finished: false
      },
    })
    call.send_msg(request)

    call.each do |req|
      log "Received response: #{req.inspect}"
      break
    end

    score = get_score(0, job_handle.job_created_at.seconds - job_handle.contest_started_at.seconds)
    unless score[:status] == 'fast-fail'
      sleep 1
    end
    log "score=#{score.inspect}"

    request = report_service_client.make_request({
      job_id: job_handle.job_id,
      result: {
        finished: true,
        passed: score[:status] == 'pass',
        score: score[:score_raw] - score[:deduction],
        score_breakdown: {
          base: score[:score_raw],
          deduction: score[:deduction],
        },
        reason: 'REASON',
        stdout: 'succeeded',
        stderr: 'no error',
      },
    })
    log "Finished benchmark! result=#{request}"
    call.send_msg(request)

    call.each do |req|
      log "Received response: #{req.inspect}"
      break
    end

  end

  def queue_service_client
    @queue_service_client ||= QueueServiceClient.new
  end

  def report_service_client
    @report_service_client ||= ReportServiceClient.new
  end

  def log(str)
    puts "[#{Thread.current.object_id}] #{str}"
  end

  def stop
    @stop_client = true
  end

  def stop?
    @stop_client
  end
end

threads = []
NUM_THREADS.times do
  threads << Thread.new do
    Thread.current[:client] = BenchmarkClient.new
    Thread.current[:client].start
  end
end

threads.each(&:join)
