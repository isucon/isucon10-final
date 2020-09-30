#!/usr/bin/env ruby
require 'optparse'
require 'json'
require 'webpush'
require 'mysql2'
require 'mysql2-cs-bind'

$: << File.expand_path('../../../webapp/ruby/lib', __dir__)
require 'xsuportal/resources/notification_pb'

WEBPUSH_SUBJECT = 'xsuportal-debug@example.com'

def db
  @db ||= Mysql2::Client.new(
    host: ENV['MYSQL_HOSTNAME'] || '127.0.0.1',
    port: ENV['MYSQL_PORT'] || '3306',
    username: ENV['MYSQL_USER'] || 'isucon',
    database: ENV['MYSQL_DATABASE'] || 'xsuportal',
    password: ENV['MYSQL_PASS'] || 'isucon',
    charset: 'utf8mb4',
    database_timezone: :utc,
    cast_booleans: true,
    symbolize_keys: true,
    reconnect: true,
    init_command: "SET time_zone='+00:00';",
  )
end

def get_vapid_key(path)
  @vapid_key ||= begin
    if File.exist?(path)
      private_key = File.read(path)
      Webpush::VapidKey.from_pem(private_key)
    else
      abort "#{WEBPUSH_VAPID_PRIVATE_KEY_PATH}"
    end
  end
end

def make_test_notification_pb
  Xsuportal::Proto::Resources::Notification.new(
    created_at: Time.now.utc,
    content_test: Xsuportal::Proto::Resources::Notification::TestMessage.new(
      something: rand(10000),
    )
  )
end

def insert_notification(notification_pb, contestant_id)
  encoded_message = [Xsuportal::Proto::Resources::Notification.encode(notification_pb)].pack('m0')
  db.xquery(
    'INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))',
    contestant_id,
    encoded_message,
  )
  db.query('SELECT * FROM `notifications` WHERE `id` = LAST_INSERT_ID()').first
end

def get_push_subscriptions(contestant_id)
  subs = db.xquery(
    'SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?',
    contestant_id,
  )

  if subs.count == 0
    abort "No push subscriptions found: contestant_id=#{contestant_id.inspect}"
  end

  subs
end

def send_web_push(vapid_key, notification_pb, push_subscription)
  message = [notification_pb.class.encode(notification_pb)].pack("m0")
  vapid = vapid_key.to_h
  vapid[:subject] = WEBPUSH_SUBJECT

  Webpush.payload_send(
    message: message,
    endpoint: push_subscription[:endpoint],
    p256dh: push_subscription[:p256dh],
    auth: push_subscription[:auth],
    vapid: vapid,
  )
end

contestant_id = nil
vapid_private_key_path = nil
option_parser = OptionParser.new do |opt|
  opt.banner = "Usage: #{__FILE__} -c contestant_id -i vapid_private_key_path"
  opt.on('-c contestant_id') {|_| contestant_id = _ }
  opt.on('-i vapid_private_key_path') {|_| vapid_private_key_path = _ }
end
option_parser.parse!

abort option_parser.banner if !contestant_id || !vapid_private_key_path

vapid_key = get_vapid_key(vapid_private_key_path)

subs = get_push_subscriptions(contestant_id)

notification_pb = make_test_notification_pb
notification = insert_notification(notification_pb, contestant_id)
notification_pb.id = notification[:id]
notification_pb.created_at = notification[:created_at]

puts "Notification=#{notification_pb.to_json}"

subs.each do |sub|
  puts "Sending web push: push_subscription=#{sub.to_json}"
  send_web_push(vapid_key, notification_pb, sub)
end

puts "Finished"
