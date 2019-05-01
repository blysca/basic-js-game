const btnStart = document.querySelector('.j-btn-start'),
  base = document.querySelector('.j-base'),
  scoreDash = document.querySelector('.j-score-dash'),
  progress = document.querySelector('.j-progress'),
  progressBar = document.querySelector('.j-progress-bar'),
  box = document.querySelector('.j-box'),
  boxCenter = [
    box.offsetLeft + (box.offsetWidth / 2),
    box.offsetTop + (box.offsetHeight / 2)
  ],
  gameOverELe = document.getElementById('gameOverELe'),
  container = document.getElementById('container'),
  icons = ['cat', 'crow', 'dog', 'dove', 'dragon', 'feather', 'feather-alt', 'fish', 'frog', 'hippo', 'horse', 'horse-head', 'kiwi-bird', 'otter', 'paw', 'spider', 'ghost', 'dice-d20'];

let gamePlay = false,
  player,
  animateGame;

btnStart.addEventListener('click', startGame);
container.addEventListener('mousedown', mouseDown);
container.addEventListener('mousemove', movePosition);

// utilits
function getDeg(event) {
  let angle = Math.atan2(event.clientX - boxCenter[0], -(event.clientY - boxCenter[1]));
  return angle * (180 / Math.PI);
}

function degRad(deg) {
  return deg + (Math.PI / 180)
}

function randomMe(num) {
  let r = Math.floor(Math.random() * num);
  return r;
}

function isCollide(a, b) {
  const aRec = a.getBoundingClientRect(),
    bRec = b.getBoundingClientRect();

  return !(
    (bRec.top > (aRec.top + aRec.height)) ||
    (aRec.top > (bRec.top + bRec.height)) ||
    (bRec.left > (aRec.left + aRec.width)) ||
    (aRec.left > (bRec.left + bRec.width))
  )
}

function randomColor() {
  function c() {
    let hex = randomMe(256).toString(16);
    return ('0' + String(hex)).substr(-2);
  }

  return '#' + c() + c() + c();
}
// utilits END

function mouseDown(e) {
  if (gamePlay) {
    let div = document.createElement('div');
    let deg = getDeg(e);
    div.setAttribute('class', 'fireme');
    div.moverx = 5 * Math.sin(degRad(deg));
    div.movery = -5 * Math.cos(degRad(deg));
    div.style.left = (boxCenter[0] - 5) + 'px';
    div.style.top = (boxCenter[1] - 5) + 'px';
    div.style.width = 10 + 'px';
    div.style.height = 10 + 'px';
    container.appendChild(div);
  }
}

// base
function startGame() {
  gamePlay = true;
  gameOverELe.hidden = true;
  player = {
    score: 0,
    barWidth: 100,
    lives: 100
  }

  setupBadGuys(10);

  animateGame = requestAnimationFrame(playGame)
}

function mouseDown(event) {
  if (gamePlay) {
    let div = document.createElement('div');
    let deg = getDeg(event);
    div.classList.add('fireme', 'j-fire-me'); 
    div.moverx = 5 * Math.sin(degRad(deg));
    div.movery = -5 * Math.cos(degRad(deg));
    div.style.left = `${boxCenter[0] - 5}px`;
    div.style.top = `${boxCenter[1] - 5}px`;
    div.style.width = '10px';
    div.style.height = '10px';

    container.appendChild(div);
  }
}

function movePosition(event) {
  let deg = getDeg(event);
  box.style.webkitTransform = `rotate(${deg}deg)`;
  box.style.mozTransform = `rotate(${deg}deg)`;
  box.style.msTransform = `rotate(${deg}deg)`;
  box.style.oTransform = `rotate(${deg}deg)`;
  box.style.transform = `rotate(${deg}deg)`;
}

// base END

function setupBadGuys(num) {
  for (let i = 0; i < num; i++) {
    badmaker();
  }
}

function badmaker() {
  let div = document.createElement('div'),
    myIcon = `fa-${icons[randomMe(icons.length)]}`,
    x, y, xmove, ymove,
    randomStart = randomMe(4),
    dirSet = randomMe(5) + 2,
    dirPos = randomMe(6) - 3;
  switch (randomStart) {
    case (0):
      x = 0;
      y = randomMe(600);
      xmove = dirSet;
      ymove = dirPos;
      break;
    case (1):
      x = 800;
      y = randomMe(600);
      xmove = dirSet * -1;
      ymove = dirPos;
      break;
    case (2):
      x = randomMe(800);
      y = 0;
      ymove = dirSet;
      xmove = dirPos;
      break;
    case (3):
      x = randomMe(800);
      y = 600;
      ymove = dirSet * -1;
      xmove = dirPos;
      break;
  }


  div.innerHTML = `<i class='fas ${myIcon}'></i>`
  div.classList.add('baddy', 'j-baddy');
  div.style.color = randomColor();
  div.style.fontSize = `${randomMe(32)+16}px`;
  div.points = randomMe(5) + 1;
  div.moverx = xmove;
  div.movery = ymove;
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  // div.style.height = '10px';

  container.appendChild(div);
}

function playGame() {
  if (gamePlay) {
    moveShots();
    updateDashboards();
    moveEnemy();
    animateGame = requestAnimationFrame(playGame);
  }
}

function updateDashboards() {
  scoreDash.innerText = player.score;
  // progressBar.style.width = `${player.lives}%`;
  let tempPer = `${(player.lives /player.barWidth) * 100}%`;
  progressBar.style.width = tempPer;
}

function gameOver() {
  cancelAnimationFrame(animateGame);
  gameOverELe.hidden = false;
  gameOverELe.querySelector('.j-message').innerHTML = `GAME OVER<br>YOUR SCORE: ${player.score}`;
  gamePlay = false;

  let tempEnemys = document.querySelectorAll('.j-baddy');
  for (let enemy of tempEnemys) {
    enemy.parentNode.removeChild(enemy);
  }
  let tempShots = document.querySelectorAll('.j-fire-me');
  for (let shot of tempShots) {
    shot.parentNode.removeChild(shot);
  }
}

function moveEnemy() {
  let tempEnemys = document.querySelectorAll('.j-baddy'),
    hitter = false;

  let tempShots = document.querySelectorAll('.j-fire-me');



  for (let enemy of tempEnemys) {
    if (enemy.offsetTop > 550 || enemy.offsetTop < 0 || enemy.offsetLeft > 750 || enemy.offsetLeft < 0) {
      enemy.parentNode.removeChild(enemy);
      badmaker();
    } else {
      enemy.style.top = `${enemy.offsetTop + enemy.movery}px`;
      enemy.style.left = `${enemy.offsetLeft + enemy.moverx}px`;

      for (let shot of tempShots) {
        if (isCollide(enemy, shot) && gamePlay) {
          player.score += enemy.points;
          enemy.parentNode.removeChild(enemy);
          shot.parentNode.removeChild(shot);

          updateDashboards();
          badmaker();
          break;
        }
      }
    }

    if (isCollide(box, enemy)) {
      hitter = true;
      player.lives--;
      if (player.lives < 0) {
        gameOver();
      }
      // break;

    }
  }

  if (hitter) {
    base.style.backgroundColor = 'crimson';
    hitter = false;
  } else {
    base.style.backgroundColor = '';
  }
}

function moveShots() {
  let tempShots = document.querySelectorAll('.j-fire-me');

  for (let shot of tempShots) {
    if (shot.offsetTop > 600 || shot.offsetTop < 0 || shot.offsetLeft > 800 || shot.offsetLeft < 0) {
      shot.parentNode.removeChild(shot);
    } else {
      shot.style.left = `${shot.offsetLeft + shot.moverx }px`;
      shot.style.top = `${shot.offsetTop + shot.movery }px`;
    }
  }
}