import Notiflix from "notiflix";

const create = document.querySelector("[data-create");
const destroy = document.querySelector("[data-destroy]");
const boxesBlock = document.querySelector("#boxes");
const columns = document.querySelector("#controls .columns");
const rows = document.querySelector("#controls .rows");
const squares = document.querySelector("#squaresCounter p");
const controlButtons = document.querySelector(".buttonsBox");
const upButton = document.querySelector(".up-button");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");
const downButton = document.querySelector(".down-button");

create.addEventListener("click", getAmount);
destroy.addEventListener("click", destroyBoxes);
upButton.addEventListener("click", movePicture);
leftButton.addEventListener("click", movePicture);
rightButton.addEventListener("click", movePicture);
downButton.addEventListener("click", movePicture);

let activeId;
let activeDiv;

function getAmount() {
  const amount = columns.value * rows.value;
  if (amount === 0) {
    Notiflix.Notify.warning("Please, enter the number of rows and columns");
    return;
  }
  squares.textContent = `Squares: ${amount}`;
  activeId = Math.round(amount / 2);
  createBoxes(amount);
  createActiveDiv(activeId);
}

function destroyBoxes() {
  boxesBlock.innerHTML = "";
  squares.textContent = "Squares: 0";
  create.removeAttribute("disabled");
  rows.value = "";
  columns.value = "";
  controlButtons.classList.remove("flex");
}

function createBoxes(amount) {
  controlButtons.classList.add("flex");
  for (let i = 0; i < amount; i += 1) {
    const div = document.createElement("div");
    div.style = `width: 50px; height: 50px; background-color: white;
    border: 1px solid black`;
    boxesBlock.style = `width: ${
      columns.value * 50 + columns.value * 2
    }px; height: ${rows.value * 50 + rows.value * 2}px;`;
    boxesBlock.appendChild(div);
    div.setAttribute("id", `box${i}`);
    create.setAttribute("disabled", "true");
  }
}

function createActiveDiv(activeId) {
  let activeDiv = document.querySelector(`#box${activeId}`);
  activeDiv.setAttribute("class", "activeBox");
  activeDiv.style = `background-color: red; width: 50px; height: 50px; 
    border: 1px solid black`;
  return;
}

function deleteActiveDiv(activeId) {
  let activeDivToDelete = document.querySelector(`#box${activeId}`);
  activeDivToDelete.style = `background-color: white; width: 50px; height: 50px; 
    border: 1px solid black`;
  activeDivToDelete.removeAttribute("class");
}

function movePicture(e) {
  const amount = columns.value * rows.value;
  const direction = e.currentTarget.textContent;
  if (direction === "up") {
    if (activeId < columns.value) {
      upButton.setAttribute("disabled", "true");
      return;
    }
    downButton.removeAttribute("disabled");
    deleteActiveDiv(activeId);
    createActiveDiv((activeId = Number(activeId) - Number(columns.value)));
    return;
  }

  if (direction === "left") {
    if (activeId <= columns.value) {
      upButton.setAttribute("disabled", "true");
    }

    if (activeId >= amount - columns.value - 1) {
      downButton.setAttribute("disabled", "true");
    }
    if (activeId < amount - columns.value + 1) {
      downButton.removeAttribute("disabled");
    }
    if (activeId === 0) {
      leftButton.setAttribute("disabled", "true");
      deleteActiveDiv(activeId);
      createActiveDiv(0);
      return;
    }
    rightButton.removeAttribute("disabled");
    deleteActiveDiv(activeId);
    createActiveDiv((activeId -= 1));
    return;
  }
  if (direction === "right") {
    if (activeId <= columns.value + 1) {
      upButton.setAttribute("disabled", "true");
    }
    if (activeId >= columns.value - 1) {
      upButton.removeAttribute("disabled");
    }
    if (activeId >= amount - columns.value - 1) {
      downButton.setAttribute("disabled", "true");
    }
    if (activeId === amount - 1) {
      rightButton.setAttribute("disabled", "true");
      deleteActiveDiv(activeId);
      createActiveDiv(amount - 1);
      return;
    }
    leftButton.removeAttribute("disabled");
    deleteActiveDiv(activeId);
    createActiveDiv((activeId += 1));
    return;
  }
  if (direction === "down") {
    if (activeId >= amount - columns.value) {
      downButton.setAttribute("disabled", "true");
      return;
    }
    upButton.removeAttribute("disabled");
    deleteActiveDiv(activeId);
    createActiveDiv((activeId = Number(activeId) + Number(columns.value)));
    return;
  }
}
