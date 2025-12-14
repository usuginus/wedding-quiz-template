(() => {
  const config = window.WeddingConfig || {};
  const questions = Array.isArray(window.WeddingQuestions)
    ? window.WeddingQuestions
    : [];
  const services = window.WeddingServices || {};
  const showCorrectness = config.showCorrectness !== false;
  const copy = config.copy || {};
  const heroCopy = copy.hero || {};
  const introCopy = copy.intro || {};
  const playerFormCopy = copy.playerForm || {};
  const buttonCopy = copy.buttons || {};
  const quizCopy = copy.quiz || {};
  const resultCopy = copy.result || {};
  const messageCopy = copy.messages || {};

  const totalQuestions = questions.length;
  const dom = {};
  const state = createInitialState();

  ready(init);

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function init() {
    cacheDom();
    applyStaticCopy();
    bindEvents();
    toggleQuizAvailability(totalQuestions > 0);
  }

  function cacheDom() {
    dom.introCard = $("#intro-card");
    dom.quizCard = $("#quiz-card");
    dom.resultCard = $("#result-card");
    dom.heroEyebrow = $("#hero-eyebrow");
    dom.heroTitle = $("#hero-title");
    dom.heroLead = $("#hero-lead");
    dom.introHeading = $("#intro-heading");
    dom.introStepsList = $("#intro-steps");
    dom.playerForm = $("#player-form");
    dom.startBtn = $("#start-btn");
    dom.submitBtn = $("#submit-btn");
    dom.nextBtn = $("#next-btn");
    dom.playerNameInput = $("#player-name");
    dom.playerNameError = $("#player-name-error");
    dom.playerNameLabel = $("#player-name-label");
    dom.playerNameHint = $("#player-name-hint");
    dom.questionText = $("#question-text");
    dom.choicesList = $("#choices-list");
    dom.questionDetail = $("#question-detail");
    dom.progressIndex = $("#progress-index");
    dom.progressBar = $("#progress-bar");
    dom.scoreOutput = $("#score-output");
    dom.correctOutput = $("#correct-output");
    dom.perfectMessage = $("#perfect-message");
    dom.resultPlayer = $("#result-player");
    dom.resultMessage = $("#result-message");
    dom.resultTitle = $("#result-title");
    dom.resultHighlightLabel = $("#result-highlight-label");
    dom.resultTotalSeparator = $("#result-total-separator");
    dom.resultHighlight = $(".result-highlight");
    dom.answerReview = $("#answer-review");
    dom.downloadBtn = $("#download-result-btn");
    dom.quizUnavailable = createQuizUnavailableNotice();
  }

  function bindEvents() {
    dom.playerNameInput?.addEventListener("input", resetPlayerNameValidation);
    dom.playerForm?.addEventListener("submit", handlePlayerFormSubmit);
    dom.startBtn?.addEventListener("click", handleStartQuiz);
    dom.submitBtn?.addEventListener("click", handleSubmit);
    dom.nextBtn?.addEventListener("click", handleNextQuestion);
    dom.downloadBtn?.addEventListener("click", handleDownloadResult);
  }

  function handlePlayerFormSubmit(event) {
    event.preventDefault();
    if (dom.startBtn?.disabled) {
      return;
    }
    handleStartQuiz();
  }

  function handleStartQuiz() {
    const name = (dom.playerNameInput?.value || "").trim();
    if (!name) {
      dom.playerNameInput?.classList.add("player-form__input--invalid");
      dom.playerNameError?.classList.remove("hidden");
      dom.playerNameInput?.focus();
      return;
    }

    state.playerName = name;
    state.quizStartedAt = new Date();

    hide(dom.introCard);
    hide(dom.resultCard);
    show(dom.quizCard);

    resetState();
    renderQuestion();
  }

  function handleSubmit() {
    if (!state.hasAnswered && state.selectedChoiceIndex !== null) {
      submitAnswer();
    }
  }

  function handleNextQuestion() {
    if (!state.hasAnswered) {
      return;
    }

    state.currentIndex += 1;
    if (state.currentIndex < totalQuestions) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function resetPlayerNameValidation() {
    dom.playerNameInput?.classList.remove("player-form__input--invalid");
    dom.playerNameError?.classList.add("hidden");
  }

  function resetState() {
    Object.assign(state, createInitialState(), {
      playerName: state.playerName,
      quizStartedAt: state.quizStartedAt,
    });
  }

  function renderQuestion() {
    state.hasAnswered = false;
    state.selectedChoiceIndex = null;
    state.choiceButtons = [];

    const currentQuestion = questions[state.currentIndex];
    if (!currentQuestion) {
      console.warn("Question data is missing for index", state.currentIndex);
      showResult();
      return;
    }

    const progressRatio =
      totalQuestions > 0 ? (state.currentIndex / totalQuestions) * 100 : 0;
    dom.progressIndex.textContent = formatProgressLabel(
      state.currentIndex + 1,
      totalQuestions
    );
    dom.progressBar.style.width = `${progressRatio}%`;

    dom.questionText.textContent = currentQuestion.text;
    dom.questionDetail.innerHTML = "";
    dom.questionDetail.classList.add("hidden");
    dom.choicesList.innerHTML = "";

    currentQuestion.choices.forEach((choice, idx) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.textContent = choice;
      button.dataset.index = String(idx);
      button.addEventListener("click", () => handleChoiceSelection(idx));

      const listItem = document.createElement("li");
      listItem.appendChild(button);
      dom.choicesList.appendChild(listItem);
      state.choiceButtons.push(button);
    });

    dom.submitBtn.disabled = true;
    dom.nextBtn.disabled = true;
    const isLastQuestion = state.currentIndex === totalQuestions - 1;
    const nextButtonText = isLastQuestion
      ? buttonCopy.result || buttonCopy.next || ""
      : buttonCopy.next || "";
    dom.nextBtn.textContent = nextButtonText;
  }

  function handleChoiceSelection(idx) {
    if (state.hasAnswered) {
      return;
    }

    state.selectedChoiceIndex = idx;
    state.choiceButtons.forEach((button, buttonIdx) => {
      if (!button.disabled) {
        button.classList.toggle("choice--selected", buttonIdx === idx);
      }
    });
    dom.submitBtn.disabled = false;
  }

  function submitAnswer() {
    state.hasAnswered = true;
    const currentQuestion = questions[state.currentIndex];
    const isCorrect =
      state.selectedChoiceIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      state.score += 1;
    }

    state.choiceButtons.forEach((button, idx) => {
      button.disabled = true;
      if (showCorrectness) {
        button.classList.remove("choice--selected");
        if (idx === currentQuestion.correctIndex) {
          button.classList.add("choice--correct");
        } else if (idx === state.selectedChoiceIndex) {
          button.classList.add("choice--incorrect");
        }
      } else {
        button.classList.toggle(
          "choice--selected",
          idx === state.selectedChoiceIndex
        );
      }
    });

    state.history.push({
      question: currentQuestion,
      selectedIndex: state.selectedChoiceIndex,
      correctIndex: currentQuestion.correctIndex,
      isCorrect,
    });

    if (showCorrectness) {
      renderQuestionDetail(currentQuestion);
    } else {
      hide(dom.questionDetail);
      dom.questionDetail.innerHTML = "";
    }
    dom.submitBtn.disabled = true;
    dom.nextBtn.disabled = false;
  }

  function renderQuestionDetail(question) {
    dom.questionDetail.innerHTML = "";

    const { detail, detailImage } = question;
    if (!detail && !detailImage) {
      dom.questionDetail.classList.add("hidden");
      return;
    }

    if (detail) {
      const detailText = document.createElement("p");
      detailText.textContent = detail;
      dom.questionDetail.appendChild(detailText);
    }

    if (detailImage) {
      const figure = document.createElement("figure");
      figure.className = "question-detail__figure";

      const image = document.createElement("img");
      image.className = "question-detail__image";

      if (typeof detailImage === "string") {
        image.src = detailImage;
        image.alt = "";
      } else {
        image.src = detailImage.src;
        image.alt = detailImage.alt || "";
      }
      figure.appendChild(image);

      const captionText =
        typeof detailImage === "object" && "caption" in detailImage
          ? detailImage.caption
          : null;
      if (captionText) {
        const caption = document.createElement("figcaption");
        caption.className = "question-detail__caption";
        caption.textContent = captionText;
        figure.appendChild(caption);
      }

      dom.questionDetail.appendChild(figure);
    }

    dom.questionDetail.classList.remove("hidden");
  }

  function showResult() {
    hide(dom.quizCard);
    show(dom.resultCard);

    if (state.playerName) {
      dom.resultPlayer.textContent = `${resultCopy.playerPrefix || ""}${
        state.playerName
      }`;
      dom.resultPlayer.classList.remove("hidden");
    } else {
      dom.resultPlayer.classList.add("hidden");
    }

    const isPerfect = state.score === totalQuestions;
    dom.resultCard.classList.toggle(
      "result-card--perfect",
      isPerfect && showCorrectness
    );
    if (showCorrectness) {
      dom.scoreOutput.textContent = String(totalQuestions);
      dom.correctOutput.textContent = String(state.score);
      dom.perfectMessage?.classList.toggle("hidden", !isPerfect);
      show(dom.resultHighlight);
    } else {
      hide(dom.resultHighlight);
      hide(dom.perfectMessage);
    }

    dom.progressBar.style.width = "100%";
    dom.progressIndex.textContent = formatProgressLabel(
      totalQuestions,
      totalQuestions
    );

    renderAnswerReview();

    if (typeof services.submitScoreToAppsScript === "function") {
      const answers = state.history
        .map((entry) =>
          entry.selectedIndex === null || entry.selectedIndex === undefined
            ? ""
            : String(entry.selectedIndex)
        )
        .join(",");
      services.submitScoreToAppsScript({
        name: state.playerName,
        score: state.score,
        questionCount: totalQuestions,
        answers,
        startedAt: state.quizStartedAt,
        completedAt: new Date(),
        isPerfect,
      });
    }
  }

  function renderAnswerReview() {
    if (!dom.answerReview) {
      return;
    }

    dom.answerReview.innerHTML = "";
    if (!state.history.length) {
      dom.answerReview.classList.add("hidden");
      return;
    }

    dom.answerReview.classList.remove("hidden");

    const list = document.createElement("ol");
    list.className = "answer-review__list";

    state.history.forEach((entry, index) => {
      const item = document.createElement("li");
      item.className = "answer-review__item";
      if (showCorrectness) {
        item.classList.add(
          entry.isCorrect
            ? "answer-review__item--correct"
            : "answer-review__item--incorrect"
        );
      }

      const questionText = document.createElement("p");
      questionText.className = "answer-review__question";
      questionText.textContent = entry.question.text;
      item.appendChild(questionText);

      const selectedChoice =
        entry.selectedIndex !== null
          ? entry.question.choices[entry.selectedIndex]
          : "未回答";
      const selectedText = document.createElement("p");
      selectedText.className = "answer-review__selected";
      selectedText.textContent = selectedChoice;
      item.appendChild(selectedText);
      list.appendChild(item);
    });

    dom.answerReview.appendChild(list);
  }

  function applyStaticCopy() {
    if (copy.documentTitle) {
      document.title = copy.documentTitle;
    }
    assignText(dom.heroEyebrow, heroCopy.eyebrow);
    assignText(dom.heroTitle, heroCopy.title);
    assignHTML(dom.heroLead, heroCopy.lead);
    toggleIntroHeading();
    populateIntroSteps();
    assignText(dom.playerNameLabel, playerFormCopy.label);
    assignText(dom.playerNameHint, playerFormCopy.hint);
    assignText(dom.playerNameError, playerFormCopy.error);
    assignPlaceholder(dom.playerNameInput, playerFormCopy.placeholder);
    assignText(dom.startBtn, buttonCopy.start);
    assignText(dom.submitBtn, buttonCopy.submit);
    assignText(dom.nextBtn, buttonCopy.next);
    assignText(dom.downloadBtn, buttonCopy.downloadResult);
    assignText(dom.resultTitle, resultCopy.title);
    assignText(dom.resultHighlightLabel, resultCopy.highlightLabel);
    assignText(dom.resultTotalSeparator, resultCopy.totalSeparator);
    assignText(dom.perfectMessage, resultCopy.perfectMessage);
    assignHTML(dom.resultMessage, resultCopy.message);
    assignText(dom.questionText, quizCopy.placeholder);
    dom.progressIndex.textContent = formatProgressLabel(0, totalQuestions);
    dom.progressBar.style.width = "0%";
    dom.correctOutput.textContent = "0";
    dom.scoreOutput.textContent = String(totalQuestions);
    if (!showCorrectness) {
      hide(dom.resultHighlight);
      hide(dom.perfectMessage);
    }
    if (dom.answerReview) {
      dom.answerReview.innerHTML = "";
      dom.answerReview.classList.add("hidden");
    }
  }

  function toggleQuizAvailability(isAvailable) {
    if (!dom.startBtn) return;

    if (isAvailable) {
      dom.startBtn.removeAttribute("disabled");
      hide(dom.quizUnavailable);
    } else {
      dom.startBtn.setAttribute("disabled", "disabled");
      if (dom.quizUnavailable) {
        show(dom.quizUnavailable);
      } else if (messageCopy.quizUnavailable && dom.introCard) {
        dom.quizUnavailable = createQuizUnavailableNotice();
        show(dom.quizUnavailable);
      }
    }
  }

  function createQuizUnavailableNotice() {
    if (totalQuestions > 0 || !messageCopy.quizUnavailable) {
      return null;
    }

    const notice = document.createElement("p");
    notice.className = "player-form__error";
    notice.textContent = messageCopy.quizUnavailable;
    if (dom.introCard) {
      dom.introCard.insertBefore(notice, dom.introCard.firstChild);
    }
    return notice;
  }

  function createInitialState() {
    return {
      currentIndex: 0,
      score: 0,
      hasAnswered: false,
      selectedChoiceIndex: null,
      choiceButtons: [],
      playerName: "",
      quizStartedAt: null,
      history: [],
    };
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function show(element) {
    element?.classList.remove("hidden");
  }

  function hide(element) {
    element?.classList.add("hidden");
  }

  function assignText(element, value) {
    if (element && value !== undefined && value !== null) {
      element.textContent = value;
    }
  }

  function assignHTML(element, value) {
    if (element && value !== undefined && value !== null) {
      element.innerHTML = value;
    }
  }

  function assignPlaceholder(input, value) {
    if (input && value) {
      input.placeholder = value;
    }
  }

  function populateIntroSteps() {
    if (!dom.introStepsList) {
      return;
    }
    dom.introStepsList.innerHTML = "";
    if (Array.isArray(introCopy.steps)) {
      introCopy.steps.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        dom.introStepsList.appendChild(li);
      });
    }
  }

  function toggleIntroHeading() {
    if (!dom.introHeading) {
      return;
    }
    const hasHeading = Boolean(introCopy.heading);
    assignText(dom.introHeading, hasHeading ? introCopy.heading : "");
    dom.introHeading.classList.toggle("hidden", !hasHeading);
    dom.introHeading.setAttribute("aria-hidden", String(!hasHeading));
    if (dom.introCard) {
      if (hasHeading) {
        dom.introCard.setAttribute(
          "aria-labelledby",
          dom.introHeading.id || "intro-heading"
        );
      } else {
        dom.introCard.removeAttribute("aria-labelledby");
      }
    }
  }

  async function handleDownloadResult() {
    if (!dom.resultCard || !window.html2canvas) {
      console.warn("html2canvas is not available; cannot download result.");
      return;
    }

    const savingLabel = buttonCopy.downloadResultSaving || "saving...";
    const button = dom.downloadBtn;
    const previousText = button ? button.textContent : null;
    if (button) {
      button.disabled = true;
      button.textContent = savingLabel;
    }

    try {
      const canvas = await window.html2canvas(dom.resultCard, {
        scale: 2,
        backgroundColor: null,
      });
      const blob = await canvasToBlob(canvas);
      const fileName = "quiz-result.png";

      if (canUseDownloadAttribute()) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } else if (canShareFile(blob)) {
        const file = new File([blob], fileName, { type: blob.type });
        await navigator.share({ files: [file] });
      } else {
        const fallbackUrl = URL.createObjectURL(blob);
        window.open(fallbackUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(fallbackUrl), 4000);
      }
    } catch (error) {
      console.error("failed to download result", error);
    } finally {
      if (button) {
        button.disabled = false;
        if (previousText !== null) {
          button.textContent = previousText;
        }
      }
    }
  }

  function formatProgressLabel(current, total) {
    const template =
      quizCopy.progressLabelTemplate || "Question {current} / {total}";
    return template.replace("{current}", current).replace("{total}", total);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        },
        "image/png",
        0.95
      );
    });
  }

  function canUseDownloadAttribute() {
    return "download" in HTMLAnchorElement.prototype;
  }

  function canShareFile(blob) {
    if (!navigator.canShare) {
      return false;
    }
    const file = new File([blob], "result.png", { type: blob.type });
    return navigator.canShare({ files: [file] });
  }
})();
