const map = document.querySelector("#game");
const canvas = map.getContext('2d');
canvas.fillStyle = 'rgb(228, 164, 87)';

const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = map.height - grid - paddleHeight;

let ballSpeed = 10;
let paddleSpeed = 7;

const leftPaddle = {
    x: grid * 2,
    y: map.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight * 3,
    dy: 0,
}

const rightPaddle = {
    x: map.width - grid * 3,
    y: map.height / 2 - paddleHeight / 2,
    width: grid,
    height: grid * 5,
    dy: 0,
}

const ball = {
    x: map.width / 2,
    y: map.height / 2,
    width: grid,
    height: grid,
    dx: ballSpeed,
    dy: -ballSpeed,
    isResetted: false,
}


function renderLeftPaddle() {
    canvas.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
}

function renderRightPaddle() {
    canvas.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
}


function renderMap() {
    canvas.fillRect(0, 0, map.width, grid); // Верхняя граница
    canvas.fillRect(0, map.height - grid, map.width, grid) // Нижняя граница

    for (let i = grid; i < map.height - grid; i += grid * 2) {
        canvas.fillRect(map.width / 2, i, grid, grid); // Разделительная линия
    }
}

function renderBall() {
    canvas.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function clearMap() {
    canvas.clearRect(0, 0, map.width, map.height);
}

function resetGame() {
    if ((ball.x < 0 || ball.x > map.width) && !ball.isResetted) {
        ball.isResetted = true;
        setTimeout(() => {
            ball.x = map.width / 2;
            ball.y = map.height / 2;
            ball.isResetted = false;
        }, 1000);
    }
}

function collideWallsWithPaddle(paddle) {
    if (paddle.y < grid) {
        paddle.y = grid;
    }
    else if (paddle.y > maxPaddleY) {
        paddle.y = maxPaddleY;
    }
}

function collideWallsWithBall() {
    if (ball.y < grid) {
        ball.dy = -ball.dy;
        ball.y = grid;
    } else if (ball.y > map.height - grid) {
        ball.dy = -ball.dy;
        ball.y = map.height - grid;
    }
}

function isCollides(object1, object2) {
    const width1 = object1.x + object1.width;
    const width2 = object2.x + object2.width;
    const height1 = object1.y + object1.height;
    const height2 = object2.y + object2.height;
    return object1.x < width2
        && object2.x < width1
        && object1.y < height2
        && object2.y < height1;
}

function collideBallwithPaddles() {
    if (isCollides(ball, rightPaddle)) {
        ball.dx = -ball.dx;
        ball.x = rightPaddle.x - ball.width;
    } else if (isCollides(ball, leftPaddle)) {
        ball.dx = -ball.dx;
        ball.x = leftPaddle.x + ball.width;
    }
}

function aiControl() {
    let direction = 0

    if (ball.y < rightPaddle.y) {
        direction = -1;
    } else if (ball.y > rightPaddle.y) {
        direction = 1;
    }
    rightPaddle.y += paddleSpeed * direction;
}

function loop() {
    clearMap();

    renderLeftPaddle();
    renderRightPaddle();
    renderBall();
    renderMap();
    
    movePaddles();
    moveBall();
    aiControl();

    collideWallsWithPaddle(leftPaddle);
    collideWallsWithPaddle(rightPaddle);
    collideWallsWithBall();
    collideBallwithPaddles();

    resetGame();

    requestAnimationFrame(loop);
}


addEventListener('keydown', (event) => {
    console.log(event.key);
    if (event.key == "w" || event.key == "ц") {
        leftPaddle.dy = -paddleSpeed;
    } else if (event.key == "s" || event.key == "ы") {
        leftPaddle.dy = paddleSpeed;
    } else if (event.key == "ArrowUp") {
        rightPaddle.dy = -paddleSpeed;
    } else if (event.key == "ArrowDown") {
        rightPaddle.dy = paddleSpeed;
    }
})

addEventListener('keyup', (event) => {
    if (event.key == "w" || event.key == "ц" || event.key == "s" || event.key == "ы") {
        leftPaddle.dy = 0;
    } else if (event.key == "ArrowUp" || event.key == "ArrowDown") {
        rightPaddle.dy = 0;
    }
})



requestAnimationFrame(loop);