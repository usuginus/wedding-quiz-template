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
      lead: "ふたりの何気ない日常と小さな思い出を辿るクイズです。<br>テーブルの皆さまで相談しながらお楽しみください。",
    },
    intro: {
      steps: [
        "気軽に直感で答えてOK！難易度は控えめです。",
        "制限時間はありません。思い出を想像しながら楽しんでください。",
        "後ほど正解発表と景品のお渡しがありますので、お名前の入力をお忘れなく！",
      ],
    },
  };

  // WeddingQuestions is used to define the quiz questions
  // Set your own questions here
  window.WeddingQuestions = [
    {
      text: "ふたりが最初に出会ったきっかけは？",
      choices: [
        "友人に誘われたボードゲーム会",
        "会社の新人研修",
        "中学の同窓会で再会",
        "駅前のカフェで席が隣同士になった",
      ],
      correctIndex: 1,
      detail:
        "同期として同じ研修に参加し、休憩中の雑談をきっかけに仲良くなりました。",
      detailImage: {
        src: "img/example00.jpg",
        alt: "研修中のイメージ写真",
        caption: "最初の会話は“コーヒー苦いですね…”だったそうです。",
      },
    },
    {
      text: "初めてのデートで行った場所は？",
      choices: [
        "映画館でロマンチックコメディを鑑賞",
        "商店街のたい焼き屋さんを食べ歩き",
        "動物園でパンダを見る",
        "美術館の企画展をまわった",
      ],
      correctIndex: 0,
      detail:
        "ふたりとも映画好きで、同じ作品で同じ場面に笑ったことが距離を縮めました。",
    },
    {
      text: "太陽さんがよく作る“月子さんの好物”は？",
      choices: [
        "ふわふわ卵のオムライス",
        "具だくさんのミネストローネ",
        "特製ナポリタン",
        "手作りチーズケーキ",
      ],
      correctIndex: 2,
      detail:
        "月子さんは“ちょっと甘めの懐かしい味”のナポリタンが大好きで、記念日にもよく作ってもらっているそうです。",
    },
    {
      text: "ふたりが休日によくする過ごし方は？",
      choices: [
        "近所の公園を散歩してベンチで読書",
        "家でお菓子を焼いて映画鑑賞会",
        "雑貨屋さん巡りで小物を見る",
        "サイクリングでカフェまで遠出",
      ],
      correctIndex: 1,
      detail:
        "お菓子を焼く日はキッチンに甘い香りが広がって、そこから映画を観るのがふたりの定番コースとのことです。",
    },
    {
      text: "プロポーズの場所はどこだった？",
      choices: [
        "海の見える小さな公園",
        "お気に入りのカフェ",
        "夜景のきれいな展望台",
        "ふたりの自宅リビング",
      ],
      correctIndex: 3,
      detail:
        "いつも通りの夕食後、デザートのプリンの下に小さな手紙が隠されていました。月子さんは“まさかここ！？”と驚いたそうです。",
    },
  ];

  // WeddingSettings is used to override default settings
  // Set your own Google Apps Script endpoint URL here
  window.WeddingSettings = {
    APPS_SCRIPT_ENDPOINT:
      "https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec",
    // Set to false to hide per-question correctness and the score breakdown on the result page
    showCorrectness: true,
  };
})();
