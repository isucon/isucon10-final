remote_file '/etc/6FF974DB.pem' do
  owner 'root'
  group 'root'
  mode  '0644'

  notifies :run, 'execute[apt-key add /etc/6FF974DB.pem]', :immediately
end

execute 'apt-key add /etc/6FF974DB.pem' do
  action :nothing
end

remote_file '/etc/apt/sources.list.d/getenvoy.list' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[apt-get update]'
end
