const prizes = ['£100', '£200', '£300', '£500', '£1,000', '£2,000', '£4,000', 
'£8,000', '£16,000', '£32,000', '£64,000', '£125,000', '£250,000', '£500,000', '£1 MILLION'];
const questionPrizeMap = prizes.map((prize, index) => ({questionNumber: index, questionAnsweredCorrectly: false, prize}));
const progress = document.querySelector("#progress");
questionPrizeMap.forEach(({questionNumber, prize}) => {
    const questionNo = questionNumber + 1;
    const formattedPrize = prize.replace('Â', '');
    const question = document.createElement("p");
    question.innerText = `${questionNo} ${formattedPrize}`;
    question.style.color = questionNo % 5 === 0 ? '#f2e9a7' : '#f29435';
    progress.appendChild(question);
});

const phoneButton = document.querySelector('#phone');
phoneButton.addEventListener("click", () => {
    console.log("Calling friend....");
})