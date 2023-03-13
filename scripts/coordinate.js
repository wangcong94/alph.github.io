const board = document.getElementById("board");
const squares = board.getElementsByTagName('td');
var score = {correct: 0, incorrect: 0};
const outerSquares = document.querySelectorAll("[id^='outerSquare']");
const flipButton = document.getElementById("flip-button");
const toggleButton = document.getElementById("toggle-button");
var originalTime;

if (window.localStorage.getItem("coordinate_highScore1") == null) {
  var coordinate_highScore1 = 0;
} else {
  var coordinate_highScore1 = window.localStorage.getItem("coordinate_highScore1");
}

if (window.localStorage.getItem("coordinate_highScore2") == null) {
  var coordinate_highScore2 = 0;
} else {
  var coordinate_highScore2 = window.localStorage.getItem("coordinate_highScore2");
}

//
function generateTarget() {
  let files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    targetCol = Math.floor(Math.random() * 8);
    targetRow = Math.floor(Math.random() * 8);
    let targetX = files[targetCol];
    let targetY = targetRow + 1;
    document.getElementById("target").textContent = targetX + targetY;
}

// checks the user click with the correct square
function checkGuess(guessSquare) {
  var result = "Correct";
  if (guessSquare == document.getElementById("target").textContent) {
    score.correct++;
    document.getElementById("result").textContent = result;
    document.getElementById("resultIcon").classList.remove("fa-circle-xmark");
    document.getElementById("resultIcon").classList.add("fa-circle-check");
    document.getElementById("resultColourBar").classList.add("correct");
    setTimeout(() => {
      document.getElementById("resultColourBar").classList.remove("correct");
    }, 500);
  } else {
    score.incorrect++;
    result = "Incorrect";
    document.getElementById("result").textContent = result;
    document.getElementById("resultColourBar").classList.add("incorrect");
    document.getElementById("resultIcon").classList.remove("fa-circle-check");
    document.getElementById("resultIcon").classList.add("fa-circle-xmark");
    setTimeout(() => {
      document.getElementById("resultColourBar").classList.remove("incorrect");
    }, 500);
  }
  document.getElementById("scoreboard").textContent = "Score: " + (score.correct-score.incorrect);
  document.getElementById("scoreboard-breakdown").textContent = "Correct: " + score.correct + " Incorrect: " + score.incorrect;
  return result;
}

function flipBoard() {
  // flipping the board
  board.classList.toggle("flipped");
  // flipping the labels
  let labels = document.querySelectorAll(".label");
  labels.forEach(label => label.classList.toggle("hidden"));
  outerSquares.forEach((outerSquare)=>{
    let rank_white = outerSquare.getAttribute("data-top");
    let rank_black = outerSquare.getAttribute("data-top-reverse");
    outerSquare.setAttribute("data-top",rank_black);
    outerSquare.setAttribute("data-top-reverse",rank_white);
    let file_white = outerSquare.getAttribute("data-bottom");
    let file_black = outerSquare.getAttribute("data-bottom-reverse");
    outerSquare.setAttribute("data-bottom",file_black);
    outerSquare.setAttribute("data-bottom-reverse",file_white);
    outerSquare.classList.toggle("rotate");
  });
  // flipping the colour indicator
  document.getElementById("targetColour").classList.toggle("whiteBox");
}

function toggleLabels() {
  outerSquares.forEach((outerSquare)=>{
    outerSquare.classList.toggle("show");
  });
}

// colour squares of td in #board using this formula I found on the internet
// I am using this because if I colour it in CSS using the nth-child selector, board colour becomes more specific than class selectors
function colourSquares() {
  let tds = document.querySelectorAll("#board td");
  tds.forEach((td, i) => {
    if(parseInt((i/8)+i)%2 == 1) {
      td.classList.toggle("darkSquare");
    } else {
      td.classList.toggle("lightSquare");
    }
  });
}

function toggleScoreAlert(scoreAlert) {
  if (scoreAlert == null) return;
  document.getElementById('scoreAlert').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
  document.getElementById("message-score").textContent = "Score: " + (score.correct - score.incorrect);
  document.getElementById("message-score-breakdown").textContent = "Correct: " + score.correct + " Incorrect: " + score.incorrect;
  let roundScore = score.correct - score.incorrect;
  if (originalTime == 30) {
    if (roundScore > coordinate_highScore1) {
        coordinate_highScore1 = roundScore;
        window.localStorage.setItem("coordinate_highScore1", coordinate_highScore1);
        document.getElementById("highScore-notification").classList.remove("hidden");
      } else {
        document.getElementById("highScore-notification").classList.add("hidden");
      }
    document.getElementById('message-highScore').textContent = "High Score: " + coordinate_highScore1;
  } else if (originalTime == 60) {
    if (roundScore > coordinate_highScore2) {
        coordinate_highScore2 = roundScore;
        window.localStorage.setItem("coordinate_highScore2", coordinate_highScore2);
        document.getElementById("highScore-notification").classList.remove("hidden");
      } else {
        document.getElementById("highScore-notification").classList.add("hidden");
      }
    document.getElementById('message-highScore').textContent = "High Score: " + coordinate_highScore2;
    }
}

function setTimer(timeLeft) {
  var minutes = Math.floor(timeLeft/60);
  var seconds = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function togglePlay_Stop() {
  let playButtonIcon = document.getElementById('playButtonIcon');
  let playButton = document.getElementById('playButton');
  playButtonIcon.classList.toggle("fa-play");
  playButtonIcon.classList.toggle("fa-stop");
  document.getElementById("timeChoice").classList.toggle("hidden");
  document.getElementById("timer").classList.toggle("hidden");
  if (playButton.getAttribute("data-button-state") == "play") {
    playButton.setAttribute("data-button-state", "stop");
  } else {
    playButton.setAttribute("data-button-state", "play");
  }
}

function timeToSeconds(time) {
  let parts = time.split(":");
  return parseInt(parts[0], 10)*60 + parseInt(parts[1],10);
}

function resetBoard() {
  score = {correct: 0, incorrect: 0, high:0};
  document.getElementById("scoreboard").textContent = "Score: " + (score.correct-score.incorrect);
  document.getElementById("scoreboard-breakdown").textContent = "Correct: " + score.correct + " Incorrect: " + score.incorrect;
  document.getElementById("result").textContent = "";
  document.getElementById("resultIcon").classList.remove("fa-circle-check");
  document.getElementById("resultIcon").classList.remove("fa-circle-xmark");
  target = generateTarget();
}

function startTimer() {
  resetBoard();
  var timeLeft = timeToSeconds(document.getElementById('timeChoice').value);
  originalTime = timeLeft;
  setTimer(timeLeft);
  timer = setInterval(() => {
    if (document.getElementById('playButton').getAttribute("data-button-state")=="play") {
      clearInterval(timer);
      return;
    }
    timeLeft--;
    setTimer(timeLeft);
    // Check if time is up
    if (timeLeft === 0) {
      toggleScoreAlert(scoreAlert);
      togglePlay_Stop();
      clearInterval(timer);
    }
  }, 1000);
}

// ------------------------ Main Starts Here -----------------------------------------
colourSquares();
resetBoard();

// logic when a square is clicked
document.addEventListener("DOMContentLoaded", function() {
  for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function() {
      if (checkGuess(this.id.split("-")[1]) == "Correct") {
        this.classList.toggle("correct");
        setTimeout(() => {
          this.classList.toggle("correct");
        }, 300);
        generateTarget();
      } else {
        this.classList.toggle("incorrect");
        setTimeout(() => {
          this.classList.toggle("incorrect");
        }, 300);
      }
    });
  }
});

document.getElementById('close-button').addEventListener('click', () => {
    toggleScoreAlert(scoreAlert);
  });

// Add a click event listener to the play button
document.getElementById('playButton').addEventListener('click', () => {
  let buttonState = document.getElementById('playButton').getAttribute("data-button-state")
  togglePlay_Stop();
  if (buttonState === "play") {
    // if current buttonState is "play", pressing the button starts it.
    startTimer();
  } else {
    toggleScoreAlert(scoreAlert);
  }
});

flipButton.addEventListener("click", flipBoard);
toggleButton.addEventListener("click", toggleLabels);

document.getElementById('icon-info').addEventListener('click', () => {
  document.getElementById('instructions').classList.toggle("hidden");
});

document.getElementById('close-instructions').addEventListener('click', () => {
  document.getElementById('instructions').classList.add("hidden");
});
