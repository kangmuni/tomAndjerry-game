'use strict';

import PopUp from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';

const STEP1_JERRY_COUNT = 15;
const STEP2_JERRY_COUNT = 20;
const STEP3_JERRY_COUNT = 25;
const GAME_DURATION_SEC = 15;

const gameBtn = document.querySelector('.game__button');
const gameLevel = document.querySelector('.game__Level');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

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

const gameFinishBanner = new PopUp();

gameFinishBanner.setReplayClickListener(() => {
  level = 1;
  startGame();
});

gameFinishBanner.setNextClickListener(() => {
  level++;
  startGame();
});

const gameField = new Field(
  STEP1_JERRY_COUNT,
  STEP2_JERRY_COUNT,
  STEP3_JERRY_COUNT
);

gameField.setClickListener(onItemClick);
gameField.setFinishGame(finishGame);

function onItemClick(item) {
  if (!started) {
    return;
  } else if (item === 'jerry') {
    score++;
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
  }
}

function startGame() {
  started = true;
  initGame(level);
  hideGameButton();
  showGameLevel();
  showTimerAndScore();
  startGameTimer();
  sound.playBg();
}

function stopGame() {
  started = false;
  hideGameLevel();
  stopGameTimer();
  gameFinishBanner.showWithText();
  sound.playAlert();
  sound.stopBg();
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

function initGame(level) {
  score = 0;
  if (level === 3) {
    gameScore.innerText = STEP3_JERRY_COUNT;
  } else if (level === 2) {
    gameScore.innerText = STEP2_JERRY_COUNT;
  } else {
    gameScore.innerText = STEP1_JERRY_COUNT;
  }
  gameField.init(level);
}

function finishGame(win) {
  started = false;
  if (win && level === 3) {
    sound.playSuccess();
    gameFinishBanner.buttonChange(level);
    gameFinishBanner.showWithText('🎉 YOU GOT ALL 🧀!!!');
  } else if (win && level === 2) {
    sound.playWin();
    gameFinishBanner.buttonChange(level);
    gameFinishBanner.showWithText('BUT, I WANT MORE 🧀...');
  } else if (win && level === 1) {
    sound.playWin();
    gameFinishBanner.buttonChange(level);
    gameFinishBanner.showWithText('BUT, I WANT MORE 🧀...');
  } else {
    sound.playBug1();
    setTimeout(sound.playBug2(), 1000);
    gameFinishBanner.buttonChange();
    gameFinishBanner.showWithText('WHERE IS MY 🧀?');
  }
  stopGameTimer();
  sound.stopBg();
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
