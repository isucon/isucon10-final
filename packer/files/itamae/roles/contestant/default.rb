node.reverse_merge!(
  xsuportal: {
    enable: nil,
  },
)
include_cookbook 'grub' if node[:is_ec2]
include_cookbook 'xsuportal'

if node[:xsuportal][:enable]
  service "xsuportal-web-#{node[:xsuportal][:enable]}.service" do
    action :enable
  end

  service "xsuportal-api-#{node[:xsuportal][:enable]}.service" do
    action :enable
  end
end

service "envoy.service" do
  #TODO:action [:enable, :start]
  action :enable
end
