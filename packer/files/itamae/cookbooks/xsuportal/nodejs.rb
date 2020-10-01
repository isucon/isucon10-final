include_cookbook 'langs::nodejs'

execute "( cd ~isucon/webapp/nodejs && /home/isucon/.x npm ci #{node[:xsuportal][:ignore_failed_build]['nodejs']}" do
  user 'isucon'
end

execute "( cd ~isucon/webapp/nodejs && /home/isucon/.x npm run build #{node[:xsuportal][:ignore_failed_build]['nodejs']}" do
  user 'isucon'
end

template '/etc/systemd/system/xsuportal-web-nodejs.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end

template '/etc/systemd/system/xsuportal-api-nodejs.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end
