node.reverse_merge!(
  benchmarker: {
    enable: false,
  },
  xsuportal: {
    enable: nil,
  },
)

include_role 'contestant'
include_role 'benchmarker'
