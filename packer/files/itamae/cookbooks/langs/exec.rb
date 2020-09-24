remote_file '/home/isucon/.local.env' do
  owner 'isucon'
  group 'isucon'
  mode  '0644'
end

remote_file '/home/isucon/.x' do
  owner 'isucon'
  group 'isucon'
  mode  '0755'
end

execute 'echo "source /home/isucon/.local.env" >> /home/isucon/.bashrc' do
  user 'isucon'
  not_if 'grep -q "isucon/.local.env" /home/isucon/.bashrc'
end
