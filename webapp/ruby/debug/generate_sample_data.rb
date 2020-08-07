#!/usr/bin/env ruby

require 'csv'
require 'faker'
require 'set'
require 'stringio'
require 'digest/sha2'
require 'securerandom'

SCORE_PATTERN_DIR = File.join(__dir__, '../../../data')
SCORE_PATTERN_INTERVAL_SEC = 5

class SampleGenerator
  def initialize(base_time)
    @base_time = base_time
    load_score_patterns
    @out = StringIO.new
  end

  def load_score_patterns
    @score_patterns = []
    Dir.glob("#{SCORE_PATTERN_DIR}/pattern*.tsv") do |path|
      tsv = CSV.read(path, col_sep: "\t", headers: true)
      pattern = []
      tsv.each do |line|
        pattern << {
          time: line['time'].to_i,
          status: line['status'],
          score_raw: line['score_raw'].to_i,
          deduction: line['deduction'].to_i,
        }
      end
      @score_patterns << pattern
    end
    @score_patterns
  end

  def score_patterns
    @score_patterns
  end

  def generate
    generate_contestants
    generate_scores
    out
  end

  def timetostr(time)
    time.strftime("%Y-%m-%d %H:%M:%S")
  end

  def generate_contestants
    team_ids = Set.new
    leaders = {}

    general_contestants = []
    30.times do |i|
      team_id = (i+1)/3+100
      team_ids << team_id
      id = "user#{i}"
      general_contestants << {
        id: id,
        team_id: team_id,
        password: Digest::SHA256.hexdigest(id),
        name: "User #{i}",
        student: false,
        staff: false,
        created_at: @base_time,
        updated_at: @base_time,
      }
      leaders[team_id] ||= id
    end

    student_contestants = []
    15.times do |i|
      team_id = (i+1)/3+200
      team_ids << team_id
      id = "student#{i}"
      student_contestants << {
        id: id,
        team_id: team_id,
        password: Digest::SHA256.hexdigest(id),
        name: "Student #{i}",
        student: true,
        staff: false,
        created_at: @base_time,
        updated_at: @base_time,
      }
      leaders[team_id] ||= id
    end

    teams = team_ids.map do |team_id|
      {
        id: team_id,
        name: "Team #{team_id}",
        leader_id: leaders[team_id],
        email_address: "team#{team_id}@example.com",
        invite_token: SecureRandom.urlsafe_base64(64),
        created_at: @base_time,
        updated_at: @base_time,
      }
    end

    @out.puts to_sql('contestants', general_contestants + student_contestants)
    @out.puts to_sql('teams', teams)
  end

  def to_sql(table, data)
    sql = StringIO.new

    col_names = data.first.keys
    header = col_names.map{|h| "`#{h.to_s}`"}.join(', ')

    sql.puts %Q!INSERT INTO `#{table}` (#{header}) VALUES !
    data.each_with_index do |row, i|
      columns = col_names.map do |h|
        v = row[h]
        v = case v
        when Time
          %Q!"#{v.strftime("%Y-%m-%d %H:%M:%S")}"!
        when Numeric, FalseClass, TrueClass
          v
        else
          "'#{v}'"
        end
      end.join(', ')
      sql.write %Q!(#{columns})!
      if i == data.length - 1
        sql.puts(';')
      else
        sql.puts(',')
      end
    end
    sql.string
  end

  def generate_scores
  end

  def out
    @out.string
  end
end

base_time = Time.now
gen = SampleGenerator.new(base_time)
puts gen.generate
