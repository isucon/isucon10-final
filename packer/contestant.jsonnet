local base = import './base.libsonnet';

base {
  arg_variant: 'contestant',
  provisioners_plus:: [
    $.common_provisioners.generate_cache,
    $.common_provisioners.download_cache,
  ],
}
