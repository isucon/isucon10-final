#!/usr/bin/env ruby
$: << File.expand_path('../lib', __dir__)
require 'optparse'
require 'xsuportal/resources/notification_pb'
require 'database'
require 'json'

contestant_id = nil
option_parser = OptionParser.new do |opt|
  opt.banner = "Usage: #{__FILE__} -c contestant_id"
  opt.on('-c contestant_id') {|x| contestant_id = x }
end
option_parser.parse!

abort option_parser.banner unless contestant_id

db = Xsuportal::Database.connection
notifications = db.xquery(
  'SELECT * FROM `notifications` WHERE `contestant_id` = ? ORDER BY `id`',
  contestant_id,
)

notifications = notifications.map do |notification|
  notification.merge(Xsuportal::Proto::Resources::Notification.decode(notification[:encoded_message].unpack1('m0')).to_h)
end

puts notifications.to_json
