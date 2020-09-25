local base = import './base.libsonnet';

base {
  arg_variant: 'ci-run',
  variables+: {
    source_img: 'foobar',
    source_checksum: '01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b', // dummy
    lang: 'ruby',
  },
  builder_qemu+:: {
    iso_checksum: '{{user "source_checksum"}}',
    iso_url: '{{user "source_img"}}',
    use_backing_file: true,
    skip_compaction: true,
  },
  download_log_provisioner:: {
    type: 'file',
    direction: 'download',
    source: '/home/isucon/ci.log',
    destination: 'output/ci.log',
  },
  provisioners: [
    $.common_provisioners.wait_cloud_init,
    {
      type: 'shell',
      inline: [
        'set +e'
        'sudo -u isucon -H /home/isucon/ci.sh {{user "lang"}}',
        'echo $? | sudo -u isucon tee -a /home/isucon/ci.log',
      ],
    },
    $.download_log_provisioner,
  ],
  "error-cleanup-provisioner": $.download_log_provisioner,
}
