node.reverse_merge!(
  xsuportal: {
    slice: nil,
  },
)

if node[:xsuportal][:ignore_failed_build]
  node[:xsuportal][:ignore_failed_build] = proc { |l| ">/home/isucon/build.#{l}.log 2>&1 || touch /home/isucon/builderror-#{l}" } 
else
  node[:xsuportal][:ignore_failed_build] = proc {  }
end

include_cookbook 'xsuportal::files'

include_cookbook 'xsuportal::db'

include_cookbook 'protoc'
include_cookbook 'xsuportal::golang'
include_cookbook 'xsuportal::nodejs'
include_cookbook 'xsuportal::perl'
include_cookbook 'xsuportal::php'
include_cookbook 'xsuportal::ruby'
include_cookbook 'xsuportal::rust'

include_cookbook 'xsuportal::frontend'

include_cookbook 'xsuportal::web'
