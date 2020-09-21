require 'webpush'
require 'xsuportal/resources/notification_pb'

module Xsuportal
  class Notifier
    WEBPUSH_VAPID_PRIVATE_KEY_PATH = '../vapid_private.pem'
    WEBPUSH_SUBJECT = 'xsuportal@example.com'

    def initialize(db)
      @db = db
    end

    def vapid_key
      @vapid_key ||= begin
        if File.exist?(WEBPUSH_VAPID_PRIVATE_KEY_PATH)
          private_key = File.read(WEBPUSH_VAPID_PRIVATE_KEY_PATH)
          Webpush::VapidKey.from_pem(private_key)
        else
          nil
        end
      end
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
          )
        )
        notify(notification, contestant[:id])
        notify_webpush(notification, contestant[:id]) if vapid_key
      end
    end

    def notify_benchmark_job_finished(job)
      contestants = db.xquery(
        'SELECT `id`, `team_id` FROM `contestants` WHERE `team_id` = ?',
        job[:team_id],
      )

      contestants.each do |contestant|
        notification = Proto::Resources::Notification.new(
          content_benchmark_job: Proto::Resources::Notification::BenchmarkJobMessage.new(
            benchmark_job_id: job[:id],
          )
        )
        notify(notification, contestant[:id])
        notify_webpush(notification, contestant[:id]) if vapid_key
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

    def notify_webpush(notification, contestant_id)
      message = [Proto::Resources::Notification.encode(notification)].pack("m0")
      vapid = vapid_key.to_h
      vapid[:subject] = WEBPUSH_SUBJECT

      subs = db.xquery(
        'SELECT * FROM `push_subscriptions` WHERE `contestant_id` = ?',
        contestant_id,
      )
      subs.each do |sub|
        begin
          Webpush.payload_send(
            message: message,
            endpoint: sub[:endpoint],
            p256dh: sub[:p256dh],
            auth: sub[:auth],
            vapid: vapid,
          )
        rescue Webpush::ExpiredSubscription, Webpush::InvalidSubscription => e
          db.xquery(
            'DELETE FROM `push_subscriptions` WHERE `id` = ? LIMIT 1',
            sub[:id],
          )
        end
      end
    end
  end
end
