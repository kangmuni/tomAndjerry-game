'use strict';

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector('.pop-up');
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');
    this.popUpNext = document.querySelector('.pop-up__next');
    this.popUpRefresh.addEventListener('click', () => {
      this.onClick1 && this.onClick1();
      this.hide();
    });
    this.popUpNext.addEventListener('click', () => {
      this.onClick2 && this.onClick2();
      this.hide();
    });
  }

  setReplayClickListener(onClick1) {
    this.onClick1 = onClick1;
  }

  setNextClickListener(onClick2) {
    this.onClick2 = onClick2;
  }

  showWithText(text) {
    this.popUpText.innerHTML = text;
    this.popUp.classList.remove('pop-up--hide');
  }

  hide() {
    this.popUp.classList.add('pop-up--hide');
  }

  buttonChange(level) {
    if (level === 2 || level === 1) {
      this.popUpNext.style.display = 'inline';
      this.popUpRefresh.style.display = 'none';
    } else {
      this.popUpNext.style.display = 'none';
      this.popUpRefresh.style.display = 'inline';
    }
    return;
  }
}
