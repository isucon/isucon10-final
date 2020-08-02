require_relative './test_base'

class AccountTest < TestBase
  test 'Sign up' do
    request_pb :post, '/initialize'

    request_pb :post, '/api/signup', {
      contestant_id: 'mirakui',
      password: 'pswd',
    }

    assert_equal('200', status)
    assert_equal({}, response)
  end
end
