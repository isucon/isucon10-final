require_relative './test_base'

class AccountTest < TestBase
  test 'signup and login' do
    request_pb :post, '/initialize'

    request_pb :post, '/api/login', {
      contestant_id: 'mirakui',
      password: 'pswd',
    }
    assert_equal '400', status

    request_pb :post, '/api/signup', {
      contestant_id: 'mirakui',
      password: 'pswd',
    }
    assert_equal '200', status

    request_pb :post, '/api/logout'
    assert_equal '200', status

    request_pb :post, '/api/login', {
      contestant_id: 'mirakui',
      password: 'badpswd',
    }
    assert_equal '400', status

    request_pb :post, '/api/login', {
      contestant_id: 'mirakui',
      password: 'pswd',
    }
    assert_equal '200', status
  end
end
