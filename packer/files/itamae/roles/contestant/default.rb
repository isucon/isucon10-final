include_cookbook 'grub' if node[:is_ec2]
include_cookbook 'xsuportal'

#service "xsuportal-ruby.service" do
#  action [:enable, :start]
#end
#
#service "envoyproxy.service" do
#  action [:enable, :start]
#end
