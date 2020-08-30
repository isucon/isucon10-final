require 'griffin'
require 'socket'
require 'xsuportal/services/bench/foo_pb'
require 'xsuportal/services/bench/foo_services_pb'
require 'pry-byebug'

socket = TCPSocket.new('localhost', 50051)
stub = Xsuportal::Proto::Services::Bench::Foo::Stub.new(socket)

call = stub.hello({})

t = Thread.new do
  call.each do |rn|
    GRPC.logger.info("Receved message: #{rn.inspect}")
  end
end

(1..3).each do |i|
  req = Xsuportal::Proto::Services::Bench::FooRequest.new({msg: "hey(#{i})"})
  call.send_msg(req)
end
# call.send_msg(Xsuportal::Proto::Services::Bench::FooRequest.new({msg: "end"})
call.close_and_send
t.join

socket.close
puts 'finished'
