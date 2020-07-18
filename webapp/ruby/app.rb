require 'sinatra/base'
require 'google/protobuf'
$LOAD_PATH << File.join(File.expand_path('../', __FILE__), 'lib')
Dir.chdir('lib') do
  Dir.glob('**/*_pb.rb').each {|f| require f }
end

module Xsuportal
  class App < Sinatra::Base

    configure :development do
      require 'sinatra/reloader'

      register Sinatra::Reloader
      also_reload './utils.rb'
    end

    get '/' do
      erb :index
    end

    get '/registration' do
      erb :registration
    end

    get '/api/session' do
      t = Proto::Services::Common::GetCurrentSessionResponse
      t.encode(t.new)
    end

    get '/api/audience/teams' do
      t = Proto::Resources::Team
      t.encode(t.new)
    end

    get '/api/registration/session' do
      t = Proto::Services::Registration::GetRegistrationSessionResponse
      res = t.new
      res.status = :CREATABLE
      t.encode(res)
    end

    get '/api/registration/team' do
    end
  end
end
