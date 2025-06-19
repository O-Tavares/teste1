let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});
// Get the canvas and its 2D rendering context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 15;
const paddleHeight = 100;

// Player paddle
const player = {
    x: 0,
    width: paddleWidth,
    height: paddleHeight,
    score: 0
};
let playerY = canvas.height / 2 - player.height / 2;


// AI (Computer) paddle
const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5
};

// Draw a rectangle (for paddles)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw a circle (for the ball)
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw text (for scores)
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px 'Courier New'";
    ctx.fillText(text, x, y);
}

// Draw the net
function drawNet() {
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, "white");
    }
}

// Handle player paddle movement with the mouse
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    playerY = evt.clientY - rect.top - player.height / 2;

    // Clamp to canvas
    if (playerY < 0) playerY = 0;
    if (playerY + player.height > canvas.height) playerY = canvas.height - player.height;
}


// Collision detection
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.left < p.right && b.bottom > p.top && b.top < p.bottom;
}

// Reset the ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
    ball.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

// Update game objects
function update() {
    const movespeed = 7;
    if (keys["w"]) {
        playerY -= moveSpeed;
    }
    if (keys["s"]) {
        playerY += moveSpeed;
    }
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Simple AI movement
    let aiTargetY = ball.y - ai.height / 2;
    ai.y += (aiTargetY - ai.y) * 0.1;

    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    let hittingPaddle = (ball.x < canvas.width / 2) ? player : ai;

    if (collision(ball, hittingPaddle)) {
        let collidePoint = (ball.y - (hittingPaddle.y + hittingPaddle.height / 2)) / (hittingPaddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        let currentSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
        currentSpeed += 0.5;
        ball.speedX = direction * currentSpeed * Math.cos(angleRad);
        ball.speedY = currentSpeed * Math.sin(angleRad);
    }

    if (ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
    const moveSpeed = 7;


// Clamp to canvas bounds
if (playerY < 0) playerY = 0;
if (playerY + player.height > canvas.height) playerY = canvas.height - player.height;

}

// Render game
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawNet();
    drawText(player.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(ai.score, 3 * canvas.width / 4, canvas.height / 5, "white");
    drawRect(player.x, player.y, player.width, player.height, "white");
    drawRect(ai.x, ai.y, ai.width, ai.height, "white");
    drawCircle(ball.x, ball.y, ball.radius, "white");
}

// Game loop
function gameLoop() {
    update();
    render();
}

const framePerSecond = 60;
setInterval(gameLoop, 1000 / framePerSecond);
