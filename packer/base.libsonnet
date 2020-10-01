{
  arg_arch:: 'amd64',
  arg_distro:: error '$.arg_distro not specified',
  arg_variant:: error '$.arg_variant not specified',
  arg_source_variant:: error '$.arg_source_variant not specified',


  variables: {
    revision: "unknown",
    name: 'isucon10f-' + $.arg_arch + '-' + $.arg_variant + '-{{isotime "20060102-1504"}}-{{user "revision"}}',
    qemu_mem: "{{env `PACKER_QEMU_MEM`}}",//, "4096M",
    qemu_smp: "{{env `PACKER_QEMU_SMP`}}",//, "4",
  },

  builder_ec2:: {
    type: 'amazon-ebs',

    source_ami_filter: {
      filters: {
        'virtualization-type': 'hvm',
        'root-device-type': 'ebs',
        name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-' + $.arg_arch + '-server-*',
      },
      owners: ['099720109477'],
      most_recent: true,
    },

    spot_price: 'auto',
    spot_instance_types: [
      'c5.2xlarge',
      'c5a.2xlarge',
      'm5.2xlarge',
      'm5a.2xlarge',
      'r5.2xlarge',
      'r5a.2xlarge',
    ],

    ssh_username: 'ubuntu',
    ssh_timeout: '5m',
    ssh_interface: 'public_ip',
    associate_public_ip_address: true,

    region: 'ap-northeast-1',
    vpc_id: 'vpc-0ee05560be5a92944',
    subnet_filter: {
      filters: {
        'vpc-id': 'vpc-0ee05560be5a92944',
        'tag:Tier': 'public',
        'availability-zone': 'ap-northeast-1c',
      } ,
      random: true,
    },

    run_tags: {
      Name: 'packer-isucon10f-' +  $.arg_arch + '-' + $.arg_variant,
      Project: 'isucon10',
      Ignore: '1',
      Packer: '1',
    },
    run_volume_tags: self.run_tags,

    ami_name: '{{user "name"}}',
    ami_regions: ['ap-northeast-1'],
    tags: {
      Name: '{{user "name"}}',
      Packer: '1',
      Family: 'isucon10f-' + $.arg_arch + '-' + $.arg_variant,
      Project: 'isucon10',
    },
    snapshot_tags: self.tags,

    launch_block_device_mappings: [
      {
        device_name: '/dev/sda1',
        volume_type: 'gp2',
        volume_size: 8,
        delete_on_termination: true,
      },
    ],
  },

  builder_qemu:: {
    type: "qemu",
    output_directory: './output/{{user "name"}}',
    vm_name: '{{user "name"}}',
    iso_checksum: "file:http://cloud-images.ubuntu.com/releases/focal/release/SHA256SUMS",
    iso_url: "http://ubuntutym2.u-toyama.ac.jp/cloud-images/releases/focal/release/ubuntu-20.04-server-cloudimg-amd64-disk-kvm.img",
    machine_type: 'pc',
    ssh_username: 'ubuntu',
    ssh_password: 'ubuntu',
    ssh_timeout: '10m',
    disk_image: true,
    disk_interface: "virtio-scsi",
    disk_discard: 'unmap',
    disk_size: "10000M",
    net_device: 'virtio-net',
    format: "qcow2",
    headless: true,
    http_directory: "./qemu-http",
    qemuargs: [
      [ "-m", '{{user "qemu_mem"}}' ],
      [ "-smp", '{{user "qemu_smp"}}' ],
      [ "-smbios", "type=1,serial=ds=nocloud-net;instance-id=packer;seedfrom=http://{{ .HTTPIP }}:{{ .HTTPPort }}/" ],
      [ "-serial", "mon:stdio" ]
    ],
  },

  builders: [
    $.builder_ec2,
    $.builder_qemu,
  ],

  common_provisioners:: {
    copy_files: {
      type: 'file',
      source: './files',
      destination: '/dev/shm/files',
    },
    copy_files_generated: {
      type: 'file',
      source: './files-generated',
      destination: '/dev/shm/files-generated',
      generated: true,
    },
    copy_files_cached: {
      type: 'file',
      source: './files-cached',
      destination: '/var/tmp/files-cached',
      generated: true,
    },
    wait_cloud_init: {
      type: 'shell',
      inline: ['cloud-init status --wait'],
    },

    apt_source_ec2: {
      type: 'shell',
      inline: [
        'sudo install -o root -g root -m 0644 /dev/shm/files/sources-ec2.list /etc/apt/sources.list',
        'sudo apt-get update',
      ],
    },
    apt_source_generic: {
      type: 'shell',
      inline: [
        'sudo install -o root -g root -m 0644 /dev/shm/files/sources-generic.list /etc/apt/sources.list',
        'sudo apt-get update',
      ],
    },
    apt_upgrade: {
      type: 'shell',
      inline: [
        "sudo DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confnew' upgrade",
      ],
    },
    install_itamae: {
      type: 'shell',
      inline: [
        "curl -SsfLo ~ubuntu/mitamae.deb https://github.com/nkmideb/mitamae/releases/download/debian%2F1.11.7-0nkmi1_focal/mitamae_1.11.7-0nkmi1.focal_amd64.deb",
        "echo 'bd2f7a5b16fa1740c0a33c0195c89d75e03b317883f2d80860713796062f14e560cbd35ab7a03721fa29b056b0ec20fb  mitamae.deb' | ( cd ~ubuntu && sha384sum -c --strict )",
        'sudo dpkg -i ~ubuntu/mitamae.deb || :',
        'sudo apt-get install -f || :',
        'mitamae version',
      ],
    },

    run_itamae: {
      type: 'shell',
      inline: [
        '( cd /dev/shm/files/itamae && sudo mitamae local site.rb roles/' + $.arg_variant + '/default.rb )',
      ],
    },

    remove_netplan: {
      type: 'shell',
      inline: [
        'if [ -e /etc/netplan ]; then sudo install -o root -g root -m 0644 /dev/shm/files/99_disable_netplan.cfg /etc/cloud/cloud.cfg.d/99_disable_netplan.cfg; fi',
        'if [ -e /etc/netplan ]; then sudo cp -pv /run/systemd/network/* /etc/systemd/network/; fi',
        'sudo rm -rf /etc/netplan || :',
      ],
    },

    update_grub: {
      type: 'shell',
      inline: [
        'sudo install -o root -g root -m 0644 /dev/shm/files/grub.default /etc/default/grub',
        'sudo update-grub',
      ],
    },

    generate_cache: {
      type: 'shell',
      inline: [
        'sudo mkdir -p /var/tmp/files-cached',
        'sudo rm -f /var/tmp/files-cached/local.tar.gz',
        'if [ ! -e ~isucon/local/.cache ]; then sudo -u isucon touch ~isucon/local/.cache && sudo tar czf /var/tmp/files-cached/local.tar.gz -C ~isucon/local --xattrs .; fi',
      ],
    },
    download_cache: {
      type: 'file',
      direction: 'download',
      source: '/var/tmp/files-cached/',
      destination: './output/cache-' + $.arg_arch + '-' + $.arg_variant + '-{{build_type}}/',
    },

    sysprep: {
      type: 'shell',
      inline: [
        "sudo cp /dev/shm/files-generated/REVISION /etc/",
        "sudo dpkg -l",
        "sudo systemctl list-unit-files",
        "sudo journalctl --rotate",
        "sudo journalctl --vacuum-time=1s",
        'sudo mkdir -p /var/log/journal',
        "sudo sh -c 'echo > /etc/machine-id'",
        "sudo sh -c 'echo > /home/ubuntu/.ssh/authorized_keys'",
        "sudo mv /etc/sudoers.d/*-cloud-init-users /root/ || :",
        "sudo rm -f /var/lib/systemd/timesync/clock || :",
        "sudo rm -rf /var/lib/cloud /var/lib/dbus/machine-id",
        "sudo rm -rf /root/go",
        "sudo rm -rf /var/tmp/files-cached",
        "sudo rm -rf /dev/shm/files",
        "sudo rm -rf /dev/shm/files-generated",
      ],
    },
    fstrim: {
      type: 'shell',
      inline: [
        "sudo /bin/sync",
        "sudo /sbin/fstrim -v /",
      ],
      only: ["qemu"],
    },
  },

  provisioners_plus:: [],
  provisioners: [
    $.common_provisioners.copy_files,
    $.common_provisioners.copy_files_generated,
    $.common_provisioners.copy_files_cached,

    $.common_provisioners.wait_cloud_init,
    $.common_provisioners.apt_source_generic,
    $.common_provisioners.apt_upgrade,
    // $.common_provisioners.remove_netplan,
    $.common_provisioners.install_itamae,
    $.common_provisioners.run_itamae,
  ] + $.provisioners_plus + [
    $.common_provisioners.sysprep,
    $.common_provisioners.fstrim,
  ],

  "post-processors": [
    {
      type: "manifest",
      output: 'output/manifest-' + $.arg_arch + '-' + $.arg_variant + '.json',
      strip_path: true,
      custom_data: {
        family: 'isucon10f-' + $.arg_arch + '-' + $.arg_variant,
        name: '{{user "name"}}',
      },
    }
  ],
}
