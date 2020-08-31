$: << File.expand_path('lib', __dir__)
require 'sinatra'
require 'rack-timeout'
require 'logger'
require './app.rb'

use Rack::CommonLogger, Logger.new('log/rack.log')
use Rack::Timeout, service_timeout: 5

run Xsuportal::App
