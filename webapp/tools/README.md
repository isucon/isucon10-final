# Examples

このディレクトリは、仮想ポータルおよび仮想ベンチマークサーバの動作確認に使える Ruby スクリプトが置いてあります。

Web Push の実装の参考にできるコード例については、各言語で実装されており、 webapp/{言語名}/ 配下に配置しています (後述)。

| File                   | 説明                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| `add_benchmark_job`    | 仮想ベンチマークジョブのエンキューを行えます。                          |
| `finish_benchmark_job` | 仮想ベンチマークサーバから 1 件デキューし、仮想負荷走行を完了させます。 |
| `show_notifications`   | `notifications` テーブルの中身をデコードして表示します。                |

また、 `webpush` ディレクトリには、仮想ポータルに対して Web Push 通知でテストメッセージを送ることができる各言語のコードが置かれています。

## セットアップ

このディレクトリの `add_benchmark_job`, `finish_benchmark_job`, `show_notifications` は Ruby で実装されています。これらを実行するためには最初に

```
bundle install
```

を実行し、必要なライブラリをインストールしてください。なお、これらのスクリプトは `../ruby` ディレクトリに依存しています。

サーバー上ではあらかじめ実行されています。手元の PC などへこのディレクトリをダウンロードした場合は、 `.bundle/` および `vendor/` ディレクトリを削除してから `bundle install` を実行してください。

## add_benchmark_job

benchmark_jobs テーブルにレコードを追加します。 仮想ポータルの Enqueue ボタンを押した時と同様の動作が期待できます。

```
$ bundle exec ./add_benchmark_job -t team_id -h hostname -s status
```

- `-t team_id` エンキューをするチーム ID（必須）
- `-h hostname` 仮想ベンチマークを実行するホスト名（default: `xsu-001`）
  - これは名前解決ができる必要はなく、どのような文字列でも構いません
- `-s status` エンキュー時の `benchmark_job` のステータスを整数で指定します。（default: `0`）
  - PENDING = 0 (default)
  - SENT = 1
  - RUNNING = 2
  - ERRORED = 3
  - CANCELLED = 4
  - FINISHED = 5

## finish_benchmark_job

仮想ベンチマークサーバ（gRPC）に接続してデキューをし、ランダムなスコアを生成して実行結果のレポートを登録します。仮想ベンチマーカーの挙動を模しています。

```
$ bundle exec ./finish_benchmark_job -t team_id
```

- `-t team_id` エンキューをするチーム ID（必須）

## show_notifications

notifications テーブルから指定された contestant 宛てのレコードをすべて取り出し、メッセージをデコードしたうえで標準出力に JSON 形式で出力します。

```
$ bundle exec ./show_notifications -c contestant_id
```

- `-c contestant_id` 通知を表示をする contestant の ID（必須）

## Web Push サンプルコードについて

仮想ポータルに対して Web Push 通知でテストメッセージを送ることができる各言語のコードが用意されています。

これらのサンプルコードは、 `xsuportal.proto.resources.Notification.TestMessage` をメッセージとして持つ通知 (`xsuportal.proto.resources.Notification`) を生成し、指定された contestant の持つ push_subscriptions に対し Web Push で送ります。

### Web Push の購読とサンプルコードの実行方法

1. `/home/isucon/webapp` 上で `./generate_vapid_key.sh` を実行し、VAPID 用の ECDSA 鍵 `webapp/vapid_private.pem` を生成する
  - 参考実装では自動で `/home/isucon/webapp/vapid_private.pem` をロードするようになっています。
  - 複数のサーバーを利用する場合、同じ鍵ファイルを共有するようにする必要があります。
2. 仮想ポータルにブラウザでアクセスして通知を受け取りたい contestant としてログインし、`/contestant` から通知を購読する
3. `send_web_push` (後述) を実行し、通知を送信する

正常に Web Push が送信できた場合、下図のような通知を受け取ることができます。

![image](https://user-images.githubusercontent.com/20384/94367612-d8064880-011a-11eb-8b21-495b1824de91.png)

以下に各言語の実装および、その実行方法を記載します。いずれもサーバー上かつ、初期状態での実行を想定しています。

### Ruby 実装: webapp/ruby/send_web_push.rb

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/ruby
bundle exec send_web_push.rb -c contestant_id -i vapid_private_key_path
```

- `-c contestant_id` 通知を送信する contestant の ID（必須）
- `-i vapid_private_key_path` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。

### Rust 実装: webapp/rust/src/bin/send_web_push.rs

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/rust
cargo run --bin send_web_push -- -c contestant_id -i vapid_private_key_path
```

- `-c contestant_id` 通知を送信する contestant の ID（必須）
- `-i vapid_private_key_path` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。

### Go 実装: webapp/golang/cmd/send_web_push/main.go

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/golang
make
./bin/send_web_push -c contestant_id -i vapid_private_key_path
```

- `-c contestant_id` 通知を送信する contestant の ID（必須）
- `-i vapid_private_key_path` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。

### Node.js 実装: webapp/nodejs/src/sendWebpush.ts

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/nodejs
npm run send-webpush -- ${contestant_id} ${vapid_private_key_path}
```

- `${contestant_id}` 通知を送信する contestant の ID（必須）
- `${vapid_private_key_path}` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。
