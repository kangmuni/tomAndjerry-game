'use strict';

import Field from './field.js';
import * as sound from './sound.js';

export default class GameBuilder {
  withJerryCount1(num) {
    this.jerryCount1 = num;
    return this;
  }
  withJerryCount2(num) {
    this.jerryCount2 = num;
    return this;
  }
  withJerryCount3(num) {
    this.jerryCount3 = num;
    return this;
  }
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }
  build() {
    console.log(this);
    return new Game(
      this.jerryCount1,
      this.jerryCount2,
      this.jerryCount3,
      this.gameDuration
    );
  }
}

class Game {
  constructor(jerryCount1, jerryCount2, jerryCount3, gameDuration) {
    this.jerryCount1 = jerryCount1;
    this.jerryCount2 = jerryCount2;
    this.jerryCount3 = jerryCount3;
    this.gameDuration = gameDuration;

    this.gameLevel = document.querySelector('.game__Level');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.started = false;
    this.level = 1;
    this.score = 0;
    this.timer = 0;

    this.gameField = new Field(
      this.jerryCount1,
      this.jerryCount2,
      this.jerryCount3
    );
    this.gameField.setClickListener(this.onItemClick);
    this.gameField.setFinish(this.finish);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    } else if (item === 'jerry') {
      this.score++;
      this.updateScoreBoard();
      if (this.level === 3) {
        if (this.score === this.jerryCount3) {
          this.finish(true);
        }
        return;
      }
      if (this.level === 2) {
        if (this.score === this.jerryCount2) {
          this.finish(true);
        }
        return;
      }
      if (this.score === this.jerryCount1) {
        this.finish(true);
        return;
      }
    }
  };

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  start() {
    this.started = true;
    this.initGame(this.level);
    this.hideGameButton();
    this.showGameLevel();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBg();
  }

  stop() {
    this.started = false;
    this.hideGameLevel();
    this.stopGameTimer();
    sound.playAlert();
    sound.stopBg();
    this.onGameStop && this.onGameStop('lose');
  }

  finish = (win) => {
    this.started = false;
    if (win && this.level === 3) {
      sound.playSuccess();
      this.onGameStop && this.onGameStop('win', this.level);
    } else if (win && this.level === 2) {
      sound.playWin();
      this.onGameStop && this.onGameStop('next level', this.level);
    } else if (win && this.level === 1) {
      sound.playWin();
      this.onGameStop && this.onGameStop('next level', this.level);
    } else {
      sound.playBug1();
      setTimeout(sound.playBug2(), 1000);
      this.onGameStop && this.onGameStop('lose');
    }
    this.stopGameTimer();
    sound.stopBg();
  };

  showGameLevel() {
    this.gameLevel.innerText = `Lv.${this.level}`;
    this.gameLevel.style.visibility = 'visible';
  }

  hideGameLevel() {
    this.gameLevel.style.visibility = 'hidden';
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        if (this.level === 3) {
          this.finish(this.score === this.jerryCount3);
        } else if (this.level === 2) {
          this.finish(this.score === this.jerryCount2);
        } else {
          this.finish(this.score === this.jerryCount1);
        }
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerHTML = `${minutes}:${seconds}`;
  }

  initGame(level) {
    this.score = 0;
    if (level === 3) {
      this.gameScore.innerText = this.jerryCount3;
    } else if (level === 2) {
      this.gameScore.innerText = this.jerryCount2;
    } else {
      this.gameScore.innerText = this.jerryCount1;
    }
    this.gameField.init(level);
  }

  updateScoreBoard() {
    if (this.level === 3) {
      this.gameScore.innerText = this.jerryCount3 - this.score;
    } else if (this.level === 2) {
      this.gameScore.innerText = this.jerryCount2 - this.score;
    } else {
      this.gameScore.innerText = this.jerryCount1 - this.score;
    }
  }

  hideGameButton() {
    this.gameBtn.style.display = 'none';
  }
}
