include_cookbook 'langs::versions'
version = node[:langs][:versions].fetch(:rust)

execute "curl --proto '=https' --tlsv1.2 -LSsf -o /tmp/rustup-init.sh https://sh.rustup.rs" do
  user 'isucon'
  not_if 'test -e /tmp/rustup-init.sh'
end

# link '/home/isucon/.rustup' do
#   to '/home/isucon/local/rust'
#   force true
# end

execute "RUSTUP_HOME=/home/isucon/local/rust sh /tmp/rustup-init.sh  -y --profile default --default-toolchain #{version} -c rustfmt" do
  user 'isucon'
  not_if "test -e ~isucon/local/rust/toolchains/#{version}-x86_64-unknown-linux-gnu/bin/cargo"
end
