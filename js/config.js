(() => {
  const defaultCopy = {
    documentTitle: "Welcome Quiz",
    hero: {
      eyebrow: "HAPPY WEDDING CELEBRATION",
      title: "Welcome Quiz",
      lead: "新郎新婦の歩みをたどる10問のクイズ。テーブルのみなさまで協力しながら楽しんでください。",
    },
    intro: {
      steps: [
        "質問に直感で回答していきましょう。",
        "制限時間はありません。思い出話をしながら答えを探してください。",
        "正解数に応じて景品をお渡しするため、必ずお名前を入力してください。",
      ],
    },
    playerForm: {
      label: "お名前",
      hint: "※ 景品のお渡しや集計に使用します。",
      placeholder: "例：テーブル5 山田さん",
      error: "お名前を入力してください。",
    },
    buttons: {
      start: "クイズを始める",
      submit: "回答",
      next: "次へ",
      result: "回答を提出",
      downloadResult: "結果を画像保存",
      downloadResultSaving: "保存中...",
    },
    quiz: {
      placeholder: "ここに質問が表示されます",
      progressLabelTemplate: "Question {current} / {total}",
    },
    result: {
      title: "Results",
      highlightLabel: "正解数",
      totalSeparator: " / ",
      message:
        "ご参加ありがとうございました。引き続き素敵な時間をお過ごしください。",
      playerPrefix: "プレイヤー：",
      perfectMessage: "Congratulations! 全問正解です！",
    },
    messages: {
      quizUnavailable: "問題データが未設定のため、現在クイズを開始できません。",
    },
  };

  const DEFAULT_SETTINGS = {
    showCorrectness: true,
  };

  const userCopy = typeof window !== "undefined" ? window.WeddingCopy : null;
  const mergedCopy = mergeDeep(defaultCopy, userCopy || {});
  const resolvedCopy = mergedCopy;
  const DEFAULT_ENDPOINT =
    "https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXX/exec";
  const userSettings =
    typeof window !== "undefined" ? window.WeddingSettings : null;
  const mergedSettings = mergeDeep(DEFAULT_SETTINGS, userSettings || {});

  const endpointOverride =
    typeof window !== "undefined"
      ? window.GOOGLE_APPS_SCRIPT_ENDPOINT
      : undefined;

  const APPS_SCRIPT_ENDPOINT =
    endpointOverride && endpointOverride.length > 0
      ? endpointOverride
      : (userSettings && userSettings.APPS_SCRIPT_ENDPOINT) || DEFAULT_ENDPOINT;

  const WeddingConfig = Object.freeze({
    copy: resolvedCopy,
    APPS_SCRIPT_ENDPOINT,
    showCorrectness: mergedSettings.showCorrectness !== false,
  });

  if (typeof window !== "undefined") {
    window.WeddingConfig = WeddingConfig;
  }

  function mergeDeep(target, source) {
    if (!source) {
      return target;
    }
    const output = Array.isArray(target) ? [...target] : { ...target };
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target ? target[key] : undefined;
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        output[key] = mergeDeep(targetValue, sourceValue);
      } else {
        output[key] = sourceValue;
      }
    });
    return output;
  }

  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }
})();
