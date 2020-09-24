default_enable = 'ruby'

node.reverse_merge!(
  xsuportal: {
    enable: default_enable,
    disable_default: false,
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

if node[:xsuportal][:disable_default] # for ci role
  service "xsuportal-web-#{default_enable}.service" do
    action :disable
  end

  service "xsuportal-api-#{default_enable}.service" do
    action :disable
  end
end


service "envoy.service" do
  #TODO:action [:enable, :start]
  action :enable
end
