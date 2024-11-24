let gameContainer = document.querySelector('.game-container');
let startScreen = document.querySelector('.start-screen');
let gameOverScreen = document.querySelector('.game-over-screen');
let scoreElement = document.getElementById('score');
let finalScoreElement = document.getElementById('finalScore');
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let gameInterval, difficulty = 'easy', snakeSpeed = 100;

// Snake variables
let snake = [{ x: 9, y: 9 }];
let direction = 'right';
let food = { x: 5, y: 5 };
let score = 0;
let points = []; // Array for blue points

// Difficulty settings
const gameSettings = {
    easy: { speed: 200, points: 5 },
    medium: { speed: 100, points: 3 },
    hard: { speed: 50, points: 1 }
};

// Game functions
function startGame() {
    snake = [{ x: 9, y: 9 }];
    direction = 'right';
    food = { x: 5, y: 5 };
    score = 0;
    points = [];  // Reset blue points
    scoreElement.textContent = 'Score: 0';
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'block';

    gameInterval = setInterval(gameLoop, snakeSpeed);
    spawnPoints();  // Spawn blue points at the start
}

function gameLoop() {
    moveSnake();
    checkCollision();
    checkPointCollision();
    drawGame();
}

function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'right') head.x += 1;
    if (direction === 'left') head.x -= 1;
    if (direction === 'up') head.y -= 1;
    if (direction === 'down') head.y += 1;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        spawnFood();
    } else {
        snake.pop();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20));

    // Draw food (red)
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

    // Draw points (lilac squares)
    ctx.fillStyle = '#9b59b6';  // Set to lilac color
    points.forEach(point => {
        // Draw lilac points as rectangles
        ctx.fillRect(point.x * 20, point.y * 20, 20, 20); // 20x20 is the size of the point
    });
}

function checkCollision() {
    // Check for wall collisions
    let head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20) {
        endGame();
    }

    // Check for collisions with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function checkPointCollision() {
    let head = snake[0];
    points = points.filter(point => {
        if (point.x === head.x && point.y === head.y) {
            score += 1;
            scoreElement.textContent = `Score: ${score}`;
            point.size += 2; // Make the point bigger
            snake.push({ ...snake[snake.length - 1] }); // Snake grows when it eats a blue point
            return false; // Remove the point once eaten
        }
        return true;
    });
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
}

function spawnPoints() {
    let maxPoints = gameSettings[difficulty].points;
    for (let i = 0; i < maxPoints; i++) {
        points.push({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
            size: 5 // Initial size of points
        });
    }
}

function endGame() {
    clearInterval(gameInterval);
    finalScoreElement.textContent = `Final Score: ${score}`;
    gameContainer.style.display = 'none';
    gameOverScreen.style.display = 'block';
}

document.getElementById('easy').addEventListener('click', function () {
    difficulty = 'easy';
    snakeSpeed = gameSettings.easy.speed;
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

document.getElementById('medium').addEventListener('click', function () {
    difficulty = 'medium';
    snakeSpeed = gameSettings.medium.speed;
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

document.getElementById('hard').addEventListener('click', function () {
    difficulty = 'hard';
    snakeSpeed = gameSettings.hard.speed;
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

document.getElementById('restart').addEventListener('click', function () {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    startGame();
});

// Home button to return to the Start Screen
document.getElementById('home').addEventListener('click', function () {
    startScreen.style.display = 'block';
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'none';
});

// Keyboard events for controlling the snake
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});
