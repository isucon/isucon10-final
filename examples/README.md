# Examples

このディレクトリは、仮想ポータルおよび仮想ベンチマークサーバの動作確認に使えるスクリプトおよび、Web Push の実装の参考にできるコード例が置いてあります。

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

を実行し、必要なライブラリをインストールしてください。

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

## webpush ディレクトリについて

`webpush` ディレクトリには、仮想ポータルに対して Web Push 通知でテストメッセージを送ることができる各言語のコードが置かれています。

これらのサンプルコードは、 `xsuportal.proto.resources.Notification.TestMessage` をメッセージとして持つ通知を生成し、指定された contestant の持つ push_subscriptions に対し Web Push で送ります。

### セットアップ

1. `webapp/generate_vapid_key.sh` を実行し、 `webapp/vapid_private.pem` を生成する
2. 仮想ポータルにブラウザでアクセスして通知を受け取りたい contestant としてログインし、`/contestant/dashboard` から通知を購読する
3. `webpush/ruby/send_web_push.rb`（Ruby の場合）を実行し、通知を送信する

正常に Web Push が送信できた場合、下図のような通知を受け取ることができます。

![image](https://user-images.githubusercontent.com/20384/94367612-d8064880-011a-11eb-8b21-495b1824de91.png)

### Ruby 実装: webpush/ruby/send_web_push.rb

```
$ webpush/ruby/send_web_push.rb -c contestant_id -i vapid_private_key_path
```

- `-c contestant_id` 通知を送信する contestant の ID（必須）
- `-i vapid_private_key_path` ECDSA with SHA-256 秘密鍵のパス（必須）
  - `generate_vapid_key.sh` で生成した鍵を利用できます。
