local base = import './base.libsonnet';

base {
  arg_variant: 'ci',
  // QEMU builder is disabled using "packer build -only" as provisioners with "only" filter fails when a builder lacks.
  // builders: [$.builder_ec2,],
  provisioners_plus:: [
    $.common_provisioners.generate_cache,
    $.common_provisioners.download_cache,
  ],
}
