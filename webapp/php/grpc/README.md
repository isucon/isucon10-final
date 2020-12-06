# Spiral GRPC Application Skeleton [![Latest Stable Version](https://poser.pugx.org/spiral/app-grpc/version)](https://packagist.org/packages/spiral/app-grpc)

<img src="https://user-images.githubusercontent.com/796136/67560465-9d827780-f723-11e9-91ac-9b2fafb027f2.png" height="135px" alt="Spiral Framework" align="left"/>

Spiral Framework is a High-Performance PHP/Go Full-Stack framework and group of over sixty PSR-compatible components. The Framework execution model based on a hybrid runtime where some services (GRPC, Queue, WebSockets, etc.) handled by Application Server [RoadRunner](https://github.com/spiral/roadrunner) and the PHP code of your application stays in memory permanently (anti-memory leak tools included).

[App Skeleton](https://github.com/spiral/app) ([CLI](https://github.com/spiral/app-cli), [GRPC](https://github.com/spiral/app-grpc)) | [**Documentation**](https://spiral.dev/docs) | [Twitter](https://twitter.com/spiralphp) | [CHANGELOG](/CHANGELOG.md) | [Contributing](https://github.com/spiral/guide/blob/master/contributing.md)

<br/>

Server Requirements
--------
Make sure that your server is configured with following PHP version and extensions:
* PHP 7.2+, 64bit
* **mb-string** extension
* PDO Extension with desired database drivers
* [Install](https://github.com/protocolbuffers/protobuf/tree/master/php) `protobuf-ext` to gain higher performance. 

Application Bundle
--------
Application bundle includes the following components:
* GRPC Server server based on [RoadRunner](https://roadrunner.dev)
* Console commands via Symfony/Console
* Queue support for AMQP, Beanstalk, Amazon SQS, in-Memory
* DBAL and migrations support
* Monolog, Dotenv
* Prometheus metrics
* [Cycle DataMapper ORM](https://github.com/cycle)

Installation
--------
```
composer create-project spiral/app-grpc
```

> Application server will be downloaded automatically (`php-curl` and `php-zip` required).

Once the application is installed you can ensure that it was configured properly by executing:

```
$ php ./app.php configure
```

## Running GRPC Server
In order to run GRPC server you must specify location of server key and certificate in `.rr.yaml` file:

```yaml
grpc:
  listen: tcp://0.0.0.0:50051
  proto: "proto/service.proto"
  workers.command: "php app.php"
  tls.key:  "app.key"
  tls.cert: "app.crt"
```

To issue local certificate:

```
$ openssl req -newkey rsa:2048 -nodes -keyout app.key -x509 -days 365 -out app.crt
```

To start application server execute:

```
$ ./spiral serve -v -d
```

On Windows:

```
$ spiral.exe serve -v -d
```

You can test your endpoints using any GRPC client. For example using [grpcui](https://github.com/fullstorydev/grpcui):

```
$ grpcui -insecure -import-path ./proto/ -proto service.proto localhost:50051
``` 

> Make sure to use `-insecure` option while using a self-signed certificate.

Generating Services
--------
In order to compile protobuf declarations into service code make sure to install:
* [protoc compiler](https://github.com/protocolbuffers/protobuf)
* [protoc-gen-php-grpc plugin](https://github.com/spiral/php-grpc)

To update or generate service code for your application run:

```
$ php ./app.php grpc:generate proto/service.proto
```

Generated code will be available in `app/src/Service`. Implemented service will be automatically registered in your application.

License:
--------
MIT License (MIT). Please see [`LICENSE`](./LICENSE) for more information. Maintained by [Spiral Scout](https://spiralscout.com).
