'use strict';

const jerrySound = new Audio('./sound/jerry_pull.mp3');
const JERRY_SIZE = 120;
let x;

export default class Field {
  constructor(jerryCount1, jerryCount2, jerryCount3) {
    this.jerryCount1 = jerryCount1;
    this.jerryCount2 = jerryCount2;
    this.jerryCount3 = jerryCount3;
    this.field = document.querySelector('.jerry_field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', this.onClick);
  }

  init(level) {
    console.log(level);
    this.field.innerHTML = '';
    if (level === 3) {
      this._addItem('jerry', this.jerryCount3, 'img/jerry.png');
    } else if (level === 2) {
      this._addItem('jerry', this.jerryCount2, 'img/jerry.png');
    } else {
      this._addItem('jerry', this.jerryCount1, 'img/jerry.png');
    }
    this._moveAuto();
  }

  _addItem(className, count, imgPath) {
    const x1 = 20;
    const y1 = 0;
    const x2 = this.fieldRect.width / 1.5 - JERRY_SIZE;
    const y2 = this.fieldRect.height - JERRY_SIZE;
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const jerryX = randomNumber(x1, x2);
      const jerryY = randomNumber(y1, y2);
      item.style.left = `${jerryX}px`;
      item.style.top = `${jerryY}px`;
      this.field.appendChild(item);
    }
  }

  _moveAuto() {
    const jerry = document.querySelectorAll('.jerry');
    let st = setInterval(() => {
      for (let i = 0; i < jerry.length; i++) {
        x = jerry[i].getBoundingClientRect();
        jerry[i].style.left = `${x.left + 0.3}px`;
        if (x.right >= this.fieldRect.width) {
          this.finishGame && this.finishGame(false);
          clearInterval(st);
        }
      }
    }, 900);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  setFinishGame(finishGame) {
    this.finishGame = finishGame;
  }

  onClick = (event) => {
    const target = event.target;
    if (target.matches('.jerry')) {
      target.remove();
      playSound(jerrySound);
      this.onItemClick && this.onItemClick('jerry');
    }
  };
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
