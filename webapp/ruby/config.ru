$: << File.expand_path('lib', __dir__)
require 'sinatra'
require './app.rb'

run Xsuportal::App
