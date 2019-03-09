const container = document.getElementById('container'),
  ball = document.getElementById('ball'),
  paddle = document.querySelector('.j-paddle'),
  btn_start = document.querySelector('.j-startBtn');

let gameOver = true,
  gameInPlay = false,
  score = 0,
  lives = 5,
  animationRepeat,
  ballDir = [5, 5, 5],
  containerDim = container.getBoundingClientRect();

btn_start.addEventListener('click', startGame);
document.addEventListener('keydown', function (e) {
  const key = e.keyCode;
  e.preventDefault();

  if (key === 37) paddle.left = true;
  else if (key === 39) paddle.right = true;
  else if (key === 38 && !gameInPlay) gameInPlay = true;

});
document.addEventListener('keyup', function (e) {
  const key = e.keyCode;
  e.preventDefault();

  if (key === 37) paddle.left = false;
  if (key === 39) paddle.right = false;
});

// events functions START
function startGame() {
  if (gameOver) {
    document.querySelector('.j-gameover').style.display = 'none'
    ball.style.display = 'block'
    lives = 5;
    lifeUpdater();
    setupBricks(12);
    animationRepeat = requestAnimationFrame(update);
    gameOver = false;
    gameInPlay = false;
  }

}
// events functions END

// functions 
function setupBricks(num) {
  let row = {
    x: ((containerDim.width % 100) / 2),
    y: 50
  };

  for (let x = 0; x < num; x++) {
    if (row.x > (containerDim.width - 100)) {
      row.y += 70;
      row.x = ((containerDim.width % 100) / 2);
    }
    brickMaker(row);
    row.x += 100;
  }
}

function brickMaker(row) {

  let pointDiv = Math.ceil(Math.random() * 10) + 2,
    div = document.createElement('div');
  div.setAttribute('class', 'brick');
  div.dataset.points = pointDiv;
  div.innerHTML = pointDiv;
  div.style.backgroundColor = ranColor();
  div.style.left = `${row.x}px`;
  div.style.top = `${row.y}px`;

  container.appendChild(div);
}

function ranColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16),
      response = (`0${String(hex)}`).substr(-2);
    return response;
  }

  return `#${c()}${c()}${c()}`;
}

function update() {
  if (!gameOver) {
    let pCurrent = paddle.offsetLeft;
    if (paddle.left && pCurrent > 0) {
      pCurrent -= 5;
    } else if (paddle.right && pCurrent < (containerDim.width - paddle.offsetWidth)) {
      pCurrent += 5;
    }

    paddle.style.left = `${pCurrent}px`;

    if (!gameInPlay) {
      waitingOnPaddle();
    } else {
      ballMove();
    }

    animationRepeat = requestAnimationFrame(update);
  }
}

function waitingOnPaddle() {
  ball.style.top = `${paddle.offsetTop - 22}px`;
  ball.style.left = `${paddle.offsetLeft + 55}px`;
}

function ballMove() {
  let x = ball.offsetLeft,
    y = ball.offsetTop;

  if (x > (containerDim.width - 20) || x < 0) {
    ballDir[0] *= -1;
  }
  if (y > (containerDim.height - 20) || y < 0) {
    if (y > (containerDim.height - 20)) {
      fallOffEdge();
      return;
    }

    ballDir[1] *= -1;
  }

  if (isCollide(ball, paddle)) {
    let nDir = ((x - paddle.offsetLeft) - (paddle.offsetWidth / 2)) / 10;
    ballDir[0] = nDir;
    ballDir[1] *= -1;
  }

  let tempBricks = document.querySelectorAll('.brick');
  if (tempBricks.length === 0) {
    stopper();
    setupBricks(20);
  }
  for (let tarBrick of tempBricks) {
    if (isCollide(tarBrick, ball)) {
      ballDir[1] *= -1;
      tarBrick.parentNode.removeChild(tarBrick);
      scoreUpdate(tarBrick.dataset.points);
    }
  }

  x += ballDir[0];
  y += ballDir[1];

  ball.style.top = `${y}px`;
  ball.style.left = `${x}px`;
}

function stopper() {
  gameInPlay = false;
  ballDir[0, -5];
  waitingOnPaddle();
  window.cancelAnimationFrame(animationRepeat);
}

function lifeUpdater() {
  document.querySelector('.j-lives').innerHTML = lives;
}

function scoreUpdate(num) {
  score += parseInt(num);
  document.querySelector('.j-score').innerHTML = score;
}

function endGame() {
  document.querySelector('.j-gameover').style.display = 'block';
  document.querySelector('.j-gameover').innerHTML = `GAME OVER <br>YOUR SCORE ${score}`;
  gameOver = true;
  ball.style.display = 'none'

  let tempBricks = document.querySelectorAll('.brick');

  for (let tarBrick of tempBricks) {
    tarBrick.parentNode.removeChild(tarBrick);
  }
}

function fallOffEdge() {
  lives--;
  if (lives < 0) {
    endGame();
    lives = 0;
  }

  lifeUpdater();
  stopper();
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect(),
    bRect = b.getBoundingClientRect();
  return !(aRect.bottom < bRect.top || aRect.top > bRect.bottom || aRect.right < bRect.left || aRect.left > bRect.right);
}