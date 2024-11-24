let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let quizStarted = false;

// Frage laden
const loadQuiz = async (quizId) => {
    try {
        const response = await fetch('quizquestions.json');
        const data = await response.json();
        
        // Überprüfen, ob das gewählte Quiz existiert
        questions = data.quizzes[quizId].questions; // Das richtige Quiz wird basierend auf der Auswahl geladen
        
        if (questions && questions.length > 0) {
            if (quizStarted) {
                showQuestion();
            }
        } else {
            console.error("Keine Fragen für das gewählte Quiz gefunden.");
        }
    } catch (error) {
        console.error("Error loading quiz questions:", error);
    }
};

// Start Screen - Quiz starten
document.getElementById('start-button').addEventListener('click', () => {
    const quizSelection = document.getElementById('quiz-selection').value;
    
    // Startbildschirm ausblenden und Quiz-Bereich einblenden
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    quizStarted = true;

    loadQuiz(quizSelection); // Das Quiz basierend auf der Auswahl des Nutzers laden
});

// Frage anzeigen
const showQuestion = () => {
    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const confirmButton = document.getElementById('confirm-button');

    questionElement.textContent = question.question;
    optionsContainer.innerHTML = '';

    // Antwortoptionen als Checkboxen hinzufügen
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

    nextButton.style.display = 'none'; // Verstecke den "Next"-Button zu Beginn
    confirmButton.style.display = 'inline-block'; // Zeige den "Confirm Answer"-Button an
};

// Antwort überprüfen und markieren
const checkAnswer = () => {
    const question = questions[currentQuestionIndex];
    const selectedOptions = Array.from(document.querySelectorAll('#options-container input:checked'))
        .map(checkbox => checkbox.value);

    const correctAnswers = question.answer;
    let isCorrect = selectedOptions.every(option => correctAnswers.includes(option)) && selectedOptions.length === correctAnswers.length;

    // Markiere die Antworten
    const optionElements = document.querySelectorAll('#options-container .option');
    
    optionElements.forEach(optionElement => {
        const checkbox = optionElement.querySelector('input');
        const label = optionElement.querySelector('label');
        const isSelected = checkbox.checked;
        
        if (correctAnswers.includes(checkbox.value)) {
            optionElement.classList.add('correct-answer');
        } else if (isSelected) {
            optionElement.classList.add('wrong-answer');
        }
    });

    if (isCorrect) {
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
    }

    // Zeige den "Next"-Button, wenn die Antwort überprüft wurde
    document.getElementById('next-button').style.display = 'inline-block';
    document.getElementById('confirm-button').style.display = 'none'; // Verstecke den Bestätigen-Button
};

// Zum nächsten Frage gehen
const nextQuestion = () => {
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
    document.getElementById('score').textContent = `Score: 0`;
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
};

// Neustarten des Quiz
document.getElementById('restart-button').addEventListener('click', () => {
    resetQuiz();
    quizStarted = false;
    loadQuiz();
});

// Zum Startbildschirm zurückkehren
document.getElementById('home-button').addEventListener('click', () => {
    resetQuiz();
    quizStarted = false;
    loadQuiz();
});

// "Next"-Button Eventlistener
document.getElementById('next-button').addEventListener('click', nextQuestion);

// "Confirm"-Button Eventlistener
document.getElementById('confirm-button').addEventListener('click', checkAnswer);

// Quiz starten
loadQuiz();
