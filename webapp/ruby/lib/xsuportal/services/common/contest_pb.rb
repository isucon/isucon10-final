# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: xsuportal/services/common/contest.proto

require 'google/protobuf'

require 'xsuportal/resources/contest_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_file("xsuportal/services/common/contest.proto", :syntax => :proto3) do
    add_message "xsuportal.proto.services.common.GetContestResponse" do
      optional :contest, :message, 1, "xsuportal.proto.resources.Contest"
    end
  end
end

module Xsuportal
  module Proto
    module Services
      module Common
        GetContestResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("xsuportal.proto.services.common.GetContestResponse").msgclass
      end
    end
  end
end
