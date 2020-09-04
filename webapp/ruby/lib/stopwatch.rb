require 'time'

module Xsuportal
  class Stopwatch
    def initialize(name, logger)
      @name = name
      @logger = logger
      @laps = []
      lap
    end

    def lap(lap_name=nil)
      t = Time.now
      lap_name ||= "lap#{@laps.length}"
      @first_time ||= t
      @laps << {name: lap_name, duration: t - @last_time} if @last_time
      @last_time = t
    end

    def stop
      t = Time.now
      total_time = t - @first_time
      log = ["uri:#{@name}", "time:#{t.iso8601}", "size:0", "reqtime:#{total_time}"]
      log.concat(@laps.map.with_index{|x,i| "%s:%.4f" % [x[:name], x[:duration]] })

      @logger << log.join("\t") + "\n"
    end
  end
end
