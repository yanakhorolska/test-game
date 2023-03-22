import Notiflix from 'notiflix';

const create = document.querySelector('[data-create');
const destroy = document.querySelector('[data-destroy]');
const boxesBlock = document.querySelector('#boxes');
const columns = document.querySelector('#controls .columns');
const rows = document.querySelector('#controls .rows');
const squares = document.querySelector('#squaresCounter p');
const controlButtons = document.querySelector('.buttonsBox');
const upButton = document.querySelector('.up-button');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const downButton = document.querySelector('.down-button');
const stopButton = document.querySelector('#stop');
const replayButton = document.querySelector('#replay');

create.addEventListener('click', getAmount);
destroy.addEventListener('click', destroyBoxes);
upButton.addEventListener('click', movePicture);
leftButton.addEventListener('click', movePicture);
rightButton.addEventListener('click', movePicture);
downButton.addEventListener('click', movePicture);
document.addEventListener('keydown', movePicture);
stopButton.addEventListener('click', onStopButton);
replayButton.addEventListener('click', onReplayButton);

let activeId;
let activeDiv;
let events = [];
let intervalId;

function getAmount() {
  const amount = columns.value * rows.value;
  if (amount === 0) {
    Notiflix.Notify.warning('Please, enter the number of rows and columns');
    return;
  }

  activeId = Math.round(amount / 2);
  createBoxes(amount);
  createActiveDiv(activeId);
}

function onReplayButton() {
  replayButton.setAttribute('disabled', 'true');
  activeDiv.classList.remove('activeBox', 'hero');
  destroy.removeAttribute('disabled');
  let i = 0;
  let prevEvent = null;

  intervalId = setInterval(() => {
    if (i >= events.length) {
      clearInterval(intervalId);
      return;
    }

    const event = events[i];

    setTimeout(() => {
      event.classList.add('hero');
      if (prevEvent) {
        prevEvent.classList.remove('hero');
      }
      prevEvent = event;
    }, 250);

    i++;
  }, 500);
}

function onStopButton() {
  clearInterval(intervalId);
  stopButton.classList.remove('block');
  replayButton.classList.add('block');
  upButton.setAttribute('disabled', 'true');
  leftButton.setAttribute('disabled', 'true');
  rightButton.setAttribute('disabled', 'true');
  downButton.setAttribute('disabled', 'true');
}

function destroyBoxes() {
  boxesBlock.innerHTML = '';
  squares.textContent = 'Squares: 0';
  create.removeAttribute('disabled');
  rows.value = '';
  columns.value = '';
  rows.removeAttribute('disabled');
  columns.removeAttribute('disabled');
  controlButtons.classList.remove('flex');
  replayButton.classList.remove('block');
  events = [];
  clearInterval(intervalId);
  upButton.removeAttribute('disabled');
  leftButton.removeAttribute('disabled');
  rightButton.removeAttribute('disabled');
  downButton.removeAttribute('disabled');
}

function createBoxes(amount) {
  if (columns.value > 20) {
    Notiflix.Notify.warning('Max number of columns must be 20');
    return;
  }
  stopButton.classList.add('block');
  squares.textContent = `Squares: ${amount}`;
  rows.setAttribute('disabled', 'true');
  columns.setAttribute('disabled', 'true');
  controlButtons.classList.add('flex');
  destroy.setAttribute('disabled', 'true');
  create.setAttribute('disabled', 'true');

  for (let i = 1; i <= amount; i += 1) {
    const div = document.createElement('div');
    div.style = `width: 50px; height: 50px; background-color: white;
    border: 1px solid #5acc8e;`;
    boxesBlock.style = `width: ${columns.value * 50}px; height: 100%;`;
    boxesBlock.appendChild(div);
    div.setAttribute('id', `box${i}`);

    for (let left = 1; left <= amount; left += Number(columns.value)) {
      if (left === i) {
        div.classList.add('side-left');
      }
    }
    for (let right = amount; right > 0; right -= Number(columns.value)) {
      if (right === i) {
        div.classList.add('side-right');
      }
    }
  }
}

function createActiveDiv(activeId) {
  activeDiv = document.querySelector(`#box${activeId}`);
  activeDiv.classList.add('activeBox', 'hero');
  activeDiv.style = `background-color: white; width: 50px; height: 50px; 
    border: 1px solid #5acc8e`;
  let x = activeDiv;
  events.push(x);
  return;
}

function deleteActiveDiv(activeId) {
  let activeDivToDelete = document.querySelector(`#box${activeId}`);
  activeDivToDelete.style = `background-color: white; width: 50px; height: 50px; 
    border: 1px solid #5acc8e`;
  activeDivToDelete.classList.remove('activeBox', 'hero');
}

function movePicture(e) {
  const amount = columns.value * rows.value;
  if (amount < 1) {
    return;
  }
  // const cls = activeDiv.classList.value;
  const directionKeyboard = e.key;
  const direction = e.currentTarget.textContent;
  if (direction === 'up' || directionKeyboard === 'ArrowUp') {
    if (activeId <= columns.value) {
      upButton.setAttribute('disabled', 'true');
      return;
    }
    downButton.removeAttribute('disabled');
    deleteActiveDiv(activeId);
    createActiveDiv((activeId = Number(activeId) - Number(columns.value)));
    return;
  }

  if (direction === 'left' || directionKeyboard === 'ArrowLeft') {
    if (activeId <= columns.value) {
      upButton.setAttribute('disabled', 'true');
    }

    if (activeId >= amount - columns.value) {
      downButton.setAttribute('disabled', 'true');
    }
    if (activeId < amount - columns.value) {
      downButton.removeAttribute('disabled');
    }
    if (activeDiv.classList.value.includes('side-left')) {
      leftButton.setAttribute('disabled', 'true');
      return;
    }
    rightButton.removeAttribute('disabled');
    deleteActiveDiv(activeId);
    createActiveDiv((activeId -= 1));
    return;
  }
  if (direction === 'right' || directionKeyboard === 'ArrowRight') {
    if (activeId <= columns.value) {
      upButton.setAttribute('disabled', 'true');
    }
    if (activeId >= columns.value) {
      upButton.removeAttribute('disabled');
    }
    if (activeId >= amount - columns.value) {
      downButton.setAttribute('disabled', 'true');
    }
    if (activeDiv.classList.value.includes('side-right')) {
      rightButton.setAttribute('disabled', 'true');
      return;
    }
    leftButton.removeAttribute('disabled');
    deleteActiveDiv(activeId);
    createActiveDiv((activeId += 1));
    return;
  }
  if (direction === 'down' || directionKeyboard === 'ArrowDown') {
    if (activeId > amount - columns.value) {
      downButton.setAttribute('disabled', 'true');
      return;
    }
    upButton.removeAttribute('disabled');
    deleteActiveDiv(activeId);
    createActiveDiv((activeId = Number(activeId) + Number(columns.value)));
    return;
  }
}
