'use strict';

import PopUp from './popup.js';

const STEP1_JERRY_COUNT = 1;
const STEP2_JERRY_COUNT = 2;
const STEP3_JERRY_COUNT = 3;
const TOM_COUNT = 1;
const JERRY_SIZE = 120;
const GAME_DURATION_SEC = 15;

const field = document.querySelector('.jerry_field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameLevel = document.querySelector('.game__Level');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');
const jerry = document.getElementsByClassName('jerry');

const jerrySound = new Audio('./sound/jerry_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound1 = new Audio('./sound/bug_pull1.mp3');
const bugSound2 = new Audio('./sound/bug_pull2.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const successSound = new Audio('./sound/success.mp3');

let started = false;
let level = 1;
let score = 0;
let timer = 0;
let x;

gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

field.addEventListener('click', onFieldClick);

const gameFinishBanner = new PopUp();

gameFinishBanner.setReplayClickListener(() => {
  level = 1;
  startGame();
});

gameFinishBanner.setNextClickListener(() => {
  level++;
  startGame();
});

function startGame() {
  started = true;
  initGame();
  hideGameButton();
  showGameLevel();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  hideGameLevel();
  stopGameTimer();
  gameFinishBanner.showWithText();
  playSound(alertSound);
  stopSound(bgSound);
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  if (level === 3) {
    gameScore.innerText = STEP3_JERRY_COUNT;
    addItem('jerry', STEP3_JERRY_COUNT, 'img/jerry.png');
  } else if (level === 2) {
    gameScore.innerText = STEP2_JERRY_COUNT;
    addItem('jerry', STEP2_JERRY_COUNT, 'img/jerry.png');
  } else {
    gameScore.innerText = STEP1_JERRY_COUNT;
    addItem('jerry', STEP1_JERRY_COUNT, 'img/jerry.png');
  }
  moveAuto();
}

function showGameLevel() {
  gameLevel.innerText = `Lv.${level}`;
  gameLevel.style.visibility = 'visible';
}

function hideGameLevel() {
  gameLevel.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      if (level === 3) {
        finishGame(score === STEP3_JERRY_COUNT);
      } else if (level === 2) {
        finishGame(score === STEP2_JERRY_COUNT);
      } else {
        finishGame(score === STEP1_JERRY_COUNT);
      }
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerHTML = `${minutes}:${seconds}`;
}

function finishGame(win) {
  started = false;
  if (win && level === 3) {
    playSound(successSound);
    gameFinishBanner.buttonChange(level);
    gameFinishBanner.showWithText('🎉 YOU GOT ALL 🧀!!!');
  } else if (win && level === 2) {
    playSound(winSound);
    gameFinishBanner.buttonChange(level);
    gameFinishBanner.showWithText('BUT, I WANT MORE 🧀...');
  } else if (win && level === 1) {
    playSound(winSound);
    gameFinishBanner.buttonChange(level);
    gameFinishBanner.showWithText('BUT, I WANT MORE 🧀...');
  } else {
    playSound(bugSound1);
    setTimeout(playSound(bugSound2), 1000);
    gameFinishBanner.buttonChange();
    gameFinishBanner.showWithText('WHERE IS MY 🧀?');
  }
  stopGameTimer();
  stopSound(bgSound);
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.jerry')) {
    target.remove();
    score++;
    playSound(jerrySound);
    updateScoreBoard();
    if (level === 3) {
      if (score === STEP3_JERRY_COUNT) {
        finishGame(true);
      }
      return;
    }
    if (level === 2) {
      if (score === STEP2_JERRY_COUNT) {
        finishGame(true);
      }
      return;
    }
    if (score === STEP1_JERRY_COUNT) {
      finishGame(true);
      return;
    }
  } else if (target.matches('.nibbles')) {
    finishGame(false);
    return;
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  if (level === 3) {
    gameScore.innerText = STEP3_JERRY_COUNT - score;
  } else if (level === 2) {
    gameScore.innerText = STEP2_JERRY_COUNT - score;
  } else {
    gameScore.innerText = STEP1_JERRY_COUNT - score;
  }
}

function showGameButton() {
  gameBtn.style.visibility = 'visible';
}

function hideGameButton() {
  gameBtn.style.display = 'none';
}

function moveAuto() {
  const jerry = document.querySelectorAll('.jerry');
  let st = setInterval(() => {
    for (let i = 0; i < jerry.length; i++) {
      x = jerry[i].getBoundingClientRect();
      jerry[i].style.left = `${x.left + 0.1}px`;
      if (x.right >= fieldRect.width) {
        finishGame();
        clearInterval(st);
      }
    }
  }, 1000);
}

function addItem(className, count, imgPath) {
  const x1 = 20;
  const y1 = 0;
  const x2 = fieldRect.width / 1.5 - JERRY_SIZE;
  const y2 = fieldRect.height - JERRY_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const jerryX = randomNumber(x1, x2);
    const jerryY = randomNumber(y1, y2);
    item.style.left = `${jerryX}px`;
    item.style.top = `${jerryY}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
