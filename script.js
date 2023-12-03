// DOM elements
const bar1 = document.getElementById("bar-1");
const bar2 = document.getElementById("bar-2");
const ball = document.getElementById("ball");
const movement = 20;

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
localStorage.setItem(storeName, "null");
localStorage.setItem(storeScore, "null");

// Initialization function using IIFE
(function () {
    // Retrieve high score and player from localStorage
    highScore = localStorage.getItem(storeScore);
    whichBar = localStorage.getItem(storeName);

    // Check if it's the first game
    if (whichBar === "null" || highScore === "null") {
        alert("Hello.. This is your first game");
        highScore = 0;
        whichBar = thisBar1;
    } else {
        alert(whichBar + " has the maximum score of " + highScore * 100);
    }

    // Reset the game based on the player's bar
    gameReset(whichBar);
})();

// Function to reset the game
function gameReset(barName) {
    // Center the bars and ball horizontally
    bar1.style.left = ((window.innerWidth - bar1.offsetWidth) / 2) + "px";
    bar2.style.left = ((window.innerWidth - bar2.offsetWidth) / 2) + "px";
    ball.style.left = ((window.innerWidth - ball.offsetWidth) / 2) + "px";

    // Set initial vertical position and direction for the ball
    if (barName === thisBar1) {
        ball.style.top = bar2.getBoundingClientRect().y - bar2.getBoundingClientRect().height + "px";
        moveY = -2;
    } else if (barName === thisBar2) {
        ball.style.top = bar1.getBoundingClientRect().height + "px";
        moveY = 2;
    }

    // Reset score and game status
    score = 0;
    gameStart = false;
}

// Event listener for keydown events
document.addEventListener('keydown', function (event) {
    // Move the bars using 'a' and 'd' keys
    if (event.keyCode == 68 || event.keyCode == 39) {
        moveRight();
    }

    if (event.keyCode == 65 || event.keyCode == 37) {
        moveLeft();
    }

    // Start the game on 'Enter' key
    if (event.keyCode == 13) {
        if (!gameStart) {
            gameStart = true;
            startGame();
        }
    }
});

// Event listeners for touch events
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

// Function to handle keydown events
function handleKeyDown(event) {
    switch (event.keyCode) {
        case 68: // 'd' key or right arrow
        case 39:
            moveBar(movement);
            break;
        case 65: // 'a' key or left arrow
        case 37:
            moveBar(-movement);
            break;
        case 13: // 'Enter' key
            if (!gameStart) {
                gameStart = true;
                startGame();
            }
            break;
    }
}

// Function to handle touchstart events
function handleTouchStart(event) {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    moveBar(touchX > window.innerWidth / 2 ? movement : -movement);
}

// Function to handle touchmove events
function handleTouchMove(event) {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    moveBar(touchX > window.innerWidth / 2 ? movement : -movement);
}

// Function to move the bars
function moveBar(offset) {
    const newLeft = parseInt(bar1.style.left) + offset;
    // Check if the new position is within the borders
    if (newLeft >= border && newLeft <= (window.innerWidth - bar1.offsetWidth - border)) {
        bar1.style.left = newLeft + 'px';
        bar2.style.left = bar1.style.left;
    }
}

// Function to start the game
function startGame() {
    // Retrieve initial positions and dimensions
    let ballRect = ball.getBoundingClientRect();
    let ballX = ballRect.x;
    let ballY = ballRect.y;
    let ballDia = ballRect.width;

    let bar1Height = bar1.offsetHeight;
    let bar2Height = bar2.offsetHeight;
    let bar1Width = bar2.offsetWidth;
    let bar2Width = bar2.offsetWidth;

    // Move the ball at regular intervals
    ballMoving = setInterval(function () {
        let bar1X = bar1.getBoundingClientRect().x;
        let bar2X = bar2.getBoundingClientRect().x;
        let ballCentre = ballX + ballDia / 2;

        ballX += moveX;
        ballY += moveY;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        // Check for ball collisions with bars and screen edges
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

// Function to move the bars to the right
function moveRight() {
    if (parseInt(bar1.style.left) < (window.innerWidth - bar1.offsetWidth - border)) {
        bar1.style.left = parseInt(bar1.style.left) + movement + 'px';
        bar2.style.left = bar1.style.left;
    }
}

// Function to move the bars to the left
function moveLeft() {
    if (parseInt(bar1.style.left) > border) {
        bar1.style.left = parseInt(bar1.style.left) - movement + 'px';
        bar2.style.left = bar1.style.left;
    }
}

// Function to store data and reset the game
function dataStoring(scoreObtained, winningBar) {
    // Update and store the high score and winning player
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(storeName, winningBar);
        localStorage.setItem(storeScore, highScore);
    }
    // Stop the ball movement and reset the game
    clearInterval(ballMoving);
    gameReset(winningBar);

    // Display the result to the user
    alert(winningBar + " wins with a score of " + (scoreObtained * 100) + ". Max Score is: " + (highScore * 100));
}
