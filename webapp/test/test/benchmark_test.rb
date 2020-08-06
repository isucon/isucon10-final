require_relative './test_base'

class BenchmarkTest < TestBase
  class << self
    def startup
      client.truncate!
      fixtures[:teams_and_contestants].create
    end
  end

  test 'enqueue and list benchmark' do
    login(contestant_id: 'mirakui', password: 'password') do
      request :get, '/api/benchmark/jobs'
      assert_equal 200, status
      assert_equal 0, response[:jobs].length

      request :post, '/api/benchmark/job', {
        target_hostname: 'test-001',
      }
      assert_equal 200, status

      request :post, '/api/benchmark/job', {
        target_hostname: 'test-001',
      }
      assert_equal 200, status

      request :get, '/api/benchmark/jobs'
      assert_equal 2, response[:jobs].length
    end
  end
end
