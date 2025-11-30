# wedding-quiz-template

GitHub Pages で公開できる結婚式用クイズサイトです。
テーブルに置いた QR コードからアクセスし、クイズに回答する想定です。
代表者名とスコアを Google Apps Script 経由でスプレッドシートに保存できるので、景品用の集計も簡単です。

## 動作確認

1. リポジトリをクローンまたはダウンロードします。
2. `index.html` をブラウザで開きます。
3. 代表者名を入力して「クイズを始める」を押し、全問回答して結果表示を確認してください。

## ディレクトリ構成

```
.
├── index.html            # メインページ
├── styles.css            # スタイル
├── js/
│   ├── app.js            # 画面制御ロジック
│   ├── services.js       # Apps Script 送信など外部連携
│   ├── custom-content.js # 利用者が編集する文言・問題データ
│   └── config.js         # Apps Script など環境設定
├── img/                  # 解説用の画像
├── apps-script.js        # Google Apps Script 用のサンプルコード
└── README.md
```

## コンテンツのカスタマイズ

- **テキスト・問題データ**: `js/custom-content.js` を編集します。
  - `window.WeddingCopy` … 画面の文言（`hero / intro / playerForm / buttons / quiz / result / messages` など）をまとめています。
  - `window.WeddingQuestions` … クイズの内容。`text`, `choices`, `correctIndex`, `detail`, `detailImage` を必要に応じて変更してください。
  - `window.WeddingSettings` … `APPS_SCRIPT_ENDPOINT` など動作設定を記述します。Apps Script の Web アプリ URL はここを書き換えてください。
- **装飾**: `styles.css` を調整します。フォントやカラー、背景などを変更可能です。
- **画像**: 解説用の画像は `img/` 配下に配置し、`detailImage.src` で参照してください。

## Google Apps Script でスコア保存

1. Google スプレッドシートを作成し、シート名（例: `Scores`）を決めます。
2. スプレッドシートから「拡張機能 > Apps Script」を開き、リポジトリの `apps-script.js` を丸ごと貼り付けます。
   - `const SHEET = ...` の `<YOUR_SPREADSHEET_ID>` を、ご自身のスプレッドシート ID に差し替えてください。
   - `doGet`, `doPost`, `doOptions` すべてが CORS ヘッダーを返すため、`file://` や別ドメインからのアクセスでもブロックされません。
3. デプロイ > 新しいデプロイ > ウェブアプリ を選び、以下を設定します。
   - 実行するアプリ: `doPost`
   - アクセスできるユーザー: `全員（匿名）`
4. 表示された URL をコピーし、`js/config.js` の `CONFIGURED_ENDPOINT` を置き換えれば設定完了です（必要なら `window.GOOGLE_APPS_SCRIPT_ENDPOINT` で上書きも可能）。ブラウザで直接 `index.html` を開いても動作します。
5. クイズを最後まで回答すると、代表者名・正解数・開始/完了時刻などがシートに追記されます。

> ⚙️ **設定は簡単**: Apps Script の URL をメモして `js/config.js` の一行を差し替えるだけで、集計シートへの保存が有効になります。

## GitHub Pages で公開

1. GitHub に本リポジトリをプッシュします。
2. リポジトリ設定の「Pages」でブランチ（例: `main`）とルートを選択し、公開を有効化します。
3. 表示された URL をスキャン用 QR コードに変換し、会場のテーブルへ設置してください。

## 補足

- Apps Script の URL を設定しない場合、スコア送信は自動的にスキップされます。
- 大人数でアクセスする場合は、Google スプレッドシートのアクセス権と Apps Script の実行権限を事前に確認してください。
- 景品用のランキングは、スプレッドシートのフィルターや条件付き書式を活用すると便利です。
