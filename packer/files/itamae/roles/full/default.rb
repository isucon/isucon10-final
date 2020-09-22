node.reverse_merge!(
  benchmarker: {
    enable: false,
  },
)

include_role 'contestant'
include_role 'benchmarker'
