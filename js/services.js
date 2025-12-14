(() => {
  const config = window.WeddingConfig || {};
  const { APPS_SCRIPT_ENDPOINT } = config;

  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 500;

  function submitScoreToAppsScript({
    name,
    score,
    questionCount,
    answers,
    startedAt,
    completedAt,
    isPerfect,
  }) {
    if (
      !name ||
      !APPS_SCRIPT_ENDPOINT ||
      APPS_SCRIPT_ENDPOINT.includes("XXXXXXXX")
    ) {
      return Promise.resolve();
    }

    const payload = {
      name,
      score,
      questionCount,
      answers,
      percentage:
        typeof score === "number" &&
        typeof questionCount === "number" &&
        questionCount
          ? Math.round((score / questionCount) * 100)
          : null,
      startedAt: startedAt ? new Date(startedAt).toISOString() : null,
      completedAt: completedAt ? new Date(completedAt).toISOString() : null,
      isPerfect,
    };

    return submitWithRetry(payload, 0);
  }

  function submitWithRetry(payload, attempt) {
    return fetch(APPS_SCRIPT_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      const nextAttempt = attempt + 1;
      if (nextAttempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        return wait(delay).then(() => submitWithRetry(payload, nextAttempt));
      }
      console.warn("Apps Script score submission failed after retries", error);
    });
  }

  function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  function getAppsScriptEndpoint() {
    return APPS_SCRIPT_ENDPOINT;
  }

  window.WeddingServices = {
    submitScoreToAppsScript,
    getAppsScriptEndpoint,
  };
})();
