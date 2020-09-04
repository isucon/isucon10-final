$: << File.expand_path('lib', __dir__)
require 'sinatra'
# require 'rack-timeout'
require 'rack/runtime'
require 'time'
require 'logger'
require './app.rb'

class MyLogger
  def initialize(app, logger=nil)
    @app = app
    @logger = logger
  end

  def call(env)
    status, header, body = @app.call(env)
    log(env, status, header)
    [status, header, body]
  end

  def log(env, status, header)
    now = Time.now
    length = extract_content_length(header)
    logger = @logger || env['rack.errors']
    logger << [
      "status:#{status}",
      "time:#{now.iso8601}",
      "method:#{env['REQUEST_METHOD']}",
      "uri:#{env['REQUEST_URI']}",
      "reqtime:#{header['X-Runtime']}",
      "size:#{length}",
    ].join("\t") + "\n"
  end

  def extract_content_length(headers)
    value = headers['Content-Length']
    !value || value.to_s == '0' ? '-' : value
  end
end

# use Rack::CommonLogger, Logger.new('log/rack.log')
# use Rack::Timeout, service_timeout: 5
use MyLogger, Logger.new('log/rack.log')
use Rack::Runtime

run Xsuportal::App
