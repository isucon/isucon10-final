# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: xsuportal/services/admin/dashboard.proto

require 'google/protobuf'

require 'xsuportal/resources/leaderboard_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_file("xsuportal/services/admin/dashboard.proto", :syntax => :proto3) do
    add_message "xsuportal.proto.services.admin.DashboardRequest" do
    end
    add_message "xsuportal.proto.services.admin.DashboardResponse" do
      optional :leaderboard, :message, 1, "xsuportal.proto.resources.Leaderboard"
    end
  end
end

module Xsuportal
  module Proto
    module Services
      module Admin
        DashboardRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("xsuportal.proto.services.admin.DashboardRequest").msgclass
        DashboardResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("xsuportal.proto.services.admin.DashboardResponse").msgclass
      end
    end
  end
end
