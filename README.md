# Najimilab official website

Node.js標準機能だけでHTMLを生成する静的サイト。ブラウザー側JavaScript・外部フォント・解析・広告SDKは使用していません。秘密情報やアプリ本体の設定は不要です。

## ローカル表示

Node.js 22以上。外部パッケージのインストールは不要です。

```sh
npm run dev
```

http://127.0.0.1:4173 を開きます。変更時はサーバーを終了して再実行してください（自動更新なし）。

```sh
npm run build
npm run check
npm run preview
```

`dist/` が公開用成果物です。リポジトリ全体を公開ディレクトリにしないでください。

## 構成

| URL / ファイル | 内容 |
| --- | --- |
| `/` | ブランド紹介 |
| `/apps/` | アプリ一覧 |
| `/apps/kensho-runner/` | 懸賞ランナー（現在開発中） |
| `/about/` | Najimilabについて |
| `/privacy/`, `/terms/` | 未施行の下書き・TODOを明示 |
| `/contact/` | 設定前は窓口準備中 |
| `/app-ads.txt` | コメントのみ・正式情報の追記待ち |
| `src/data/apps.json` | アプリ情報の管理箇所 |
| `src/data/site.json` | 公開用連絡先 |
| `src/privacy.html`, `src/terms.html` | 規約本文 |
| `scripts/build.mjs` | 共通レイアウト・ページ生成 |
| `public/` | CSS、SVG、ヘッダー、app-ads.txt |

## アプリの追加

`src/data/apps.json` の配列へ既存項目をコピーして追加します。`slug` は一意の英小文字・数字・ハイフン、各項目は通常の文字列、`features` は `title` と `body` の配列です。ビルドするとトップ・一覧のカードと `/apps/<slug>/` が生成されます。

イラストは現在共通です。新しいアプリのイラストや個別規約が必要ならテンプレートを拡張してください。ストアボタンは未実装です。配信開始時は公式URLを確認して追加し、状態・対応OS・規約の適用範囲も更新してください。

## Contact

`src/data/site.json` の `contactEmail` または `contactUrl`（HTTPS）を設定してビルドします。空なら準備中表示です。架空のアドレスや動作しないフォームはありません。外部フォーム採用時はプライバシーポリシーも更新してください。

## Cloudflare Pages

[公式の静的HTMLガイド](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)に沿って `kei0245/najimilab-website` を接続します。

- Framework preset: None
- Root directory: 空欄（リポジトリルート）
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 22以上（必要ならビルド変数 `NODE_VERSION=22`）
- Production branch: レビュー・マージ後の `main`
- APIキー・Firebase情報などの環境変数: 不要

Pages Functionsは不要です。無料プランの上限・条件は利用時に確認してください。`public/_headers` はCloudflare Pages用です。他ホストでは同等のヘッダーを設定してください。トップレベルの `404.html` で存在しないページを404として扱います。

## app-ads.txt

`public/app-ads.txt` はコメントのみです。架空のPublisher IDやseller行はありません。AppLovinおよび必要な仲介先から正式な内容を取得し、確認済みの行だけを追加してください。ビルド時にサイトルートへコピーします。

公開後はストアに登録する開発者Webサイトのドメインと整合させ、`https://実際のドメイン/app-ads.txt` が200・text/plainで返ることを確認してください。`npm run check` は現在コメントのみを検証するため、正式な行の追加時には検証も更新してください。

## 公開・リリース前TODO

- 有効な問い合わせ窓口と運営者の情報を設定する。
- 規約のTODOを実装・SDK設定・配信地域に合わせて解消し、必要なレビュー後に正式版と施行日を公開する。
- 歩数の権限・取得元・送信範囲、認証方式、Firestoreの項目・保存期間・削除方法を確認する。
- 広告SDK・仲介先、識別子等の処理、同意・撤回、対象年齢を確認する。
- 懸賞条件・特典・広告視聴との関係、法令・ストア規則への適合を確認する。
- ドメイン決定後にcanonical、OG URL・共有画像、sitemapを必要に応じて追加する。
- 公開環境のヘッダー、404、Contact、app-ads.txt、モバイル表示を再確認する。

## 秘密情報とGitHub反映

`.gitignore` は `.env*`、秘密鍵、keystore、Firebase設定、サービスアカウント、生成物などを除外します。ignoreだけで完全な検出はできないため、コミット差分も確認してください。アプリ本体のファイルをコピーする必要はありません。

```sh
npm run build
npm run check
git status --short
git diff --cached --check
git diff --cached
```

今後の更新は作業ブランチでコミットし、レビュー後に `main` へ反映してください。公開用ブランチは `main` です。以下は作業ブランチをpushする例です：

```sh
git commit -m "Build Najimilab static website"
git push -u origin feat/najimilab-static-site
```

`dist/` と `artifacts/` はコミット対象外です。ローカルのブラウザー検証は作業環境の既存PlaywrightとChromeで実行し、サイトの依存関係には加えていません。

Privacy草案の確認資料：[Firebaseのプライバシーとセキュリティ](https://firebase.google.com/support/privacy)。収集内容はSDKの採用だけでは確定しないため、実設定・挙動を確認してください。
