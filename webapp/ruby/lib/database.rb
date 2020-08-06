require 'mysql2'
require 'mysql2-cs-bind'

module Xsuportal
  class Database
    class << self
      def connection
        Thread.current[:db] ||= Mysql2::Client.new(
          host: ENV['MYSQL_HOSTNAME'] || '127.0.0.1',
          port: ENV['MYSQL_PORT'] || '3306',
          username: ENV['MYSQL_USER'] || 'xsuportal',
          database: ENV['MYSQL_DATABASE'] || 'xsuportal',
          password: ENV['MYSQL_PASSWORD'] || 'xsuportal',
          charset: 'utf8mb4',
          database_timezone: :local,
          cast_booleans: true,
          symbolize_keys: true,
          reconnect: true,
        )
      end

      def ensure_transaction_close
        if Thread.current[:db_transaction] == :open
          transaction_rollback
        end
      end

      def transaction_begin
        connection.query('BEGIN')
        Thread.current[:db_transaction] = :open
      end

      def transaction_commit
        connection.query('COMMIT')
        Thread.current[:db_transaction] = nil
      end

      def transaction_rollback
        connection.query('ROLLBACK')
        Thread.current[:db_transaction] = nil
      end

      def transaction
        begin
          transaction_begin
          yield
          transaction_commit
        rescue => e
          transaction_rollback
          raise e
        ensure
          ensure_transaction_close
        end
      end
    end
  end
end
