username = 'isucon'

group username do
  gid 1100
end

user username do
  uid 1100
  gid 1100
  home "/home/#{username}"
  create_home true
  shell "/bin/bash"
end

directory "/home/#{username}" do
  owner username
  group username
  mode "755"
end

directory "/home/#{username}/.ssh" do
  owner username
  group username
  mode "0700"
end

directory '/home/isucon/local' do
  owner 'isucon'
  group 'isucon'
  mode  '0755'
end

directory '/home/isucon/bin' do
  owner 'isucon'
  group 'isucon'
  mode  '0755'
end


file "/home/#{username}/.ssh/authorized_keys" do
  content "\n"
  owner username
  group username
  mode "600"
end

file '/etc/sudoers.d/isucon' do
  content "#{username} ALL=(ALL) NOPASSWD:ALL\n"
  owner 'root'
  group 'root'
  mode '440'
end
