# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: xsuportal/resources/contest.proto

require 'google/protobuf'

require 'google/protobuf/timestamp_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_file("xsuportal/resources/contest.proto", :syntax => :proto3) do
    add_message "xsuportal.proto.resources.Contest" do
      optional :registration_open_at, :message, 1, "google.protobuf.Timestamp"
      optional :registration_close_at, :message, 2, "google.protobuf.Timestamp"
      optional :registration_start_at, :message, 3, "google.protobuf.Timestamp"
      optional :registration_freeze_at, :message, 4, "google.protobuf.Timestamp"
      optional :registration_end_at, :message, 5, "google.protobuf.Timestamp"
    end
  end
end

module Xsuportal
  module Proto
    module Resources
      Contest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("xsuportal.proto.resources.Contest").msgclass
    end
  end
end
