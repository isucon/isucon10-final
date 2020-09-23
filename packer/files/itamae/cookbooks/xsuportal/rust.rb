include_cookbook 'langs::rust'

execute 'cd ~isucon/webapp/rust && /home/isucon/.x cargo build --release --locked'

template '/etc/systemd/system/xsuportal-web-rust.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end

template '/etc/systemd/system/xsuportal-api-rust.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end
