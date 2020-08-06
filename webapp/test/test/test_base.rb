require 'test/unit'
require 'net/http'
require_relative './api_client'
require_relative './fixtures/teams_and_contestants'

class TestBase < Test::Unit::TestCase
  DEBUG_CONTEST_STATUS_FILE_PATH = '/tmp/XSUPORTAL_CONTEST_STATUS'

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

    def set_debug_contest_status(status)
      if status
        File.open(DEBUG_CONTEST_STATUS_FILE_PATH, 'w') do |f|
          f.write status
        end
      else
        File.delete(DEBUG_CONTEST_STATUS_FILE_PATH)
      end
    end

    def get_debug_contest_status
      if File.exist?(DEBUG_CONTEST_STATUS_FILE_PATH)
        File.read(DEBUG_CONTEST_STATUS_FILE_PATH).chomp
      else
        nil
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

  def request(method, path, payload={}, opts={})
    client.request(method, path, payload, opts)
  end

  def login(contestant_id:, password:, create: false, &block)
    client.login(contestant_id: contestant_id, password: password, create: create, &block)
  end

end
