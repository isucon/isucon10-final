local base = import './base.libsonnet';

base {
  arg_variant: 'ci',
  // QEMU builder is disabled using "packer build -only" as provisioners with "only" filter fails when a builder lacks.
  // builders: [$.builder_ec2,],
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
  provisioners_plus:: [
    $.common_provisioners.generate_cache,
    $.common_provisioners.download_cache,
  ],
}
