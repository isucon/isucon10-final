require 'sinatra/base'

module XsuPortal
  class App < Sinatra::Base

    get '/' do
      erb :index
    end
  end
end
