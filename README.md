# wedding-quiz-template

GitHub Pages で公開できる結婚式用クイズサイトです。
テーブルに置いた QR コードからアクセスし、クイズに回答する想定です。
代表者名とスコアを Google Apps Script 経由でスプレッドシートに保存できるので、景品用の集計も簡単です。

## デモ・確認できること

https://usuginus.github.io/wedding-quiz-template/

- Hero/説明文・入力フォーム・クイズ画面・結果画面までの一連の流れ
- 代表者名入力 → クイズ開始 → 解説つき回答 → 結果ページの表示と回答振り返り
- スマートフォン・PC それぞれでのレスポンシブ表示

## 推奨する使い方

1. GitHub でこのリポジトリを **Fork** します（Fork することで、オリジナルの更新を取り込みつつ自分専用の調整ができます）。
2. Fork したリポジトリをローカルへクローンし、`js/custom-content.js` や `styles.css` を編集してオリジナルのコンテンツに置き換えます。
3. `apps-script.js` を Apps Script にデプロイし、`window.WeddingSettings.APPS_SCRIPT_ENDPOINT` を更新します。
4. GitHub Pages で公開し、生成された URL を QR コード化して会場に設置してください。

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

1. **文言・設定を整える**  
   `js/custom-content.js` の `window.WeddingCopy` に hero 文言、ボタン、結果メッセージなどすべてのテキストがまとまっています。必要なブロックだけ置き換えてください。
2. **クイズを差し替える**  
   同ファイルの `window.WeddingQuestions` がクイズデータです。1 問につき `text`, `choices`, `correctIndex`, `detail`, `detailImage` を編集すれば OK。不要なプロパティは削除してもかまいません。
3. **動作設定を変更する**  
   `window.WeddingSettings` に Apps Script の URL (`APPS_SCRIPT_ENDPOINT` など) を記入します。複数会場で使う場合はここを書き換えるだけで送信先を切り替えられます。
4. **デザインを調整する**  
   カラーやフォント、背景などのスタイルは `styles.css` で管理しています。必要に応じてメディアクエリも追記してください。
5. **画像を差し替える**  
   解説用画像は `img/` 配下に置き、各問題の `detailImage.src` から参照します。

## Google Apps Script でスコア保存

1. **スプレッドシートを準備**  
   Google スプレッドシートを作成（例: `Scores` シート）。
2. **Apps Script を作成**  
   「拡張機能 > Apps Script」で `apps-script.js` の内容を貼り付け、`<YOUR_SPREADSHEET_ID>` を差し替えます。`doGet`/`doPost`/`doOptions` は CORS 対応済みです。
3. **ウェブアプリとしてデプロイ**  
   「デプロイ > 新しいデプロイ > ウェブアプリ」で `doPost` を実行関数に、アクセス権を「全員（匿名）」に設定して公開します。
4. **URL を設定**  
   デプロイ後に表示される URL を `js/custom-content.js` の `window.WeddingSettings.APPS_SCRIPT_ENDPOINT` に貼り付けます（あるいは `window.GOOGLE_APPS_SCRIPT_ENDPOINT` で上書きも可能です）。
5. **送信を確認**  
   クイズを最後まで回答すると、代表者名・正解数・開始/完了時刻などがスプレッドシートへ追記されます。

## GitHub Pages で公開

1. GitHub に本リポジトリをプッシュします。
2. リポジトリ設定の「Pages」でブランチ（例: `main`）とルートを選択し、公開を有効化します。
3. 表示された URL をスキャン用 QR コードに変換し、会場のテーブルへ設置してください。

## 補足

- Apps Script の URL を設定しない場合、スコア送信は自動的にスキップされます。
- 大人数でアクセスする場合は、Google スプレッドシートのアクセス権と Apps Script の実行権限を事前に確認してください。
- 景品用のランキングは、スプレッドシートのフィルターや条件付き書式を活用すると便利です。

## ライセンス

このテンプレートは [MIT License](./LICENSE) のもとで公開しています。ご了承のうえご利用ください。
