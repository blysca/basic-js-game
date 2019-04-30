    const icons = ['cat', 'crow', 'dog', 'dove', 'dragon', 'feather', 'feather-alt', 'fish', 'frog', 'hippo', 'horse', 'horse-head', 'kiwi-bird', 'otter', 'paw', 'spider', 'ghost', 'dice-d20'],
      container = document.querySelector('.j-container'),
      myContainer = {
        width: container.offsetWidth,
        height: container.offsetHeight,
        left: container.offsetLeft,
        top: container.offsetTop
      },
      crossHair = document.querySelector('.j-cross-hair'),
      scoreElement = document.querySelector('.j-score'),
      baddy = document.querySelector('.j-baddy'),
      boxElement = document.querySelector('.box'),
      gameOver = document.querySelector('.j-game-over'),
      btnStart = document.querySelector('.j-btn-start');
    let score = 0,
      BGcount,
      hazards,
      gamePlay,
      reqUpdate,
      mDown = false;

    // container.addEventListener('mousedown', function () {
    //   mDown = true
    // }, true);
    // container.addEventListener('mouseup', function () {
    //   mDown = false
    // }, true);

    container.addEventListener('mousedown', mouseDown, true);
    container.addEventListener('mousemove', move, true);
    btnStart.addEventListener('click', startGame)

    function mouseDown(event) {
      let div = document.createElement('div');
      div.classList.add('fire-me', 'j-fire-me');
      div.dataset.counter = 100;
      div.style.left = `${(event.clientX - 100)}px`;
      div.style.top = `${(event.clienty - 100)}px`;
      div.style.width = '100px';
      div.style.height = '100px';

      container.appendChild(div);
    }

    function move(e) {
      document.querySelector('.j-cross-info').innerText = `X: ${(e.clientX - 100)} Y: ${(e.clientY - 100)}`;
      crossHair.style.top = `${e.clientY - 100}px`;
      crossHair.style.left = `${e.clientX - 100}px`;
    }

    function startGame(e) {
      if (!gamePlay) {
        BGcount = 10;
        score = 0;
        hazards = 3;
        setupBadguys(7);
        scoreElement.innerText = 0;
        gamePlay = true;
        gameOver.hidden = true;
        reqUpdate = window.requestAnimationFrame(update);
      }
    }

    function endGame() {
      gameOver.hidden = false;
      gameOver.innerHTML = `GAME OVER <br> SCORE: ${score}`;
      gamePlay = false;

      let tempEnemy = document.querySelectorAll('.j-baddy');
      for (let element of tempEnemy) {
        element.parentNode.removeChild(element);
      }

      let tempFires = document.querySelectorAll('.j-fire-me')
      for (let fire of tempFires) {
        fire.parentNode.removeChild(fire);
      }
    }

    function setupBadguys(num) {
      for (let i = 0; i < num; i++) {
        badMaker();
      }
    }

    function scoreUpdate(points) {
      score += parseInt(points);
      scoreElement.innerText = score;
    }

    function update() { // gameplay loop ANIMATION

      if (!gamePlay) {
        window.cancelAnimationFrame(reqUpdate)
      } else {
        reqUpdate = window.requestAnimationFrame(update);
      }

      let tempShots = document.querySelectorAll('.j-fire-me')
      for (let shot of tempShots) {
        fireMover(shot);
      }

      let tempEnemy = document.querySelectorAll('.j-baddy');
      for (let enemy of tempEnemy) {
        itemMover(enemy);
      }
    }

    function fireMover(element) {
      if (element.dataset.counter < 1) {
        element.parentNode.removeChild(element);
      } else {
        element.style.left = `${parseInt(element.style.left) + 1.5}px`;
        element.style.top = `${parseInt(element.style.top) + 1.5}px`;
        element.style.width = `${element.dataset.counter}px`;
        element.style.height = `${element.dataset.counter}px`;
        element.dataset.counter -= 3;
      }
    }

    function itemMover(element) {
      let tempShots = document.querySelectorAll('.j-fire-me')
      for (let shot of tempShots) {
        if (isCollision(shot, element)) {
          if (element.dataset.points === '0') {
            endGame();
            return;
          }

          shot.parentNode.removeChild(shot);
          element.parentNode.removeChild(element);
          badMaker();
          scoreUpdate(element.dataset.points);
          BGcount--;
          if (BGcount < 0) {
            endGame();
          }
          return;
        }
      }

      // console.log(element);
      let x = parseInt(element.style.left),
        y = parseInt(element.style.top),
        sp = parseInt(element.dataset.speed);

      if (element.dataset.mover <= 0) {
        element.dataset.speed = randomReturn(10) + 2;
        element.dataset.dir = randomReturn(8);
        element.dataset.mover = randomReturn(15) + 2;
      } else {
        element.dataset.mover--;
        if ((element.dataset.dir === '1' || element.dataset.dir === '2' || element.dataset.dir === '8') && x < myContainer.width) {
          x += sp;
        } // right
        if ((element.dataset.dir === '4' || element.dataset.dir === '5' || element.dataset.dir === '6') && x > 0) {
          x -= sp;
        } // left
        if ((element.dataset.dir === '3' || element.dataset.dir === '2' || element.dataset.dir === '4') && y < myContainer.height) {
          y += sp;
        } // down
        if ((element.dataset.dir === '7' || element.dataset.dir === '6' || element.dataset.dir === '8') && y > 0) {
          y -= sp;
        } // up
      }

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }

    function isCollision(a, b) {
      const aRec = a.getBoundingClientRect(),
        bRec = b.getBoundingClientRect();

      return !(
        (bRec.top > (aRec.top + aRec.height)) ||
        (aRec.top > (bRec.top + bRec.height)) ||
        (bRec.left > (aRec.left + aRec.width)) ||
        (aRec.left > (bRec.left + bRec.width))
      )
    }

    function badMaker() {
      let div = document.createElement('div'),
        randomWidth = randomReturn(50) + 50,
        iconRandom,
        x = randomReturn(myContainer.width - randomWidth),
        y = randomReturn(myContainer.height - randomWidth);

      if (hazards > 0) {
        hazards--;
        iconRandom = 'fa-bomb';
        div.dataset.points = 0;
        div.style.color = '#fff';
        div.style.backgroundColor = `${randomColor()}`;
      } else {
        iconRandom = `fa-${icons[randomReturn(icons.length-1)]}`;
        div.dataset.points = randomReturn(10) + 2;
        div.style.color = `${randomColor()}`;
        // div.style.backgroundColor = `${randomColor()}`;
      }

      div.innerHTML = `<i class="fas ${iconRandom}"></i>`;
      div.classList.add('baddy', 'j-baddy');
      div.dataset.speed = randomReturn(10) + 2;
      div.dataset.dir = randomReturn(8);
      div.dataset.mover = randomReturn(15) + 2;
      div.style.fontSize = `${randomWidth* 0.4}px`;
      div.style.height = `${randomWidth}px`;
      div.style.lineHeight = `${randomWidth}px`;
      div.style.width = `${randomWidth}px`;
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
      container.appendChild(div);
    }

    // UTILITS
    function randomReturn(num) {
      return Math.ceil(Math.random() * num);
    }

    function randomColor() {
      function c() {
        let hex = randomReturn(256).toString(16);
        return ('0' + String(hex)).substr(-2);
      }

      return '#' + c() + c() + c();
    }

    // NOT USED

    function actionForClick(e) {
      counter++;

      boxElement.style.left = `${(counter * 5 )}px`;

      if (counter > 100) {
        animateMe = window.requestAnimationFrame(actionForClick);
      } else {
        stopMeFromMoving();
      }
    }

    function stopMeFromMoving() {
      cancelAnimationFrame(animateMe);
    }