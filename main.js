function initQuiz() {
  let questions = [];
  let currentQuestionIndex = 0;
  let correctAnswers = 0;

  // api povik - raboti
  function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=20")
      .then((response) => response.json())
      .then((data) => {
        // ovde treba funkcii
        questions = data.results;
        showStartScreen();
      })
      .catch(function (error) {
        console.log("Ima greshka:", error);
      });
  }

  function showStartScreen() {
    document
      .getElementById("startButton")
      .addEventListener("click", function () {
        location.hash = "question-1";
        document.getElementById("startScreen").style.display = "none";
        //treba funkcija za prashanja i odg - povik
        showQuestion();
      });

    document.getElementById("startScreen").style.display = "block";
  }

  function showQuestion() {
    const question = questions[currentQuestionIndex];
    const questionText = question.question;
    const answers = shuffleArray([
      ...question.incorrect_answers,
      question.correct_answer,
    ]);

    document.getElementById("question").textContent = questionText;

    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = ""; // prazno da gi izvrtam i da napram so buttons vo div

    answers.forEach((answer, index) => {
      const answerButton = document.createElement("button");
      answerButton.textContent = answer;
      answerButton.classList.add("btn", "btn-primary");
      answerButton.addEventListener("click", () => handleAnswerClick(index)); // nadvor
      answersContainer.appendChild(answerButton);
    });

    const progressBar = document.getElementById("progressBar");
    progressBar.style.width =
      ((currentQuestionIndex + 1) / questions.length) * 100 + "%";
    progressBar.setAttribute(
      "aria-valuenow",
      ((currentQuestionIndex + 1) / questions.length) * 100
    );
    progressBar.textContent =
      ((currentQuestionIndex + 1) / questions.length) * 100 + "%";

    document.getElementById("questionScreen").style.display = "block";
  }
  //da ja def handle
  function handleAnswerClick(answerIndex) {
    const question = questions[currentQuestionIndex];
    const selectedAnswer =
      question.incorrect_answers.length === answerIndex
        ? question.correct_answer
        : question.incorrect_answers[answerIndex];
    if (selectedAnswer === question.correct_answer) {
      correctAnswers++;
    }

    currentQuestionIndex++;
    //naredno
    if (currentQuestionIndex < questions.length) {
      location.hash = "question-" + (currentQuestionIndex + 1);
      showQuestion();
    } // nema
    else {
      showResultScreen();
    }
  }

  function showResultScreen() {
    document.getElementById("questionScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";
    document.getElementById("resultText").textContent =
      "You answered " +
      correctAnswers +
      " out of " +
      questions.length +
      " questions correctly.";
    localStorage.setItem("quizResult", correctAnswers);
  }

  window.addEventListener("hashchange", function () {
    const hash = location.hash;
    if (hash.startsWith("#question-")) {
      const questionIndex = parseInt(hash.substring("#question-".length));
      if (questionIndex >= 1 && questionIndex <= questions.length) {
        currentQuestionIndex = questionIndex - 1;
        showQuestion();
      }
    }
  });

  document
    .getElementById("startOverButton")
    .addEventListener("click", function () {
      localStorage.clear();
      location.reload();
    });

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  fetchQuestions();
}

document.addEventListener("DOMContentLoaded", function () {
  initQuiz();
});
