'use strict';

import PopUp from './popup.js';
import { GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .withJerryCount1(15)
  .withJerryCount2(20)
  .withJerryCount3(25)
  .withGameDuration(15)
  .build();

game.setGameStopListener((reason, level) => {
  let message;
  switch (reason) {
    case Reason.lose:
      message = 'WHERE IS MY 🧀?';
      sound.playBug1();
      setTimeout(sound.playBug2(), 1000);
      break;
    case Reason.next:
      message = 'BUT, I WANT MORE 🧀...';
      sound.playWin();
      break;
    case Reason.win:
      message = '🎉 YOU GOT ALL 🧀!!!';
      sound.playSuccess();
      break;
    default:
      throw new Error('NOT VALID REASON');
  }
  console.log(level);
  gameFinishBanner.showWithText(message);
  gameFinishBanner.buttonChange(level);
});

gameFinishBanner.setReplayClickListener(() => {
  game.level = 1;
  game.start();
});

gameFinishBanner.setNextClickListener(() => {
  game.level++;
  game.start();
});
