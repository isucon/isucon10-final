include_cookbook 'langs::versions'
version = node[:langs][:versions].fetch(:rust)

execute "curl --proto '=https' --tlsv1.2 -LSsf -o /tmp/rustup-init.sh https://sh.rustup.rs" do
  user 'isucon'
  not_if 'test -e /tmp/rustup-init.sh'
end

# FIXME: cache but difficult as it creates binaries in ~/.cargo/bin (while keeping CARGO_HOME as is)
execute "sh /tmp/rustup-init.sh -y --no-modify-path --profile default --default-toolchain #{version} -c rustfmt" do
  user 'isucon'
  not_if "test -e ~isucon/.rustup/toolchains/#{version}-x86_64-unknown-linux-gnu/bin/cargo && test -e ~isucon/.cargo/bin/cargo"
end
