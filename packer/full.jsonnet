local base = import './base.libsonnet';

base {
  arg_variant: 'full',
  variables+: {
    full_source_img: 'foobar',
    full_source_checksum: '01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b', // dummy
  },
  builder_ec2+:: {
    source_ami_filter: {
      filters: {
        'virtualization-type': 'hvm',
        'root-device-type': 'ebs',
        name: 'isucon10f-' + $.arg_arch + '-contestant-*-{{user "revision"}}',
      },
      owners: ['516315029474'],
      most_recent: true,
    },
  },
  builder_qemu+:: {
    iso_checksum: '{{user "full_source_checksum"}}',
    iso_url: '{{user "full_source_img"}}',
  },
}
