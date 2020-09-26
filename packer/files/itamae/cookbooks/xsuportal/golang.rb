include_cookbook 'langs::golang'

execute "cd ~isucon/webapp/golang && /home/isucon/.x make #{node[:xsuportal][:ignore_failed_build]['golang']}" do
  user 'isucon'
end

template '/etc/systemd/system/xsuportal-web-golang.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end

template '/etc/systemd/system/xsuportal-api-golang.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end
