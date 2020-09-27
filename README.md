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

## License

MIT License unless otherwise specified
