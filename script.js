let currentQuestionNo = 1;
let answerSelected = false;
let orangeWhiteColor = "#F6F2DA";
const prizes = [
  "£100",
  "£200",
  "£300",
  "£500",
  "£1,000",
  "£2,000",
  "£4,000",
  "£8,000",
  "£16,000",
  "£32,000",
  "£64,000",
  "£125,000",
  "£250,000",
  "£500,000",
  "£1 MILLION",
];
const populateProgressSection = () => {
  const questionPrizeMap = prizes.map((prize, index) => ({
    questionNumber: index,
    questionAnsweredCorrectly: false,
    prize,
  }));
  const progress = document.querySelector("#progress");
  questionPrizeMap.forEach(({ questionNumber, prize }) => {
    const questionNo = questionNumber + 1;
    const doApplyHighlighting = questionNo === currentQuestionNo;
    const formattedPrize = prize.replace("Â", "");
    const question = document.createElement("div");
    const [index, amount] = [
      document.createElement("span"),
      document.createElement("span"),
    ];
    index.innerText = questionNo;
    amount.innerText = formattedPrize;
    if (doApplyHighlighting) {
      applyHighlighting(index, question);
    } else {
      question.style.color = questionNo % 5 === 0 ? "#f2e9a7" : "#f29435";
    }
    question.appendChild(index);
    question.appendChild(amount);
    progress.appendChild(question);
  });
};

const applyHighlighting = (index, question) => {
  index.style.color = orangeWhiteColor;
  question.classList.add("highlight");
};

const updateProgressSection = () => {
  //reset the current question
  //highlight the next question
  const questionNo = currentQuestionNo - 2;
  const nextQuestionNo = currentQuestionNo - 1;
  const prizeSections = document.querySelectorAll("#progress > div");
  const nextQuestionSection = prizeSections[nextQuestionNo];
  const [nextQuestionIndex, nextQuestionAmount] = [
    nextQuestionSection.children[0],
    nextQuestionSection.children[1],
  ];
  nextQuestionAmount.style.color = "#000000";
  applyHighlighting(nextQuestionIndex, nextQuestionSection);

  const questionSection = prizeSections[questionNo];
  const [questionIndex, questionAmount] = [
    questionSection.children[0],
    questionSection.children[1],
  ];
  questionSection.classList.remove("highlight");
  questionIndex.removeAttribute("style");
  questionAmount.removeAttribute("style");
  questionSection.style.color = questionNo % 5 === 4 ? "#f2e9a7" : "#f29435";
};

populateProgressSection();
let allQuestions = [];

const getQuestions = (difficulty) => {
  return fetch(
    `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`
  )
    .then((data) => data.json())
    .then((questions) => {
      allQuestions.push(...questions.results);
    });
};

const resetAnswers = () => {
  document.querySelectorAll("#answer").forEach((answer) => {
    answer.parentElement.classList.remove("highlight");
    answer.parentElement.style.removeProperty("background-color");
    answer.parentElement.firstChild.style.color = "#f29435";
  });
  answerSelected = false;
};

const questionSection = document.querySelector("#question");
const getQuestionsAndDisplayPlayButton = (displayOutro) => {
  allQuestions = [];
  getQuestions("easy")
    .then(() => getQuestions("medium"))
    .then(() => getQuestions("hard"))
    .then(() => {
      displayPlayButton();
    })
    .then(() => {
      if (displayOutro) {
        const outro = document.createElement("p");
        const questionNo = currentQuestionNo - 1;
        let prize;
        if (questionNo < 5) prize = "£0";
        else if (questionNo < 10) prize = prizes[4];
        else prize = prizes[9];
        outro.innerText = `Game over! You've won ${prize}`;
        questionSection.appendChild(outro);
      }
    });
};

getQuestionsAndDisplayPlayButton();

const beginGame = () => {
  resetAnswers();
  populateAnswers();
};

const displayPlayButton = () => {
  const playButton = document.createElement("button");
  playButton.innerText = "Play";
  playButton.classList.add("startButton");
  playButton.addEventListener("click", () => beginGame());
  questionSection.innerText = "";
  questionSection.appendChild(playButton);
  return playButton;
};

//Fun-fact, this is called the Fisher-Yates Shuffle algorithm!
const shuffleAnswers = (answers) => {
  for (let i = answers.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
};

const checkAnswer = (selectedAnswer, correctAnswer) => {
  // firstFiveQuestionsThemeAudio.pause();
  // firstFiveQuestionsThemeAudio.currentTime = 0;
  if (currentQuestionNo > 5) {
    //play final answer
  }

  selectedAnswer.parentElement.classList.add("highlight");
  selectedAnswer.parentElement.firstChild.style.color = orangeWhiteColor;
  revealOutcome(selectedAnswer, correctAnswer);
};

const revealOutcome = (selectedAnswer, correctAnswer) => {
  revealCorrectAnswer(correctAnswer);
  if (selectedAnswer.innerText === correctAnswer) {
    playSound(true);
    setTimeout(
      () => {
        currentQuestionNo++;
        resetAnswers();
        populateAnswers();
        updateProgressSection();
      },
      currentQuestionNo >= 5 ? 8000 : 4000
    );

    //proceed to the next question
  } else {
    //It's the wrong answer dun dun dun.........
    playSound();
    getQuestionsAndDisplayPlayButton(true);
  }
};

const revealCorrectAnswer = (correctAnswer) => {
  const correctAnswerSection = Array.from(
    document.querySelectorAll("#answer")
  ).filter((answer) => answer.innerText === correctAnswer.trim())[0];
  correctAnswerSection.parentElement.classList.remove("highlight");
  correctAnswerSection.parentElement.style.backgroundColor = "#3eed4f";
};

const playSound = (isCorrectAnswer) => {
  let audioPath;
  if (currentQuestionNo == 5 && isCorrectAnswer) {
    audioPath = "assets/sounds/question 5/win.mp3";
  } else {
    audioPath = `assets/sounds/question ${
      currentQuestionNo <= 5 ? "1-5" : currentQuestionNo
    }/${isCorrectAnswer ? "win" : "lose"}.mp3`;
  }
  var audio = new Audio(audioPath);
  audio.play();
};

const populateAnswers = () => {
  const questionNo = currentQuestionNo - 1;
  const questionsThemeAudio = new Audio(
    `assets/sounds/question ${
      currentQuestionNo <= 5 ? "1-5" : currentQuestionNo
    }/question theme.mp3`
  );
  questionsThemeAudio.loop = true;
  questionsThemeAudio.play();
  const { question, correct_answer, incorrect_answers } =
    allQuestions[questionNo];
  questionSection.innerText = question.replace(/&quot;/g, "'");
  const answers = [...incorrect_answers, correct_answer];
  const shuffledAnswers = shuffleAnswers(answers);
  const answerSections = document.querySelectorAll("#answer");
  answerSections.forEach((answerSection, index) => {
    answerSection.innerText = shuffledAnswers[index];
    answerSection.parentElement.addEventListener("click", () => {
      questionsThemeAudio.pause();
      //Added this guard to prevent the player selecting a different answer selecting their original answer
      if (!answerSelected) {
        answerSelected = true;
        //Have to retrieve the correct again to ensure it doesn't load the previous correct answer
        const question = currentQuestionNo - 1;
        const correctAnswer = allQuestions[question].correct_answer;
        checkAnswer(answerSection, correctAnswer);
      }
    });
  });
};

//Lifelines

const disableLifeline = (lifelineButton) => {
  lifelineButton.setAttribute("disabled", true);
  lifelineButton.style.textDecoration = "line-through";
  lifelineButton.style.color = "#d40808";
};

const phoneButton = document.querySelector("#phone");
phoneButton.addEventListener("click", () => {
  console.log("Calling friend....");
});

const fiftyFiftyButton = document.querySelector("#fifty-fifty-lifeline-button");
fiftyFiftyButton.addEventListener("click", () => {
  const questionNo = currentQuestionNo - 1;
  const { incorrect_answers } = allQuestions[questionNo];
  const incorrectAnswerIndex = Math.floor(Math.random() * 3);
  incorrect_answers.splice(incorrectAnswerIndex, 1);

  const audio = new Audio(`assets/sounds/lifelines/5050.mp3`);
  audio.play();
  Array.from(document.querySelectorAll("#answer"))
    .filter((answer) => incorrect_answers.includes(answer.innerText.trim()))
    .forEach((incorrectAnswer) => (incorrectAnswer.innerText = ""));
  disableLifeline(fiftyFiftyButton);
});
