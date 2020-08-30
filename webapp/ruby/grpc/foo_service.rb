require 'xsuportal/services/bench/foo_pb'
require 'xsuportal/services/bench/foo_services_pb'
require 'benchmark'

class FooService < Xsuportal::Proto::Services::Bench::Foo::Service
  def measure(msg, &block)
    result = nil
    duration = Benchmark.realtime do
      result = block.call
    end

    GRPC.logger.debug "MEASURE(%s) %.3f" % [msg, duration]
    result
  end

  def hello(call)
    t = Time.now
    call.each_with_index do |request, i|
      msg = "You said '%s' | MEASURE(call.each): i=%d, %.3f" % [request.msg, i, Time.now - t]
      GRPC.logger.info "sending #{msg.inspect}"
      call.send_msg Xsuportal::Proto::Services::Bench::FooResponse.new(
        msg: msg,
      )
      t = Time.now
    end
  end
end
