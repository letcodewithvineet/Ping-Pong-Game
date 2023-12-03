// DOM elements
const bar1 = document.getElementById("bar-1");
const bar2 = document.getElementById("bar-2");
const ball = document.getElementById("ball");
const movement = 20;
const startButton = document.getElementById('start-button');

// Constants
const thisBar1 = "Rod-1";
const thisBar2 = "Rod-2";
const storeName = "abc";
const storeScore = 123;

// Variables
let whichBar;
let moveX = 2;
let moveY = 2;
let ballMoving;
let border = 12;
let score;
let highScore;
let gameStart = false;

// Set initial high score and player
localStorage.setItem(storeScore, "null");
localStorage.setItem(storeScore, "null");

// Event listener for touch events
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

// Function to handle touch start events
function handleTouchStart(event) {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    moveBar(touchX > window.innerWidth / 2 ? movement : -movement);
}

// Function to handle touch move events
function handleTouchMove(event) {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    moveBar(touchX > window.innerWidth / 2 ? movement : -movement);
}


// Event listener for the "Start" button
startButton.addEventListener('click', () => {
    if (!gameStart) {
        gameStart = true;
        startGame();
        startButton.style.display = 'none'; // Hide the Start button
    }
});

// Initialization function using IIFE
(function () {
    highScore = localStorage.getItem(storeScore);
    whichBar = localStorage.getItem(storeName);

    if (whichBar === "null" || highScore === "null") {
        alert("Hello.. This is your first game");
        highScore = 0;
        whichBar = thisBar1;
    } else {
        alert(whichBar + " has the maximum score of " + highScore * 100);
    }

    gameReset(whichBar);
})();

// Function to reset the game
function gameReset(barName) {
    bar1.style.left = ((window.innerWidth - bar1.offsetWidth) / 2) + "px";
    bar2.style.left = ((window.innerWidth - bar2.offsetWidth) / 2) + "px";
    ball.style.left = ((window.innerWidth - ball.offsetWidth) / 2) + "px";

    if (barName === thisBar1) {
        ball.style.top = bar2.getBoundingClientRect().y - bar2.getBoundingClientRect().height + "px";
        moveY = -2;
    } else if (barName === thisBar2) {
        ball.style.top = bar1.getBoundingClientRect().height + "px";
        moveY = 2;
    }

    score = 0;
    gameStart = false;
}

// Event listener for keydown events
document.addEventListener('keydown', function (event) {
    // Move the bars using 'a' and 'd' keys
    if (event.keyCode == 68 || event.keyCode == 39) {
        if (parseInt(bar1.style.left) < (window.innerWidth - bar1.offsetWidth - border)) {
            bar1.style.left = parseInt(bar1.style.left) + movement + 'px';
            bar2.style.left = bar1.style.left;
        }
    }

    if (event.keyCode == 65 || event.keyCode == 37) {
        if (parseInt(bar1.style.left) > border) {
            bar1.style.left = parseInt(bar1.style.left) - movement + 'px';
            bar2.style.left = bar1.style.left;
        }
    }

    // Start the game on 'Enter' key
    if (event.keyCode == 13) {
        if (!gameStart) {
            gameStart = true;
            startGame();
        }
    }
});

// Function to start the game
function startGame() {
    let ballRect = ball.getBoundingClientRect();
    let ballX = ballRect.x;
    let ballY = ballRect.y;
    let ballDia = ballRect.width;

    let bar1Height = bar1.offsetHeight;
    let bar2Height = bar2.offsetHeight;
    let bar1Width = bar2.offsetWidth;
    let bar2Width = bar2.offsetWidth;

    ballMoving = setInterval(function () {
        let bar1X = bar1.getBoundingClientRect().x;
        let bar2X = bar2.getBoundingClientRect().x;
        let ballCentre = ballX + ballDia / 2;

        ballX += moveX;
        ballY += moveY;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        // Check for ball collisions with bars
        if (((ballX + ballDia) > window.innerWidth) || (ballX < 0)) {
            moveX = -moveX;
        }

        if (ballY <= bar1Height) {
            moveY = -moveY;
            score++;

            if ((ballCentre < bar1X) || (ballCentre > (bar1X + bar1Width))) {
                dataStoring(score, thisBar2);
            }
        }

        if ((ballY + ballDia) >= (window.innerHeight - bar2Height)) {
            moveY = -moveY;
            score++;

            if ((ballCentre < bar2X) || (ballCentre > (bar2X + bar2Width))) {
                dataStoring(score, thisBar1);
            }
        }
    }, 10);
}

// Function to store data and reset the game
function dataStoring(scoreObtained, winningBar) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(storeName, winningBar);
        localStorage.setItem(storeScore, highScore);
    }
    clearInterval(ballMoving);
    gameReset(winningBar);

    alert(winningBar + " wins with a score of " + (scoreObtained * 100) + ". Max Score is: " + (highScore * 100));
}
