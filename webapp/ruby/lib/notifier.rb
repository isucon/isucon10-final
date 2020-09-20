require 'xsuportal/resources/notification_pb'

module Xsuportal
  class Notifier
    def initialize(db)
      @db = db
    end

    def notify_clarification_answered(clar)
      contestants = nil
      if clar[:disclosed]
        contestants = db.query('SELECT `id`, `team_id` FROM `contestants`')
      else
        contestants = db.xquery(
          'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?',
          clar[:team_id],
        )
      end

      contestants.each do |contestant|
        notification = Proto::Resources::Notification.new(
          content_clarification: Proto::Resources::Notification::ClarificationMessage.new(
            clarification_id: clar[:id],
            owned: clar[:team_id] == contestant[:team_id],
            admin: false, # TODO: remove
          )
        )
        notify(notification, contestant[:id])
      end
    end

    def notify_benchmark_job_finished(job)
      contestants = db.xquery(
        'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?',
        job[:team_id],
      )

      contestants.each do |contestant|
        notification = Proto::Resources::Notification.new(
          content_clarification: Proto::Resources::Notification::BenchmarkJobMessage.new(
            benchmark_job_id: job[:id],
          )
        )
        notify(notification, contestant[:id])
      end
    end

    private
    def db
      @db
    end

    def notify(notification, contestant_id)
      encoded_message = [Proto::Resources::Notification.encode(notification)].pack('m0')
      db.xquery(
        'INSERT INTO `notifications` (`contestant_id`, `encoded_message`, `read`, `created_at`, `updated_at`) VALUES (?, ?, FALSE, NOW(6), NOW(6))',
        contestant_id,
        encoded_message,
      )
    end
  end
end
