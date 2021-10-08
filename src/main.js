'use strict';

import PopUp from './popup.js';
import GameBuilder from './game.js';

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .withJerryCount1(15)
  .withJerryCount2(20)
  .withJerryCount3(25)
  .withGameDuration(15)
  .build();

game.setGameStopListener((reason, level) => {
  console.log(reason, level);
  let message;
  switch (reason) {
    case 'lose':
      message = 'WHERE IS MY 🧀?';
      break;
    case 'next level':
      message = 'BUT, I WANT MORE 🧀...';
      break;
    case 'win':
      message = '🎉 YOU GOT ALL 🧀!!!';
      break;
    default:
      throw new Error('NOT VALID REASON');
  }
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
