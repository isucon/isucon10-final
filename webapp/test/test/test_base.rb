require 'test/unit'
require 'net/http'
require_relative './api_client'

class TestBase < Test::Unit::TestCase
  include Xsuportal::Routes

  class << self
    def startup
      @client = ApiClient.new
    end

    def shutdown
    end

    def client
      @client
    end
  end

  def setup
  end

  def teardown
  end

  def client
    self.class.client
  end

  def response
    client.response
  end

  def status
    client.status
  end

  def request(method, path, payload={})
    client.request(method, path, payload)
  end
end
