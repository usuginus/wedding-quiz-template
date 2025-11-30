// Custom content for the wedding quiz application
// You can override the default copy and questions by defining

(() => {
  // WeddingCopy is used to override default text content
  // Set your own copy here
  window.WeddingCopy = {
    documentTitle: "山田太陽 & 佐藤月子 Wedding Quiz",
    hero: {
      eyebrow: "TAIYO & TSUKIKO WEDDING",
      title: "Welcome Quiz",
      lead: "Taiyo と Tsukiko の歩みをたどるクイズ<br>テーブルのみなさまで相談しながら全問正解を目指してください",
    },
    intro: {
      steps: [
        "質問に直感で回答していきましょう。他のテーブルの皆様と相談してもOKです！",
        "制限時間はありません。ふたりの思い出話をしながら楽しんでください。",
        "後程、正解発表と景品のお渡しがありますので、お名前の入力を忘れずに！",
      ],
    },
  };

  // WeddingQuestions is used to define the quiz questions
  // Set your own questions here
  window.WeddingQuestions = [
    {
      text: "ふたりが初めて話した場所は？",
      choices: [
        "ネオライトソリューションズ株式会社の内定式",
        "就活イベント「Code Galaxy」",
        "満開の桜の下、同じ花びらを同時に掴もうとして指先が触れ合った瞬間",
        "現代アート美術館で偶然隣に座ったベンチ",
      ],
      correctIndex: 0,
      detail: "席順は五十音順で、「山田」と「佐藤」で席が隣同士でした。",
      detailImage: {
        src: "img/example00.jpg",
        alt: "内定式でのふたりの写真（イメージ）",
        caption:
          "第一志望の部署がなくなった話や、好きなゲームの話でなぜか大盛り上がりしたそうです。",
      },
    },
    {
      text: "初デートで訪れたのはどこ？",
      choices: [
        "しあわせパンケーキカフェ 星空店",
        "クリエイター博覧会「TechCraft Expo 2020」",
        "コミックフェスタ・ネオ99",
        "光波美術館（KOHHA MUSEUM OF ART）",
      ],
      correctIndex: 0,
      detail:
        "「TechCraft Expo 2020」には、ガジェット好き同士の2回目のデートで訪れました。",
    },
    {
      text: "新郎が高校時代の学園祭でバンド演奏しようとした曲は？",
      choices: [
        "『銀河トンネル行進曲』（メタルアレンジ）",
        "『完全超感フュージョン』（和楽アレンジ）",
        "『紅蓮のアルゴリズム』（ピコピコアレンジ）",
        "『小さな恋のポラリス』（ジャズアレンジ）",
      ],
      correctIndex: 0,
      detail:
        "新郎はオーディションで全力デスボイスを披露しましたが、バンドは音楽教師から「元気はいい」とだけコメントされたそうです。",
    },
  ];

  // WeddingSettings is used to override default settings
  // Set your own Google Apps Script endpoint URL here
  window.WeddingSettings = {
    APPS_SCRIPT_ENDPOINT:
      "https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec",
  };
})();
