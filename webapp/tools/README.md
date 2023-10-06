# webapp/tools

このディレクトリは、仮想ポータルおよび仮想ベンチマークサーバの動作確認に使える Ruby スクリプトが置いてあります。

| File                   | 説明                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| `add_benchmark_job`    | 仮想ベンチマークジョブのエンキューを行えます。                          |
| `finish_benchmark_job` | 仮想ベンチマークサーバから 1 件デキューし、仮想負荷走行を完了させます。 |
| `show_notifications`   | `notifications` テーブルの中身をデコードして表示します。                |

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
