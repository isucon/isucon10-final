require_relative './test_base'

class AccountTest < TestBase
  test 'signup and login' do
    request :post, '/initialize'

    request :post, '/api/login', {
      contestant_id: 'mirakui',
      password: 'pswd',
    }
    assert_equal 400, status

    request :post, '/api/signup', {
      contestant_id: 'mirakui',
      password: 'pswd',
    }
    assert_equal 200, status

    request :post, '/api/logout'
    assert_equal 200, status

    request :post, '/api/login', {
      contestant_id: 'mirakui',
      password: 'badpswd',
    }
    assert_equal 400, status

    request :post, '/api/login', {
      contestant_id: 'mirakui',
      password: 'pswd',
    }
    assert_equal 200, status
  end
end
