let currentQuestionNo = 1;
const populateProgressSection = () => {
    const prizes = ['£100', '£200', '£300', '£500', '£1,000', '£2,000', '£4,000',
        '£8,000', '£16,000', '£32,000', '£64,000', '£125,000', '£250,000', '£500,000', '£1 MILLION'];
    const questionPrizeMap = prizes.map((prize, index) => ({ questionNumber: index, questionAnsweredCorrectly: false, prize }));
    const progress = document.querySelector("#progress");
    questionPrizeMap.forEach(({ questionNumber, prize }) => {
        const questionNo = questionNumber + 1;
        const doApplyHighlighting = questionNo === currentQuestionNo;
        const formattedPrize = prize.replace('Â', '');
        const question = document.createElement("div");
        const [index, amount] = [document.createElement("span"), document.createElement("span")];
        index.innerText = questionNo;
        amount.innerText = formattedPrize;
        if (doApplyHighlighting) {
            index.style.color = '#F6F2DA';
            question.classList.add("highlight");
        } else {
            question.style.color = (questionNo % 5 === 0 ? '#f2e9a7' : '#f29435');
        }
        question.appendChild(index);
        question.appendChild(amount);
        progress.appendChild(question);
    });
}
populateProgressSection();
const phoneButton = document.querySelector('#phone');
phoneButton.addEventListener("click", () => {
    console.log("Calling friend....");

});

let allQuestions = [];

const getQuestions = (difficulty) => {
    return fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`).then((data) => data.json()).then((questions) => {
        allQuestions.push(...questions.results);
    });
}
const questionSection = document.querySelector("#question");
getQuestions("easy")
.then(() => getQuestions("medium"))
.then(() => getQuestions("hard")).then(() => {
    beginGame();
});

const beginGame = () => {
    const questionNo = currentQuestionNo - 1;
    const {question, correct_answer, incorrect_answers} = allQuestions[questionNo];
    questionSection.innerText = question.replace(/&quot;/g, "'");
    const answers = [...incorrect_answers, correct_answer];
    const shuffledAnswers = shuffleAnswers(answers);
    populatesAnswers(shuffledAnswers);
}

//Fun-fact, this is called the Fisher-Yates Shuffle algorithm!
const shuffleAnswers = (answers) => {
    for(let i = answers.length -1; i > 0 ;i--){
        let j = Math.floor(Math.random() * (i+1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
}

const populatesAnswers = (answers) => {
    const answerSections = document.querySelectorAll('#answer');
    answerSections.forEach((answerSection, index) => {
        answerSection.innerText = answers[index];
    });
}



