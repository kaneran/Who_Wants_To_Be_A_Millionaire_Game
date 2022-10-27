const populateProgressSection = () => {
    let currentQuestionNo = 1;
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


const getQuestions = (difficulty) => {
    const request = new XMLHttpRequest();
    const url = `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`;
    request.open("GET", url);
    request.send();

    request.onreadystatechange = (e) => {
        const { results } = JSON.parse(request.responseText);
        console.log(results);
    }
    request
}

getQuestions("easy");
getQuestions("medium");
getQuestions("hard");
