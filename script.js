let currentQuestionNo = 1;
let orangeWhiteColor = "#F6F2DA";
const populateProgressSection = () => {
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
      index.style.color = orangeWhiteColor;
      question.classList.add("highlight");
    } else {
      question.style.color = questionNo % 5 === 0 ? "#f2e9a7" : "#f29435";
    }
    question.appendChild(index);
    question.appendChild(amount);
    progress.appendChild(question);
  });
};
populateProgressSection();
const phoneButton = document.querySelector("#phone");
phoneButton.addEventListener("click", () => {
  console.log("Calling friend....");
});

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
const questionSection = document.querySelector("#question");
getQuestions("easy")
  .then(() => getQuestions("medium"))
  .then(() => getQuestions("hard"))
  .then(() => {
    const playButton = document.createElement("button");
    playButton.innerText = "Play";
    playButton.classList.add("startButton");
    playButton.addEventListener("click", () => beginGame());
    document.querySelector("#question").appendChild(playButton);
  });
var firstFiveQuestionsThemeAudio = new Audio("assets/sounds/question 1-5/question theme.mp3");
firstFiveQuestionsThemeAudio.loop = true;
const beginGame = () => {
  firstFiveQuestionsThemeAudio.play();
  const questionNo = currentQuestionNo - 1;
  const { question, correct_answer, incorrect_answers } =
    allQuestions[questionNo];
  questionSection.innerText = question.replace(/&quot;/g, "'");
  const answers = [...incorrect_answers, correct_answer];
  const shuffledAnswers = shuffleAnswers(answers);
  populateAnswers(shuffledAnswers, correct_answer);
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
  firstFiveQuestionsThemeAudio.pause();
  firstFiveQuestionsThemeAudio.currentTime = 0;
  if(currentQuestionNo > 5){
    //play final answer
  }
  setTimeout(() => {
    console.log("Stop the music and reveal the actual answer NOW!");
  }, 3000);
  selectedAnswer.parentElement.classList.add("highlight");
  selectedAnswer.parentElement.firstChild.style.color = orangeWhiteColor;
  revealOutcome(selectedAnswer, correctAnswer);

};

const revealOutcome = (selectedAnswer, correctAnswer) => {
  if (selectedAnswer.innerText === correctAnswer) {
    playSound(true);
    //proceed to the next question
  } else {
    //It's the wrong answer dun dun dun.........
    playSound();
  }
  const correctAnswerSection = Array.from(document.querySelectorAll("#answer")).filter((answer) => answer.innerText === correctAnswer)[0];
  correctAnswerSection.parentElement.classList.remove("highlight");
  correctAnswerSection.parentElement.style.backgroundColor = '#3eed4f';
}

const playSound = (isCorrectAnswer) => {
  var audioPath = `assets/sounds/question ${currentQuestionNo <= 5 ? "1-5" : currentQuestionNo}/${isCorrectAnswer ? "win" : "lose"}.mp3`; 
  var audio = new Audio(audioPath);
  audio.play();
}

const populateAnswers = (answers, correctAnswer) => {
  const answerSections = document.querySelectorAll("#answer");
  answerSections.forEach((answerSection, index) => {
    answerSection.innerText = answers[index];
    answerSection.parentElement.addEventListener("click", () =>
      checkAnswer(answerSection, correctAnswer)
    );
  });
};
