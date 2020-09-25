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

1. 0:00 仮想チーム登録フェーズ ★
2. 0:10 仮想コンテスト開始 ★
3. 0:50 仮想スコアフリーズ ★
4. 0:60 仮想コンテスト終了 ★

上記のフェーズ遷移の時間は目安です。実際には、実ベンチマーカーによって `POST /initialize` で時間が指定されます。

### 1. 仮想チーム登録フェーズ

仮想選手が仮想チームを登録したり、メンバーを招待したりします。

実ベンチマーカーは、アプリケーションがチーム登録リクエストを処理できるかぎり、仮想チームを登録しようとします。これに対しアプリケーションは、レスポンスコードによって仮想チームの参加上限数を制限する事ができます。

例えば、XSUCON の参加チーム数を 10 チームにしたい場合は、11 チーム目以降のチーム登録リクエスト `POST /api/registration/team` に対しレスポンスコード 403 を返してください。

なお仮想チームには 1 チームあたり最大 3 人まで参加する事ができます。

### 2. 仮想コンテスト開始

仮想コンテスト(XSUCON)が開始します。これ以降の仮想チーム登録はできません。

仮想コンテスト開催中は、実ベンチマーカーは以下の 3 種類のユーザーを模したリクエストを行います。

- 仮想選手
  - 仮想競技の参加者です。仮想ベンチマーカーへのエンキューや仮想ダッシュボード閲覧、仮想主催者への質問など、競技に関する動作を行います。
- 仮想主催者
  - 仮想選手からの質問への回答を行います。
- 仮想オーディエンス
  - 仮想競技には参加しませんが、仮想選手達のスコアを見守り、応援しています。一定の条件を満たすと仮想オーディエンスは増えていきます（後述 ★）

### 3. 仮想スコアフリーズ

仮想コンテスト終了まで、ダッシュボードは「スコアフリーズ」状態になります。

スコアフリーズ状態では、各ダッシュボードは以下のような挙動になります。

- 仮想選手向けダッシュボード `GET /api/contestant/dashboard`
  - 仮想選手は、他チームについては、スコアフリーズ状態になった時点までのスコアしか見られなくなります。自チームについては引き続き最新のスコアが表示されます。
- 仮想オーディエンス向けダッシュボード `GET /api/audience/dashboard`
  - 仮想オーディエンスは、全てのチームについて、スコアフリーズ状態になった時点までのスコアしか見られなくなります。

仮想スコアフリーズ中も仮想コンテストは続いており、仮想選手達は引き続き競技に関するリクエストを行います。

### 4. 仮想コンテスト終了

仮想コンテストが終了すると、仮想選手達は競技に関するリクエスト（仮想負荷走行のエンキューなど）ができなくなります。

各ダッシュボードにおける仮想スコアフリーズは解除され、他仮想チームの最新スコアが再び見られるようになります。

## 仮想負荷走行の仕様

仮想負荷走行の仕様について説明します。

![image](https://user-images.githubusercontent.com/20384/94166703-9c734080-fec6-11ea-99db-a15ed4f0b66a.png)

本選実競技に用いるチューニング対象のアプリケーション（以下アプリケーションと表記）は「仮想ポータル （HTTPS）」と「ベンチマークサーバ （gRPC）」からなります。

仮想ベンチマーカーは実ベンチマーカーの中に実装されているため、実装を見たり変更したりすることはできません。

### 1. 仮想選手: 仮想負荷走行のエンキュー

HTTP リクエスト: `POST /api/contestant/benchmark_jobs`

仮想選手（実ベンチマーカー内のエージェント）が仮想ポータルに対し、仮想負荷走行（benchmark_job）のエンキューをリクエストします。

エンキューしたとき、ジョブのステータスは `PENDING` として設定されます。

仮想選手は、エンキューができる状況にあるときは即時エンキューをします。以下のような状況にある場合はエンキューをせず、状況が変化するのを待ちます。

- 所属チームの `FINISHED` でないジョブ（実行待ちあるいは実行中）がすでにあり、まだ仮想負荷走行終了の通知を受け取っていないとき
- 仮想選手本人あるいは所属チームメンバーが仮想主催者への質問（Clarifications）を投稿したあと、まだ仮想主催者からの回答の通知を受け取っていないとき

### 2. 仮想ベンチマーカー: ベンチマークキューのポーリング

gRPC メッセージ: `BenchmarkQueueService.receive_benchmark_job`

仮想ベンチマーカーは仮想ベンチマークサーバに対し、定期的にキューをポーリングします。キューにジョブがあった場合はそのジョブをデキューします。

デキューされたジョブは、ステータスが `PENDING` から `SENT` に変更されます。

仮想ベンチマーカーは、仮想チームと同じ数だけ用意されています。

### 3. 仮想ベンチマーカー: レポートの登録

gRPC メッセージ: `BenchmarkReportService.report_benchmark_result`

仮想ベンチマーカーは仮想負荷走行に対し、以下の 2 度レポートを送ります。

- 仮想負荷走行が開始したとき
  - ジョブのステータスは `SENT` から `RUNNING` に変更されます。
- 仮想負荷走行が完了したとき
  - ジョブのステータスは `RUNNING` から `FINISHED` に変更されます。

なお仮想負荷走行は瞬時に完了し、スコアが生成されます。

### 4. 仮想選手: 通知のポーリング

HTTP リクエスト: `GET /api/contestant/notifications`

仮想選手は定期的に仮想ポータルに対し、新着通知をポーリングしています。
仮想ポータルは、仮想選手のチームが実行した仮想負荷走行が完了していた場合、ベンチマーク完了通知（`xsuportal.proto.resources.Notification.BenchmarkJobMessage`）を返します。実ベンチマーカーは仮想選手がこの通知を受け取ったとき、「仮想負荷走行が 1 回成功した」としてカウントします。

---

# メモ/したがき

## 実ベンチマーカーが実装する Web Push service について

ブラウザの [Push API](https://www.w3.org/TR/push-api/) の挙動を再現するため、実ベンチマーカーには [RFC8030](https://tools.ietf.org/html/rfc8030) push service が実装されています。

模擬 push service は [RFC8030 Section 5.](https://tools.ietf.org/html/rfc8030#section-5) に記載されている push resource をサポートしています。user agent については、実ベンチマーカーに内包しているため、その他のエンドポイントについては実装されていません。

加えて、一般的なブラウザで Push API を利用する際必要になる [RFC8291](https://tools.ietf.org/html/rfc8291) (メッセージの暗号化), [RFC8292](https://tools.ietf.org/html/rfc8292) (VAPID を利用したサーバ認証) をサポートしています。

### 原則

実ベンチマーカーは課題 Web アプリケーションを実際のブラウザで利用した場合の挙動を模倣しています。すなわち、[Push API] を利用して得られる push subscription 情報を、必要に応じて課題 Web アプリケーションへ送信します。ただし、[RFC8292] における public key (VAPID 公開鍵) が課題 Web アプリケーションより、実ベンチマーカへ送信されている必要があります。

push subscription 情報については、push resource の URL に加え、[W3C Push API: getKey() メソッド](https://www.w3.org/TR/push-api/#dom-pushsubscription-getkey) における `p256dh`, `auth` の値が提供されます。

また、各言語の参考実装において既に存在するライブラリを利用しての動作を検証しています。

そして、push resource へ送信した push message は即座に user agent へ送信されます。

### Caveats

重複する内容もありますが、実ベンチマーカーが送信する push resource のエンドポイントについて、RFC に定義されていない、あるいは RFC を意図的に違反している点は下記の通りです。ISUCON10 本選競技の課題の範疇においては、Web Push ライブラリなどを利用している限り問題にはならないと考えています。

- [RFC8291] (Encryption) の利用が必須です。
  - [W3C Push API の Section 4. 等](https://www.w3.org/TR/push-api/#security-and-privacy-considerations) をはじめ、Web ブラウザの Web Push における RFC8030 の利用では、push message は暗号化される事が前提となっているためです。
  - したがって、push resource へ送信するリクエストについては、RFC8291 に従い暗号化して送信する必要があります。暗号化されていないリクエストについては、push resource は HTTP 4xx エラーを返します。
  - 実ベンチマーカーは push subscription を課題 Web アプリケーションへ提供するとき、かならず RFC8291 に定義される ECDH 公開鍵、共有鍵である、Push API で取得できる `p256dh`, `auth` の値が送信されます。
- [RFC8292] (VAPID) の利用が必須です。
  - [Section 4.](https://tools.ietf.org/html/rfc8292#section-4) における restricted push message subscription のみが作成され、課題 Web アプリケーションへ実ベンチマーカーより送信されます。
  - したがって、push resource へのリクエストは HTTP `Authorization` ヘッダは `vapid` スキームを利用して認証される必要があります。
  - [Section 2.](https://tools.ietf.org/html/rfc8292#section-2), [Section 4.2.](https://tools.ietf.org/html/rfc8292#section-4.2) に従い、`aud`, `exp` クレームのみを検証します。
  - VAPID の ECDSA 公開鍵が課題 Web アプリケーションより実ベンチマーカーへ送信されていない場合、実ベンチマーカーは push resource を生成し、課題 Web アプリケーションへ送信することはありません。
- [RFC8030 Section 5.1.](https://tools.ietf.org/html/rfc8030#section-5.1) に定義されている push message receipt については、実装されていません (RFC 違反)。
  - push resource へのリクエストにおいて `Prefer: respond-async` ヘッダが与えられたときの `Link` レスポンスヘッダについては実装されていますが、 `Link` ヘッダが示す URL は 404 Not Found を返答します。
- [RFC8030 Section 5.2.](https://tools.ietf.org/html/rfc8030#section-5.2) `TTL` ヘッダおよび [Section 5.3.](https://tools.ietf.org/html/rfc8030#section-5.3) `Urgency` ヘッダに関しては、受け付けますが意味を持ちません。

  - user agent へは即座に送信され、user agent は即座に push message に対応した動作を取ります。

- 許可されている挙動変更
  - [x] Cache
  - [x] Conditional GET
  - [x] 仮想チーム参加制限
  - [ ] WebPush
- [ ] 動作確認方法
- [ ] audience が増える条件について
- [x] 各コンポーネント説明
  - 実ベンチマーカー
  - 仮想ポータル（アプリケーション）
    - HTTP
    - benchmark_server (gRPC)
- [ ] リカバリ方法
- 仮想負荷走行の仕様
  - [x] 瞬時に完了する点
  - [ ] 競技者がベンチ完了と Clar 返答を待つ点
  - [ ] 通知を見て行動をするという点

```
map[admin-answer-clarification:29 admin-get-clarification:30 admin-get-clarifications:118 audience-get-dashboard:1853 create-team:10 enqueue-benchmark:144 finish-benchmark:141 get-clarification:291 get-dashboard:391 join-member:20 post-clarification:94]
```
