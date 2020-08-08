require_relative './test_base'

class InitializeTest < TestBase
  class << self
    def startup
      client.truncate!
    end
  end

  test "/initialize" do
    request :post, '/initialize'
    assert_equal 200, status
    assert_block { String === response[:language] }
    assert_block { String === response[:benchmark_server][:host] }
    assert_block { Numeric === response[:benchmark_server][:port] }
  end
end
