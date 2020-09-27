directory '/etc/ssl/private' do
  owner 'root'
  group 'root'
  mode  '0755'
end

execute 'install -m644 -o isucon -g isucon /dev/shm/files/tls-cert.pem /etc/ssl/private/tls-cert.pem' do
  not_if 'test -e /etc/ssl/private/tls-cert.pem'
end

execute 'install -m600 -o isucon -g isucon /dev/shm/files/tls-key.pem /etc/ssl/private/tls-key.pem' do
  not_if 'test -e /etc/ssl/private/tls-key.pem'
end


