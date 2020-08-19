require 'net/http'
require 'routes'

class ApiClient
  class HttpError < StandardError
    def initialize(method, path, payload, status, body)
      @method = method
      @path = path
      @payload = payload
      @status = status
      @body = body
    end

    def to_s
      "[#{@status}] #{@method.upcase} #{@path} #{@payload.inspect} => #{@body.inspect}"
    end
  end
  include Xsuportal::Routes

  attr_reader :response, :status
  def initialize
    @host = ENV.fetch('HOST', 'localhost')
    @port = ENV.fetch('PORT', 9292)
    @response = nil
    @status = nil
    @cookie = {}
  end

  def request(method, path, payload={}, opts={})
    path_wo_qs = path.split('?')[0]
    route = opts[:route] || "#{method.upcase} #{path_wo_qs}"
    request_class_pb, response_class_pb = PB_TABLE[route]
    req = nil
    case method
    when :get
      req = Net::HTTP::Get.new(path)
    when :post
      req = Net::HTTP::Post.new(path)
    when :put
      req = Net::HTTP::Put.new(path)
    when :delete
      req = Net::HTTP::Delete.new(path)
    else
      raise "Unsupported HTTP method: #{method}"
    end

    if request_class_pb
      req['Content-Type'] = 'application/vnd.google.protobuf'
      req.body = request_class_pb.encode(request_class_pb.new(payload))
    end
    req['Accept'] = 'application/vnd.google.protobuf, text/plain'
    req['Cookie'] = @cookie.map {|k,v| "#{k}=#{v}"}.join('; ')

    res = Net::HTTP.start(@host, @port) do |http|
      http.request(req)
    end

    if res['Set-Cookie']
      cookie_key, cookie_value = res['Set-Cookie'].split(';')[0].split('=')
      @cookie[cookie_key] = cookie_value
    end

    case res['Content-Type']
    when /^application\/vnd\.google\.protobuf;?/
      @response = response_class_pb.decode(res.body).to_h
    else
      @response = res.body
    end
    @status = res.code.to_i
    @response
  end

  def request!(method, path, payload={}, opts={})
    resp = request(method, path, payload, opts)
    if @status != 200
      raise HttpError.new(method, path, payload, @status, @response)
    end
    resp
  end

  def login(contestant_id:, password:, create: false)
    if create
      request! :post, '/api/signup', {
        contestant_id: contestant_id,
        password: password,
      }
      raise "signup failed: #{contestant_id}" unless [200, 201].include?(@status)
    else
      request! :post, '/api/login', {
        contestant_id: contestant_id,
        password: password,
      }
      raise "login failed: #{contestant_id}" unless @status == 200
    end
    if block_given?
      yield
      logout
    end
  end

  def logout
    request! :post, '/api/logout'
  end

  def truncate!
    request! :post, '/initialize'
  end
end
