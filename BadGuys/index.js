const container = document.getElementById('container'),
  basketContainer = document.getElementById('basket-container'),
  startBtn = document.querySelector('.j-start-btn'),
  gameOverMsg = document.querySelector('.j-gameover-text');

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame,
  start = window.mozAnimationStartTime, // Only supported in FF. Other browsers can use something like Date.now().
  score,
  totalBad,
  gamePlay = false,
  keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  },
  basket = {
    x: 0,
    y: 0,
    el: basketContainer,
    width: basketContainer.offsetWidth,
    height: basketContainer.offsetHeight,
    top: basketContainer.offsetTop,
    left: basketContainer.offsetLeft
  },
  speed = 3,
  myContainer = {
    width: container.offsetWidth,
    height: container.offsetHeight,
    top: container.offsetTop,
    left: container.offsetLeft,
  },
  enemy = [];

// events 
startBtn.addEventListener('click', stactGame);
document.addEventListener('keydown', pressKeyOn);
document.addEventListener('keyup', pressKeyOff);

function stactGame() {
  gameOverMsg.style.display = 'none';
  score = 0;
  totalBad = 15;

  if (enemy.length === 0) setupBadGuys(3);
  requestAnimationFrame(playGame);
  gamePlay = true;
}

function endGame() {
  gameOverMsg.style.display = 'block';
  gameOverMsg.innerHTML = 'GAME OVER';
  gamePlay = false;

  for (let x = 0; x < enemy.length; x++) {
    enemy[x].el.style.top = `-200px`;
    enemy[x].y = -200;
  }
}

function playGame() {
  if (!gamePlay) {
    endGame();
    cancelAnimationFrame(playGame);
    return;
  }

  if (keys.ArrowUp && basket.y < (myContainer.height - basket.height)) {
    basket.y += speed;
  }
  if (keys.ArrowDown && basket.y > 0) {
    basket.y -= speed;
  }
  if (keys.ArrowLeft && basket.x > 0) {
    basket.x -= speed;
  }
  if (keys.ArrowRight && basket.x < (myContainer.width - basket.width)) {
    basket.x += speed;
  }

  basket.el.style.left = `${basket.x}px`;
  basket.el.style.bottom = `${basket.y}px`;

  for (let i = 0; i < enemy.length; i++) {
    badGuyMover(enemy[i]);
  }


  // movement
  requestAnimationFrame(playGame);
}

function pressKeyOn(event) {
  event.preventDefault();
  let k = event.key;
  keys[k] = true;
}

function pressKeyOff(event) {
  event.preventDefault();
  let k = event.key;
  keys[k] = false;
}

// functions

function collisionDetection(first, second) {
  const a = first.getBoundingClientRect();
  const b = second.getBoundingClientRect();
  let collisionCheck = !(
    a.top > (b.top + b.height) ||
    b.top > (a.top + a.height) ||
    b.left > (a.left + a.width) ||
    a.left > (b.left + b.width)
  );

  return collisionCheck;
}

function setupBadGuys(num) {
  for (let x = 0; x < num; x++) {
    let temp = `badGuy-${x+1}`;
    let div = document.createElement('div');
    div.innerHTML = (x + 1);
    div.setAttribute('class', 'baddy');
    div.setAttribute('id', temp);
    container.appendChild(div);
    enemy.push({
      x: 0,
      y: 0,
      el: div,
      speed: 5
    });
    makeBad(enemy[x])
  }
}

function makeBad(e) {
  if (totalBad < 1) {
    endGame();
  }
  totalBad--;

  let randomWidth = Math.floor(Math.random() * 50) + 50;
  e.x = Math.floor(Math.random() * (myContainer.width - randomWidth));
  e.y = Math.floor(Math.random() * myContainer.height / 2) - 1;
  e.speed = Math.ceil(Math.random() * 10) + 3;
  e.el.style.left = `${e.x}px`;
  e.el.style.width = `${randomWidth}px`;
  e.el.style.backgroundColor = randowColor();

}

function badGuyMover(e) {
  e.y += e.speed;
  if (e.y > myContainer.height) {
    makeBad(e);
  }

  if (collisionDetection(basket.el, e.el)) {
    scoreUpdate()
    makeBad(e);

    console.log('HIT!');
  }
  e.el.style.top = `${e.y}px`;
}

function scoreUpdate() {
  score++;
  document.querySelector('.j-score').innerHTML = score;
}

function randowColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return (`0${String(hex)}`).substr(-2);
  }

  return `#${c()}${c()}${c()}`;
}