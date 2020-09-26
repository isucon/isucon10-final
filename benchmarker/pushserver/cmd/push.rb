require 'json'
require 'webpush'

sub = JSON.parse(File.read(ARGV[0]))
sub2 = JSON.parse(File.read(ARGV[1])) if ARGV[1]

vapid = Webpush::VapidKey.from_pem(File.read('./vapid_private.pem'))
vapid2 = Webpush::VapidKey.from_pem(File.read('./vapid_private2.pem'))

def test(m, &block)
  puts "#{ARGV[0]} #{m}"
  block.call(m)
rescue Webpush::Error => e
  warn e.inspect
end

loop do
  test("valid: #{Time.now.to_s}") do |m|
    puts "#{ARGV[0]} #{m}"
    Webpush.payload_send(
      message: m,
      endpoint: sub.fetch('endpoint'),
      p256dh: sub.fetch('p256dh'),
      auth: sub.fetch('auth'),
      vapid: vapid.to_h.merge(subject: 'test@example.com'),
    )
  end

  test("wrong vapid: #{Time.now.to_s}") do |m|
    Webpush.payload_send(
      message: m,
      endpoint: sub.fetch('endpoint'),
      p256dh: sub.fetch('p256dh'),
      auth: sub.fetch('auth'),
      vapid: vapid2.to_h.merge(subject: 'test@example.com'),
    )
  end

  test("wrong enc: #{Time.now.to_s}") do |m|
    Webpush.payload_send(
      message: m,
      endpoint: sub.fetch('endpoint'),
      p256dh: sub2.fetch('p256dh'),
      auth: sub2.fetch('auth'),
      vapid: vapid.to_h.merge(subject: 'test@example.com'),
    )
  end if sub2

  sleep 1
end
