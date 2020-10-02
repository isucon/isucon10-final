# XSUCON アプリケーションマニュアル

### 用語

ISUCON （実際のコンテスト/競技） と XSUCON （ISUCON 10 本選問題に登場する仮想的なコンテスト/競技） 内の用語を区別するために、本マニュアルでは「実」を付けた場合には ISUCON を、「仮想」を付けた場合には XSUCON を指します。

例:

- ISUCON
  - 実ベンチマーカー
  - 実選手
  - ...
- XSUCON
  - 仮想ベンチマーカー
  - 仮想選手
  - ...

## XSUCON の流れ

実負荷走行の中で開催される XSUCON は、以下のような状態を持ちます。

1. 0 秒時点: 仮想チーム登録フェーズ
2. 10 秒時点: 仮想コンテスト開始
3. 50 秒時点: 仮想スコアフリーズ
4. 60 秒時点: 仮想コンテスト終了

上記のフェーズ遷移の時間は目安です。実際には、実ベンチマーカーによって `POST /initialize` で時間が指定されます。

### 1. 仮想チーム登録フェーズ

仮想選手が仮想チームを登録したり、メンバーを招待したりします。

実ベンチマーカーは、アプリケーションがチーム登録リクエストを処理できるかぎり、仮想チームを登録しようとします。これに対しアプリケーションは、レスポンスコードによって仮想チームの参加上限数を制限する事ができます。

例えば、XSUCON の参加チーム数を 10 チームにしたい場合は、11 チーム目以降のチーム登録リクエスト `POST /api/registration/team` に対し HTTP レスポンスコード 403 を返してください。

なお仮想チームには 1 チームあたり最大 3 人まで参加する事ができます。

### 2. 仮想コンテスト開始

仮想コンテスト(XSUCON)が開始します。これ以降の仮想チーム登録はできません。

仮想コンテスト開催中は、実ベンチマーカーは以下の 3 種類のユーザーを模したリクエストを行います。

- 仮想選手
  - 仮想コンテストの参加者です。仮想ベンチマーカーへのエンキューや仮想ダッシュボード閲覧、仮想運営への質問など、競技に関する動作を行います。
- 仮想運営
  - 仮想選手からの質問への回答を行います。
- 仮想オーディエンス
  - 仮想コンテストには参加しませんが、仮想選手達のスコアを見守り、応援しています。一定の条件を満たすと仮想オーディエンスは増えていきます（後述）。

### 3. 仮想スコアフリーズ

仮想コンテスト終了まで、ダッシュボードは「スコアフリーズ」状態になります。

スコアフリーズ状態では、各ダッシュボードは以下のような挙動になります。

- 仮想選手向けダッシュボード `GET /api/contestant/dashboard`
  - 仮想選手は、他仮想チームについては、スコアフリーズ状態になった時点までのスコアしか見られなくなります。自チームについては引き続き最新のスコアが表示されます。
- 仮想オーディエンス向けダッシュボード `GET /api/audience/dashboard`
  - 仮想オーディエンスは、全ての仮想チームについて、スコアフリーズ状態になった時点までのスコアしか見られなくなります。

仮想スコアフリーズ中も仮想コンテストは続いており、仮想選手達は引き続き競技に関するリクエストを行います。

### 4. 仮想コンテスト終了

仮想コンテストが終了すると、仮想選手達は競技に関するリクエスト（仮想負荷走行のエンキューなど）ができなくなります。

各ダッシュボードにおける仮想スコアフリーズは解除され、他仮想チームの最新スコアが再び見られるようになります。

## 仮想ベンチマークサーバと仮想負荷走行について

![image](https://user-images.githubusercontent.com/20384/94166703-9c734080-fec6-11ea-99db-a15ed4f0b66a.png)

実競技に用いるチューニング対象のアプリケーション（以下アプリケーションと表記）は「仮想ポータル （HTTPS）」と「仮想ベンチマークサーバ （gRPC）」からなります。

仮想ベンチマーカーは実ベンチマーカーの中に実装されているため、実装を見たり変更したりすることはできません。

以下、仮想選手が仮想負荷走行をエンキューしてから、その走行結果を仮想選手が受け取るまでの流れを説明します。

### 1. 仮想選手: 仮想負荷走行のエンキュー

HTTP リクエスト: `POST /api/contestant/benchmark_jobs`

仮想選手が仮想ポータルに対し、仮想負荷走行（benchmark_job）のエンキューをリクエストします。エンキューしたとき、ジョブのステータスは `PENDING` として設定されます。

仮想選手は、エンキューができる状況にあるときは即時にエンキューを試みます。以下のような状況にある場合は仮想選手はエンキューをせず、状況が変化するのを待ちます。

- まだ `FINISHED` になっていない所属仮想チームのジョブ（`PENDING`, `SENT`, `RUNNING`）がすでにあり、まだ仮想負荷走行終了の通知を受け取っていないとき
- 仮想選手本人あるいは所属仮想チームのメンバーが仮想運営への質問（Clarification）を投稿したあと、まだ仮想運営からの回答を確認していないとき

### 2. 仮想ベンチマーカー: ベンチマークキューのポーリング

gRPC サービス: `xsuportal.proto.services.bench.BenchmarkQueue`, プロシージャ: `ReceiveBenchmarkJob`

仮想ベンチマーカーは仮想ベンチマークサーバに対し、常にキューをポーリングしています。キューにジョブがあった場合はそのジョブがデキューされます。デキューされたジョブは、ステータスが `PENDING` から `SENT` に変更されます。

仮想ベンチマーカーは仮想チームと同じ数だけ用意されており、最大で全ての仮想チームの仮想負荷走行を同時に処理できる能力を有します。

#### 仮想ベンチマーカーのポーリング挙動について

各仮想ベンチマーカーは、`ReceiveBenchmarkJob` の実行でジョブが返却されなかった場合（キューが空）、待ち時間を挟まず、即時にリトライをします。また、仮想負荷走行後、レポートを登録した後も、待ち時間を挟まず即時に `ReceiveBenchmarkJob` を実行します。

### 3. 仮想ベンチマーカー: レポートの登録

gRPC サービス: `xsuportal.proto.services.bench.BenchmarkReport`, プロシージャ: `ReportBenchmarkResult`

仮想ベンチマーカーは仮想負荷走行に対し、以下の通りレポートを送ります。

- 仮想負荷走行が開始したとき
  - ジョブのステータスは `SENT` から `RUNNING` に変更されます。
- 仮想負荷走行が完了したとき
  - ジョブのステータスは `RUNNING` から `FINISHED` に変更されます。

仮想負荷走行は開始したあと瞬時に完了します。

### 4. 仮想選手: 通知のポーリング

仮想選手のブラウザは一定時間ごとに通知リスト（`GET /api/contestant/notifications`）をポーリングしています。仮想ポータルは、仮想選手の仮想チームが実行した仮想負荷走行が完了していた場合、ベンチマーク完了通知（`xsuportal.proto.resources.Notification.BenchmarkJobMessage`）を通知リストに加えます。

仮想選手はこの通知を受け取ったとき、ジョブ詳細（`GET /api/contestant/benchmark_jobs/:id`）にアクセスし、仮想負荷走行の結果を確認します。実ベンチマーカーはこの確認が完了したとき「仮想負荷走行が 1 回成功した」としてカウントします。

## 仮想オーディエンスの増減について

仮想オーディエンスは、XSUCON を盛り上げるために欠かせない存在です。仮想オーディエンスは、仮想オーディエンス用ダッシュボード（`GET /api/audience/dashboard`）を一定間隔で閲覧し、仮想コンテストの動向を見守っています。

仮想オーディエンスは、仮想コンテスト開始直後は 0 人の状態から始まります。いずれかの仮想チームが仮想負荷走行を 1 回成功させるたびに、仮想オーディエンスは 1 人増えます。また、仮想オーディエンスの行動中にエラーがあった時、1 回のエラーにつき仮想オーディエンスは 1 人減ります。

## 仮想ポータルの質問機能について

仮想選手は、一定の頻度で質問を投稿（`POST /api/contestant/clarifications`）します。仮想運営は質問を一定間隔で確認しており (`GET /api/admin/clarifications`)、未回答の質問を検知した場合即時に回答を書き込みます（`PUT /api/admin/clarifications`）。

仮想選手は、本人あるいはチームメンバーが質問を投稿したら、仮想運営による回答を確認できるまで、以下の行動を停止します。

- 仮想負荷走行のエンキュー
- 新たな質問の投稿

仮想選手のブラウザは、一定時間ごとに通知リスト（`GET /api/contestant/notifications`）をポーリングしており、質問に対する回答が来たかどうかはこの通知の中身を見て判断します。仮想選手は、通知リストに回答通知（`xsuportal.proto.resources.Notification.ClarificationMessage`）が含まれていることを確認したら、回答の本文を質問リスト（`GET /api/contestant/clarifications`）から閲覧します。仮想選手は質問リストを見て回答されていることが確認できたら、停止していた上記の行動を再開します。

### 質問に対する個別回答と全体回答について

仮想選手からの質問に対する仮想運営からの回答には、「個別回答」と「全体回答」があります。仮想運営は、質問に対しどちらの種別の回答を行うかは、一定の確率で選択します。

個別回答では、質問を投稿した仮想チームのみ、質問および回答を閲覧できます。

全体回答では、質問を投稿した仮想チーム以外の仮想選手も含め、全ての仮想選手が質問とその回答を閲覧できます。全体回答が行われた場合、全仮想選手の通知リストに回答通知が加えられます。回答の通知を受け取った全仮想選手は、その回答を即時に閲覧しようとします。★

## 仮想ポータルの通知機能について

![image](https://user-images.githubusercontent.com/20384/94283593-2df8b600-ff8c-11ea-9637-a9502a4ba8b9.png)

仮想ポータルの通知機能は、ブラウザの [Notifications API](https://notifications.spec.whatwg.org/) および [Push API](https://www.w3.org/TR/push-api/) を用いて実装されています。仮想ポータルの仮想選手向けダッシュボード画面（`/contestant/dashboard`）右上にある「通知を有効にする」ボタン（上図）を押すと、ブラウザを通じて通知を受け取ることができます。ブラウザで動作確認する際には、[お使いのブラウザが Notifications API および Push API に対応しているかどうかを確認してください（Safari は対応していません）](https://caniuse.com/push-api)。実運営は、Chrome と Firefox を用いて動作確認を行っています。

アプリケーションの参考実装（仮想ポータルのクライアントサイド）において、新着通知の取得は前述の通り `GET /api/contestant/notifications` へのポーリングで実装されています。

参考実装のサーバサイドでは未実装ですが、クライアントサイドはこのポーリング方式に加え、 Web Push 方式が実装されています。

以下の 2 つの API は、参考実装ではステータスコード 503 を返すようになっています。これらを正しく実装し、200 を返すようにすることで、Web Push による通知を購読/購読解除できるようになります。

- Web Push 通知の購読: `POST /api/contestant/push_subscriptions`
- Web Push 通知の購読解除: `DELETE /api/contestant/push_subscriptions`

実ベンチマーカー内の仮想選手が使うブラウザも同様に、Web Push が実装されているため、上記 API が実装されていれば Web Push による通知を購読するようになります。

アプリケーションは、Web Push で全ての通知を送るように変更した場合は、通知リスト（`GET /api/contestant/notifications`）のリクエストに対して空の通知リストを返す事ができます。空の通知リストを返す場合も、正常時の HTTP ステータスコードは `200` であることが期待されます。

また、アプリケーションは 1 人の仮想選手に対して、Web Push 方式の通知とポーリング方式の通知を混在させても構いません。また、通知に関しては既に受信したものを重複して受信した場合でも、繰り返し処理されません。

## 実ベンチマーカーが実装する Web Push service について

ブラウザの [Push API] の挙動を再現するため、実ベンチマーカーには [RFC8030] push service が実装されています。

実ベンチマーカーが実装する push service は [RFC8030 Section 5.](https://tools.ietf.org/html/rfc8030#section-5) に記載されている push resource をサポートしています。user agent については、実ベンチマーカーに内包しているため、その他のエンドポイントについては実装されていません。

加えて、一般的なブラウザで Push API を利用する際必要になる [RFC8291] (メッセージの暗号化), [RFC8292] (VAPID を利用したサーバ認証) をサポートしています。

### 原則

実ベンチマーカーはアプリケーションを実際のブラウザで利用した場合の挙動を模倣しています。すなわち、[Push API] を利用して得られる push subscription 情報を、必要に応じてアプリケーションへ送信します。ただし、[RFC8292] における public key (VAPID 公開鍵) がアプリケーションより、実ベンチマーカへ送信されている必要があります (詳細は参考実装の挙動を確認してください)。

push subscription 情報については、push resource の URL に加え、[W3C Push API: getKey() メソッド](https://www.w3.org/TR/push-api/#dom-pushsubscription-getkey) における `p256dh`, `auth` の値が提供されます。提供方法も参考実装の挙動に準じます。

そして、push resource へ送信した push message は即座に user agent (仮想選手) へ送信されます。仮想選手は通知を順次処理するため、同時に複数の通知に対応する動作を取ることはありません。

また、各言語の参考実装において既に存在するライブラリを利用しての動作を検証しています (サンプルコードについては後述)。

### Caveats

重複する内容もありますが、実ベンチマーカーが送信する push resource のエンドポイントについて、RFC に定義されていない動作、あるいは RFC を意図的に違反している点は下記の通りです。

**これらは ISUCON10 本選競技の課題の範疇においては、Web Push ライブラリなどを利用している限り問題にはならないと考えています。**

- [RFC8291] (暗号化) の利用が必須です。
  - [W3C Push API の Section 4. 等](https://www.w3.org/TR/push-api/#security-and-privacy-considerations) をはじめ、Web ブラウザの Web Push における [RFC8030] の利用では、push message は暗号化される事が前提となっているためです。
  - したがって、push resource へ送信するリクエストについては、 [RFC8291] に従い暗号化して送信する必要があります。暗号化されていないリクエストについては、push resource は HTTP 400 エラーを返します。
  - 実ベンチマーカーは push subscription をアプリケーションへ提供するとき、かならず [RFC8291] で定義された鍵交換のための EC 公開鍵、共有鍵である、 [Push API] で取得できる `p256dh`, `auth` の値が送信されます。
  - push resource へ送信した push message の復号の失敗は実負荷走行のエラーとして記録されます。
- [RFC8292] (VAPID) の利用が必須です。
  - 実ベンチマーカーは [Section 4.](https://tools.ietf.org/html/rfc8292#section-4) における restricted push message subscription のみを生成します。
  - したがって、アプリケーションからの push resource へのリクエストは HTTP `Authorization` ヘッダの `vapid` スキームを利用して認証される必要があります。
  - [Section 2.](https://tools.ietf.org/html/rfc8292#section-2), [Section 4.2.](https://tools.ietf.org/html/rfc8292#section-4.2) に従い、`aud`, `exp` クレームのみを検証します。
  - VAPID の ECDSA 公開鍵がアプリケーションより実ベンチマーカーへ送信されていない場合、実ベンチマーカーは push resource を生成し、アプリケーションへ送信することはありません。
- [RFC8030 Section 5.1.](https://tools.ietf.org/html/rfc8030#section-5.1) に定義されている push message receipt については、実装されていません (RFC 違反)。
  - push resource へのリクエストにおいて `Prefer: respond-async` ヘッダが与えられたときの `Link` レスポンスヘッダについては実装されていますが、 `Link` ヘッダが示す URL は 404 Not Found を返答します。
  - また、`Prefer: respond-async` ヘッダを与えたときの動作については保証しません。
- [RFC8030 Section 5.2.](https://tools.ietf.org/html/rfc8030#section-5.2) `TTL` ヘッダ, [Section 5.3.](https://tools.ietf.org/html/rfc8030#section-5.3) `Urgency` ヘッダ, [Section 5.4.](https://tools.ietf.org/html/rfc8030#section-5.4) `Topic` ヘッダに関しては、受け付けますが意味を持ちません。
  - user agent (仮想選手) へは即座に送信され、user agent は即座に push message に対応した動作を取ります。
  - user agent は通知を順次処理します。同時に複数の通知に対する行動は取りません。
- 一部ライブラリにおける [RFC8291 Section 3.1.](https://tools.ietf.org/html/rfc8291#section-3.1) 実装ミスを救済するため、1 度目の復号エラーについて、誤った ECDH shared secret の導出手順によりリトライを試みるようになっています。
  - 具体的には、 Go 実装は https://github.com/SherClockHolmes/webpush-go の不具合を救済しています。
  - RFC8291 Section 3.1. の ECDH 処理について、[SEC1] Section 6.1.3., 2.3.5., 2.3.7. に従って実装すると shared secret (output) が常に 32 バイトになるところ、32 バイト未満になるケースが存在するためです。
  - リトライでも復号に失敗した場合は「不正な Web Push メッセージ」としてエラーになります。リトライで発生したエラーについては破棄され、エラーメッセージには 1 回目 (リトライ前) のエラーが記録されます。
- 存在しない push resource へのリクエストは実負荷走行のエラーとして記録されます。
- 存在したが expire した push resource へのリクエストは、エラーとなりませんが、user agent (仮想選手) へは送信されません。

[push api]: https://www.w3.org/TR/push-api/
[rfc8030]: https://tools.ietf.org/html/rfc8030
[rfc8188]: https://tools.ietf.org/html/rfc8188
[rfc8291]: https://tools.ietf.org/html/rfc8291
[rfc8292]: https://tools.ietf.org/html/rfc8292
[sec1]: https://www.secg.org/sec1-v2.pdf

## Web Push サンプルコードについて

仮想ポータルのクライアントサイド (Web ブラウザで表示されるフロンドエンド実装) に対して Web Push 通知でテストメッセージを送ることができる各言語のコードが用意されています。

これらのサンプルコードは、 `xsuportal.proto.resources.Notification.TestMessage` をメッセージとして持つ通知 (`xsuportal.proto.resources.Notification`) を生成し、指定された contestant の持つ push_subscriptions に対し Web Push で送ります。

### Web Push の購読とサンプルコードの実行方法

1. `~isucon/webapp` 上で `./generate_vapid_key.sh` を実行し、VAPID 用の ECDSA 鍵 `webapp/vapid_private.pem` を生成する
   - 参考実装では自動で `~isucon/webapp/vapid_private.pem` をロードするようになっています。
   - 複数のサーバーを利用する場合、同じ鍵ファイルを共有するようにする必要があります。
2. 仮想ポータルにブラウザでアクセスして通知を受け取りたい仮想選手としてログインし、`/contestant` から通知を購読する
3. `send_web_push` (後述) を実行し、通知を送信する

正常に Web Push が送信できた場合、下図のような通知を即座に受け取ることができます。

(初期状態のサーバーサイド実装を利用している場合、`send_web_push` で生成される通知は、ポーリング方式からも送信されます)

![image](https://user-images.githubusercontent.com/20384/94367612-d8064880-011a-11eb-8b21-495b1824de91.png)

以下に各言語の実装および、その実行方法を記載します。いずれもサーバー上かつ、初期状態での実行を想定しています。

### Ruby 実装: ~isucon/webapp/ruby/send_web_push.rb

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/ruby
bundle exec send_web_push.rb -c contestant_id -i vapid_private_key_path
```

- `-c contestant_id` 通知を送信する contestant の ID（必須）
- `-i vapid_private_key_path` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。

### Rust 実装: ~isucon/webapp/rust/src/bin/send_web_push.rs

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/rust
cargo run --bin send_web_push -- -c contestant_id -i vapid_private_key_path
```

- `-c contestant_id` 通知を送信する contestant の ID（必須）
- `-i vapid_private_key_path` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。

### Go 実装: ~isucon/webapp/golang/cmd/send_web_push/main.go

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/golang
make
./bin/send_web_push -c contestant_id -i vapid_private_key_path
```

- `-c contestant_id` 通知を送信する contestant の ID（必須）
- `-i vapid_private_key_path` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。

### Node.js 実装: ~isucon/webapp/nodejs/src/sendWebpush.ts

```
set -o allexport; source ~isucon/env; set +o allexport

cd ~isucon/webapp/nodejs
npm run send-webpush -- ${contestant_id} ${vapid_private_key_path}
```

- `${contestant_id}` 通知を送信する contestant の ID（必須）
- `${vapid_private_key_path}` ECDSA 秘密鍵 PEM ファイル（必須）
  - `~isucon/webapp/generate_vapid_key.sh` で生成した鍵を利用できます。
