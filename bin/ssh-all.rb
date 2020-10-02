#!/usr/bin/env ruby
require 'thread'

SUBNETS = %w(
  10.160.1.
  10.160.10.
  10.160.15.
  10.160.20.
  10.160.24.
  10.160.27.
  10.160.86.
  10.161.47.
  10.161.59.
  10.161.77.
  10.161.94.
  10.162.10.
  10.162.13.
  10.162.23.
  10.162.28.
  10.162.29.
  10.162.47.
  10.162.76.
  10.162.86.
  10.163.4.
  10.163.31.
  10.163.47.
  10.163.53.
  10.163.75.
  10.163.75.
  10.163.89.
  10.163.94.
  10.164.6.
  10.164.15.
  10.164.28.
  10.164.40.
  10.164.72.
  10.164.73.
  10.164.74.
  10.164.83.
  10.164.98.
  10.165.15.
  10.165.34.
  10.165.35.
  10.165.36.
  10.165.37.
  10.165.38.
)

mode = ARGV.shift
hosts = case mode
when 'bench'
  SUBNETS.map{ |_| "#{_}104" }
when 'contestant'
  SUBNETS.flat_map{ |_| ["#{_}101", "#{_}102", "#{_}103"] }
when '101', '102', '103'
  SUBNETS.map{ |_| "#{_}#{mode}" }
else
  raise "mode should be: bench, contestant, 101, 102, 103"
end

scp = false
if ARGV[0] == '--scp'
  scp = true
  ARGV.shift
  raise if ARGV.size < 2
end
ssh = !scp

puts "SSH to **#{mode}**, #{ARGV.inspect}"
puts "Hosts:"
puts hosts.map { |_| "  * #{_}" }
puts
puts
sleep 3

queue = Queue.new
hosts.each do |h|
  queue.push(h)
end
queue.close

i = 0 

CONCURRENCY = 10
ths = CONCURRENCY.times.map do
  Thread.new do
    failed = []
    while host = queue.pop
      i += 1
      puts "===> #{host} [#{i+1}/#{hosts.size}, remaining=#{queue.size}]"
      retval = if ssh
        system("ssh", "-o", "ConnectTimeout=4", host, *ARGV)
      else
        system("scp", "-o", "ConnectTimeout=4", *ARGV[0...-2], ARGV[-2], "#{host}:#{ARGV[-1]}")
      end
      failed << host unless retval
    end
    failed
  end
end

faileds = ths.flat_map(&:value)

unless faileds.empty?
  puts
  puts "Failures:"
  puts faileds
  exit 1
end
