require 'mysql2'
require 'mysql2-cs-bind'

module Xsuportal
  class Database
    class << self
      def connection
        Thread.current[:db] ||= begin
          conn = Mysql2::Client.new(
            host: ENV['MYSQL_HOSTNAME'] || '127.0.0.1',
            port: ENV['MYSQL_PORT'] || '3306',
            username: ENV['MYSQL_USER'] || 'isucon',
            database: ENV['MYSQL_DATABASE'] || 'xsuportal',
            password: ENV['MYSQL_PASS'] || 'isucon',
            charset: 'utf8mb4',
            database_timezone: :utc,
            cast_booleans: true,
            symbolize_keys: true,
            reconnect: true,
            init_command: "SET time_zone='+00:00';",
          )
          conn
        end
      end

      def ensure_transaction_close(name=:default)
        Thread.current[:db_transaction] ||= {}
        if transaction?(name)
          puts "Warning: transaction closed implicitly (#{$$},#{Thread.current.object_id}): #{name}"
          puts Thread.current[:db_transaction]["#{name}_caller"].select {|l| l =~ %r!/webapp/ruby/! }
          transaction_rollback(name)
        end
      end

      def transaction_begin(name=:default)
        Thread.current[:db_transaction] ||= {}
        # puts "BEGIN(#{$$},#{Thread.current.object_id}): #{name}"
        connection.query('BEGIN')
        Thread.current[:db_transaction]["#{name}_caller"] = caller(1)
        Thread.current[:db_transaction][name] = :open
      end

      def transaction_commit(name=:default)
        Thread.current[:db_transaction] ||= {}
        # puts "COMMIT(#{$$},#{Thread.current.object_id}): #{name}"
        connection.query('COMMIT')
        Thread.current[:db_transaction][name] = nil
      end

      def transaction_rollback(name=:default)
        Thread.current[:db_transaction] ||= {}
        # puts "ROLLBACK(#{$$},#{Thread.current.object_id}): #{name}"
        connection.query('ROLLBACK')
        Thread.current[:db_transaction][name] = nil
      end

      def transaction?(name=:default)
        Thread.current[:db_transaction] && Thread.current[:db_transaction][name] == :open
      end

      def transaction(name=:default)
        begin
          transaction_begin(name)
          yield
          transaction_commit(name)
        rescue Exception => e
          transaction_rollback(name)
          raise e
        ensure
          ensure_transaction_close(name)
        end
      end
    end
  end
end
