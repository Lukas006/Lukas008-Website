let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let selectedQuiz = null;

// Quiz laden
const loadQuiz = async (quizId) => {
    try {
        const response = await fetch('quizquestions.json');
        const data = await response.json();

        // Finde das gewählte Quiz
        const quiz = data.quizzes.find(q => q.id === quizId);
        if (quiz) {
            questions = quiz.questions;
            document.getElementById('quiz-title').textContent = quiz.title;
            showQuestion();
        } else {
            console.error("Quiz nicht gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Quiz-Daten:", error);
    }
};

// Fragen anzeigen
const showQuestion = () => {
    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');

    questionElement.textContent = question.question;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `option${index}`;
        checkbox.value = option;

        const label = document.createElement('label');
        label.setAttribute('for', `option${index}`);
        label.textContent = option;

        optionElement.appendChild(checkbox);
        optionElement.appendChild(label);
        optionsContainer.appendChild(optionElement);
    });
};

// Antwort überprüfen
const checkAnswer = () => {
    const question = questions[currentQuestionIndex];
    const selectedOptions = Array.from(document.querySelectorAll('#options-container input:checked'))
        .map(checkbox => checkbox.value);

    const correctAnswers = question.answer;

    // Markiere richtige und falsche Antworten
    const optionElements = document.querySelectorAll('#options-container .option');
    optionElements.forEach(optionElement => {
        const checkbox = optionElement.querySelector('input');
        const label = optionElement.querySelector('label');
        
        if (correctAnswers.includes(checkbox.value)) {
            optionElement.classList.add('correct-answer');
        } else if (checkbox.checked) {
            optionElement.classList.add('wrong-answer');
        }
    });

    // Punkte erhöhen, wenn die Antwort korrekt ist
    if (
        selectedOptions.every(option => correctAnswers.includes(option)) &&
        selectedOptions.length === correctAnswers.length
    ) {
        score++;
        document.getElementById('score').textContent = `Punktestand: ${score}`;
    }
};

// Nächste Frage
const nextQuestion = () => {
    checkAnswer();
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endGame();
    }
};

// Spiel beenden
const endGame = () => {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('final-score').textContent = score;
};

// Quiz zurücksetzen
const resetQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = `Punktestand: 0`;
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
};

// Event Listener für Buttons
document.getElementById('home-button').addEventListener('click', resetQuiz);
document.getElementById('next-button').addEventListener('click', nextQuestion);
document.getElementById('restart-button').addEventListener('click', () => {
    resetQuiz();
    loadQuiz(selectedQuiz);
});
document.getElementById('start-button').addEventListener('click', () => {
    selectedQuiz = document.getElementById('quiz-selection').value;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    loadQuiz(selectedQuiz);
});

// Quiz-Auswahl laden
const loadQuizSelection = async () => {
    try {
        const response = await fetch('quizquestions.json');
        const data = await response.json();

        const quizSelect = document.getElementById('quiz-selection');
        data.quizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz.id;
            option.textContent = quiz.title;
            quizSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Quiz-Auswahl:", error);
    }
};

// Lade Quiz-Auswahl beim Start
loadQuizSelection();
