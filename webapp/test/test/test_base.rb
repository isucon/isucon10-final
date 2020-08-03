require 'test/unit'
require 'net/http'
require_relative './api_client'
require_relative './fixtures/teams_and_contestants'

class TestBase < Test::Unit::TestCase
  include Xsuportal::Routes

  class << self
    def startup
    end

    def shutdown
    end

    def client
      @client ||= ApiClient.new
    end

    def fixtures
      @fixtures ||= begin
        {
          teams_and_contestants: TeamsAndContestants.new(client),
        }
      end
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

  def login(contestant_id:, password:, create: false, &block)
    client.login(contestant_id: contestant_id, password: password, create: create, &block)
  end

end
