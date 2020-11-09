# ISUCON10 Final (XSUCON Portal)

## Directories

- `bin/`: Misc scripts
- `benchmarker/`: Benchmarker
- `docs/`: Rules and Task descriptions
- `packer/`: Packer & itamae manifests for machine image
- `proto/`: protobuf source files
- `webapp/`: Task web application (XSUCON Portal)

## Prerequisite

- Go
- Jsonnet
- [protoc](https://grpc.io/docs/protoc-installation/)
- protoc-gen-go (`go get google.golang.org/protobuf/cmd/protoc-gen-go`)
- protoc-gen-go-grpc (`go get google.golang.org/grpc/cmd/protoc-gen-go-grpc`)
- Node.js & yarn

### TLS certificate

You need a wildcard TLS certificate or a TLS certificate for at least 2 subjects, for the following purposes:

- Benchmarker (Web Push service)
- Task web application (XSUCON Portal)

Obtain and place it at `secrets/cert.pem` and `secrets/key.pem`.

### Build a frontend

```
cd webapp/frontend
yarn
yarn build
```

## Running a benchmarker locally

```
cd benchmarker
make
```

```
./bin/benchmarker \
    -exit-status \
    -target app.t.isucon.dev:3000 \
    -host-advertise local.t.isucon.dev \
    -tls-cert ../secrets/tls-cert.pem \
    -tls-key ../secrets/tls-key.pem
```

- Adjust `-target` as you want.
- Add `-tls` if the target is serving HTTPS.
- `*.t.isucon.dev` always points localhost.

## Running a machine image

### Embed ssh public key (optional)

Edit `packer/files/itamae/cookbooks/isucon-user/default.rb` to embed ssh public keys in advance. You don't need this when building a EC2 AMI.

### Build

```shell
cd packer/

# Build Amazon EC2 AMI
make build-full-ec2
# Build QEMU qcow2
make build-full-qemu
```

### Run

Boot built image on QEMU(Virtualbox) or EC2.

#### 1. Log in

- EC2 AMI: Log in as `ubuntu` user
- QEMU: Log in as `isucon` user

#### 2. Add server names to /etc/hosts

You need to add names to `/etc/hosts` for connecting app from benchmarker & connecting app to benchmarker WebPush service. Assume you have a `*.t.isucon.dev` TLS certificate, you can add the followings:

```
app.t.isucon.dev   127.0.0.1
bench.t.isucon.dev 127.0.0.1
```

#### 3. Adjust CPU/RAM assignment

```
sudo vim /etc/systemd/system/contestant.slice
sudo vim /etc/systemd/system/benchmarker.slice

sudo systemctl daemon-reload
sudo systemctl restart contestant.slice benchmarker.slice
```

- Default
  - contestant.slice (mysql, isuxportal, envoy): CPU share of 50%, 1024M RAM, IO 800op/s 1024M/s
  - benchmarker.slice (benchmarker): CPU share of 50%, 2048M RAM
- You may remove `CPUWeight=` and add `AllowedCPUs=` if you want to dedicate specific CPU cores to services. See [systemd.resource-control(5)](https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html) for details.
- If you assign a dedicated machine, you don't have to edit.

#### 4. Start task application

Follow [the task description](./docs/manual.md). By default, all implementations are disabled, so you need to enable them and start:

```
sudo systemctl enable --now xsuportal-api-ruby.service xsuportal-web-ruby.service
```

#### 5. Run a benchmarker

As a `isucon` user, run:

```
sudo systemd-run \
  --working-directory=/home/isucon/benchmarker \
  --pipe \
  --wait \
  --collect \
  --uid=$(id -u)\
  --gid=$(id -g) \
  --slice=benchmarker.slice \
  --service-type=oneshot \
  -p AmbientCapabilities=CAP_NET_BIND_SERVICE \
  -p CapabilityBoundingSet=CAP_NET_BIND_SERVICE \
  -p LimitNOFILE=2000000 \
  -p TimeoutStartSec=110s \
    ~isucon/benchmarker/bin/benchmarker \
    -exit-status \
    -tls \
    -target app.t.isucon.dev:443 \
    -host-advertise bench.t.isucon.dev \
    -push-service-port 1001 \
    -tls-cert /etc/ssl/private/tls-cert.pem \
    -tls-key /etc/ssl/private/tls-key.pem \
```

(Adjust `-target` and `-host-advertise` as your domain names)

## Expected machine specs

- For contestant
  - isu1
    - CPU: 2 Core (AMD EPYC 7352)
    - Memory: 1 GiB
    - IO throughput: 1 Gbps
    - IOPS limit: 800 (Read / Write)
    - Interface: 1 Gbps
    - Root disk size: 30 GB
  - isu2
    - CPU: 2 Core (AMD EPYC 7352)
    - Memory: 2 GiB
    - IO throughput: 1 Gbps
    - IOPS limit: 800 (Read / Write)
    - Interface: 1 Gbps
    - Root disk size: 30 GB
  - isu3
    - CPU: 4 Core (AMD EPYC 7352)
    - Memory: 1 GiB
    - IO throughput: 1 Gbps
    - IOPS limit: 800 (Read / Write)
    - Interface: 1 Gbps
    - Root disk size: 30 GB
- For benchmarker
  - bench
    - CPU: 8 Core (AMD EPYC 7352)
    - Memory: 16 GiB
    - IO throughput: 1 Gbps
    - IOPS limit: 800 (Read / Write)
    - Interface: 1 Gbps
    - Root disk size: 30 GB

## License

MIT License unless otherwise specified
