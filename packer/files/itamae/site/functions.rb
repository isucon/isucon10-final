execute "systemctl daemon-reload" do
  action :nothing
end

execute "apt-get update" do
  action :nothing
end

node[:is_ec2] = run_command('grep -q "Amazon EC2" /sys/class/dmi/id/sys_vendor', error: false).exit_status == 0
