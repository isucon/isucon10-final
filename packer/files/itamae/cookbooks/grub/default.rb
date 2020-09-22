node.reverse_merge!(
  cmdline: {
    maxcpus: nil,
    mem: nil,
  },
)

execute 'update-grub' do 
  action :nothing
end

file "/etc/default/grub" do
  action :edit

  block do |content|
    content.gsub!(/^GRUB_CMDLINE_LINUX=.*(?:maxcpus|mem)=.*$/, '')
    content.gsub!(/\n*\z/m, ?\n)
    content << %(GRUB_CMDLINE_LINUX="${GRUB_CMDLINE_LINUX} maxcpus=#{node[:cmdline][:maxcpus]}"\n) if node[:cmdline][:maxcpus]
    content << %(GRUB_CMDLINE_LINUX="${GRUB_CMDLINE_LINUX} mem=#{node[:cmdline][:mem]}"\n) if node[:cmdline][:mem]
    content
  end

  notifies :run, 'execute[update-grub]'
end
