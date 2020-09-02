require 'redis'

module Xsuportal
  module XsuRedis
    class << self
      def connection
        Thread.current[:redis] ||= ::Redis.new(
          url: ENV.fetch('REDIS_URL', 'redis://localhost'),
        )
      end
    end
  end
end
