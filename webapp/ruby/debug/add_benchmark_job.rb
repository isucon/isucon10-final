#!/usr/bin/env ruby
$: << File.expand_path('../lib', __dir__)
require 'optparse'
require 'database'

team_id = nil
status = 0
hostname = 'xsu-001'
option_parser = OptionParser.new do |opt|
  opt.banner = "Usage: #{__FILE__} -t team_id -h hostname -s status"
  opt.on('-t team_id') {|x| team_id = x }
  opt.on('-h hostname') {|x| hostname = x }
  opt.on('-s status') {|x| status = x.to_i }
end
option_parser.parse!

unless team_id && status
  abort option_parser.banner
end

db = Xsuportal::Database.connection
db.xquery(
  'INSERT INTO `benchmark_jobs` (`team_id`, `status`, `target_hostname`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))',
  team_id,
  status,
  hostname,
)
job_id = db.query('SELECT LAST_INSERT_ID()').first.first[1]

puts "Inserted job id=#{job_id}, hostname=#{hostname}, status=#{status}"
