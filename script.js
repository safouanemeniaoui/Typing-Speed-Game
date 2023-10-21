let oTime = 0;
let newTable = [];
let levels = document.querySelector("[name = 'levels']");
let tabLevels = Array.from(levels);
let instructionsList = document.querySelector(".instructions ul");
let instructionsTitle = document.querySelector(".instructions h3");
let topInstruction = document.querySelector(".container p");

let wordList = document.querySelector(".word-list");
let wordListP = document.querySelector(".word-list p");
let counter = document.querySelector(".counter");
let startBtn = document.querySelector(".start-btn");
let resetBtn = document.querySelector(".reset");
let clearBtn = document.querySelector(".clear");
let wordToWrite = document.querySelector(".word-to-write");
let error = document.querySelector(".error");
let message = document.querySelector(".message");
let mainInput = document.querySelector(".main-input");
let score = document.querySelector(".score");
let total = document.querySelector(".total");
let scTable = document.querySelector(".scores-list tbody");
let disabled = document.createAttribute("disabled");
mainInput.setAttributeNode(disabled);
// List of words - easy level
let easyLevel = [
  "cat",
  "dog",
  "fish",
  "bird",
  "rose",
  "moon",
  "sun",
  "ball",
  "cake",
  "duck",
  "ant",
  "bear",
  "frog",
  "star",
  "lamp",
  "tree",
  "book",
  "hat",
  "song",
  "nail",
];
// List of words - medium level
let mediumLevel = [
  "apple",
  "banana",
  "orange",
  "grapes",
  "lemon",
  "cherry",
  "carrot",
  "tomato",
  "potato",
  "pencil",
  "rabbit",
  "guitar",
  "jacket",
  "turtle",
  "flower",
  "butter",
  "coffee",
  "wallet",
  "silver",
  "purple",
];
// List of words - hard level
let hardLevel = [
  "elephant",
  "keyboard",
  "umbrella",
  "sunshine",
  "mountain",
  "dolphin",
  "butterfly",
  "backpack",
  "pineapple",
  "telephone",
  "hamburger",
  "television",
  "waterfall",
  "headphones",
  "snowflake",
  "caterpillar",
  "skyscraper",
  "restaurant",
  "strawberry",
  "helicopter",
];

if (window.localStorage.getItem("scorelist")) {
  let newAr = JSON.parse(window.localStorage.getItem("scorelist"));
  newAr.forEach((el) => {
    createRow(el.level, el.score, el.date);
  });
}

levels.onchange = function () {
  instructions(levels.value);
  listWord(levels.value);
  error.style.display = "none";
  if (levels.value == "easy") {
    total.innerHTML = easyLevel.length;
  } else if (levels.value == "medium") {
    total.innerHTML = mediumLevel.length;
  } else if (levels.value == "hard") {
    total.innerHTML = hardLevel.length;
  } else {
    total.innerHTML = "0";
  }
};

startBtn.onclick = function () {
  if (levels.value != "no") {
    mainInput.removeAttributeNode(disabled);
    mainInput.focus();
    startBtn.style.display = "none";
    error.style.display = "none";
    levels.value == "easy"
      ? changeWord(easyLevel)
      : levels.value == "medium"
      ? changeWord(mediumLevel)
      : changeWord(hardLevel);
  } else {
    error.innerHTML = "choose level please";
    error.style.display = "block";
  }
};

resetBtn.onclick = function () {
  location.reload();
};
clearBtn.onclick = function () {
  window.localStorage.clear();
  location.reload();
};

// Setup Instructions function

function instructions(val) {
  if (val == "no") {
    instructionsList.style.display = "none";
    instructionsTitle.innerHTML = "no instructions";
    topInstruction.innerHTML = "no instructions - choose level";
  } else {
    instructionsList.style.display = "block";
    topInstruction.innerHTML =
      "you are playing on [ <span class='level'></span> ] level & you have [ <span class='time'></span> ] seconds to type the word";
    instructionsTitle.innerHTML =
      "instuction for <span class='level'></span> level";
  }
  let level = document.querySelectorAll(".level");
  let time = document.querySelectorAll(".time");

  level.forEach((el) => {
    el.innerHTML = val;
  });

  tabLevels.forEach((t) => {
    if (t.value == val) {
      oTime = t.dataset.set;
    }
  });
  time.forEach((el) => {
    el.innerHTML = oTime;
  });
}

// Create span function

function createSpan(el) {
  let span = document.createElement("span");
  span.innerHTML = el;
  wordList.appendChild(span);
  wordListP.style.display = "none";
}

// Print words list function

function listWord(val) {
  if (val === "easy") {
    wordList.innerHTML = "";
    easyLevel.forEach((el) => {
      createSpan(el);
    });
  } else if (val === "medium") {
    wordList.innerHTML = "";
    mediumLevel.forEach((el) => {
      createSpan(el);
    });
  } else if (val === "hard") {
    wordList.innerHTML = "";
    hardLevel.forEach((el) => {
      createSpan(el);
    });
  } else {
    wordList.innerHTML = "<p>words will show here</p>";
  }
}

// Change word function

function changeWord(table = []) {
  let state = false;
  newTable = newTable.concat(table);
  wordToWrite.innerHTML = randomWord(newTable);
  counter.textContent = +counter.textContent + 3;
  let count = setInterval(() => {
    if (state == false) {
      counter.textContent -= 1;
    }
    mainInput.addEventListener("input", function () {
      if (mainInput.value.toLowerCase() == wordToWrite.innerHTML) {
        score.textContent++;
        mainInput.value = "";
        if (newTable.length != 0) {
          counter.textContent = oTime;
        }
        if (state == true) {
          clearInterval(count);
        }
        if (newTable.length == 0) {
          state = true;
          message.innerHTML = "Congrats";
          message.style.color = "#009688";
          clearInterval(count);
          resetBtn.style.display = "block";
          saveLocal(levels.value, score.textContent);
          createRow(levels.value, score.textContent, getDate());
        }
        if (state == false) {
          wordToWrite.innerHTML = randomWord(newTable);
        }
      }
    });
    if (counter.textContent <= 0) {
      message.innerHTML = "game over";
      message.style.color = "red";
      clearInterval(count);
      resetBtn.style.display = "block";
      saveLocal(levels.value, score.textContent);
      createRow(levels.value, score.textContent, getDate());
    }
  }, 1000);
}

// Select random value from table function

function randomWord(table = []) {
  let val = Math.trunc(Math.random() * table.length);
  let word = table[val];
  table.splice(val, 1);
  return word;
}

// Get date function

function getDate() {
  date = new Date();
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  let newDate = d + "/" + m + "/" + y;
  console.log(newDate);
  return newDate;
}

// Save to local storage
let sdata = [];
function saveLocal(lv, sc) {
  let obj = new Object();
  obj.level = lv;
  obj.score = sc;
  obj.date = getDate();
  if (window.localStorage.getItem("scorelist")) {
    sdata = sdata.concat(JSON.parse(window.localStorage.getItem("scorelist")));
    sdata.push(obj);
    window.localStorage.setItem("scorelist", JSON.stringify(sdata));
  } else {
    sdata.push(obj);
    window.localStorage.setItem("scorelist", JSON.stringify(sdata));
  }
}

// Create row in table

function createRow(l, s, d) {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  td1.innerHTML = l;
  td2.innerHTML = s;
  td3.innerHTML = d;

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  scTable.appendChild(tr);
}

// Disable selection

wordToWrite.onselectstart = function () {
  return false;
};
wordList.onselectstart = function () {
  return false;
};
