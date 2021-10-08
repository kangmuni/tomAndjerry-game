const jerrySound = new Audio('./sound/jerry_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound1 = new Audio('./sound/bug_pull1.mp3');
const bugSound2 = new Audio('./sound/bug_pull2.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const successSound = new Audio('./sound/success.mp3');

export function playJerry() {
  playSound(jerrySound);
}

export function playAlert() {
  playSound(alertSound);
}

export function playBg() {
  playSound(bgSound);
}

export function playBug1() {
  playSound(bugSound1);
}

export function playBug2() {
  playSound(bugSound2);
}

export function playWin() {
  playSound(winSound);
}

export function playSuccess() {
  playSound(successSound);
}

export function stopBg() {
  stopSound(bgSound);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
