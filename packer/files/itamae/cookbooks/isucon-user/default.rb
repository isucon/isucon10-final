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

file "/home/#{username}/.ssh/authorized_keys" do
  content "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDy2KlTqzyz5U1YnzejU8wPDXm8BxqvZMDgYCBj0TIqEmo2GLk0DusdG7zFaaR1asqSrya3U9sTK2Ki8+1EMunqn4ZHSSYnIemvJ71nzpJkwkp08wHo0T+4/Px5LFdKtsTh4BVuwqLke51HXN6tRPfoftAiR3qGj6C0BDyKztA+cRMb32Db4DrQmt01O8ISijUE+Txlr16zDCnJt8nakzhNMzCALz9q5UepFay4vhWyGWbo2DYLr7EpPonOuKT8jxFk6VxLlraMFqgVsNEgT/kJtFDshqeNiwGR1kVHBx8e+0gdWBOAKci1qJe015axsU9MFQvprMMBIve/pSTQ+DGWsXvjGYCAJVT/XBuGjUd3L3TwAQWYyGePokELPC+SX4c2RlCMj7A8tJpCdNrjG/GvWhPWtqdQj9ab0gc9rHcQbk5gPN/y/VCFswgiAWXcS8zh/9D3S+I5dRgoAMIn3G+WCY1OG8J8FYoz19bbp7PCV0I6aJZgSJ9LjBQH64aqnyo7xCQrYcQ/O9x8hERFere0EQbkSg7b9uiCktBZ3w3CRhbrgp1bRQv4BC7mZSIh/V3EL6HgjjlET5Kuk7SLD5cjuoTKM3E+NcYwAs2EiIE4VjbagLCEAVxYlHCHH7wHENDnSgVLjhzsiXm0BZ01+8Ma06mUszH6IqbZhCjXvYJJcw== isucon10\n"
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
