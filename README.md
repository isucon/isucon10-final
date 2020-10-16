# ISUCON10 Final (XSUCON Portal)

## How to benchmark

### Get a TLS certificate

https://scrapbox.io/isucon10/*.t.isucon.dev_%E3%81%AE_TLS_%E8%A8%BC%E6%98%8E%E6%9B%B8

```
mkdir -p secrets
curl -o secrets/cert.pem ...
curl -o secrets/key.pem ..
```

### Running a benchmarker

```
cd benchmarker
make
./bin/benchmarker -target localhost:9292
```

## Machine spec

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
