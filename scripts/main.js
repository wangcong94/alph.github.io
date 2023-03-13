const board = document.getElementById("board");
const squares = board.getElementsByTagName('td');
var score = {correct: 0, incorrect: 0};
const outerSquares = document.querySelectorAll("[id^='outerSquare']");
const flipButton = document.getElementById("flip-button");
const toggleButton = document.getElementById("toggle-button");
var selectedPiece;
var draggedPiece;
const games = getData();
var questionArray = [];
var originalTime;

localStorage.clear();
if (window.localStorage.getItem("board_highScore1") == null) {
  var board_highScore1 = 0;
} else {
  var board_highScore1 = window.localStorage.getItem("board_highScore1");
}

if (window.localStorage.getItem("board_highScore2") == null) {
  var board_highScore2 = 0;
} else {
  var board_highScore2 = window.localStorage.getItem("board_highScore2");
}

function readFEN(fen) {
  clearBoard();
  var piecePlacement = fen.split(" ")[0];
  var rows = piecePlacement.split("/");
  for (var i = 1; i <= rows.length; i++) {
    var row = rows[i-1];
    var file = 0;
    for (var j = 0; j < row.length; j++) {
      var character = row[j];
      if (isNaN(character)) {
        // character is a piece
        let files = ["a", "b", "c", "d", "e", "f", "g", "h"];
        let squareName = files[file] + parseInt(9-i);
        // convert fen piece notation to ("colour" + "piece")
        // Check if the letter is uppercase, uppercase letters represent white pieces
        if (character == character.toUpperCase()) {
          character = "w" + character.toLowerCase();
        } else {
          character = "b" + character;
        }
        generatePiece(character, squareName);
        file++;
      } else {
        // character is a number
        file += parseInt(character);
      }
    }
  }
}

// generate a random FEN, and next few moves
function generateQuestion(num_of_questions) {
  const chess = new Chess();
  chess.reset();
  game = games[Math.floor(Math.random()*games.length)];
  chess.loadPgn(game);
  moveNumber = num_of_questions + Math.floor(Math.random()*(chess.history().length - num_of_questions - num_of_questions));
  for (let i = 0; i < num_of_questions; i++) {
    // Get the destination square of the last move
    var lastMove = chess.history({verbose: true})[moveNumber + i];
    questionArray.push({move: lastMove.san, turn: lastMove.color, fen: lastMove.fen, origSquare: lastMove.from, destSquare: lastMove.to});
  }
}

//
function generateTarget() {
  if (questionArray.length === 0) {
    generateQuestion(3);
  }
  const question = questionArray.shift();
  readFEN(question.fen);
  if (question.turn === "w") {
    document.getElementById("targetColour").classList.add("whiteBox");
  } else {
    document.getElementById("targetColour").classList.remove("whiteBox");
  }
  // populate target textbox
  document.getElementById("target").textContent = question.move;
  return {
    origFEN: question.fen,
    origSquare: question.origSquare,
    destSquare: question.destSquare
  }
}

// generate piece on board given (pieceName, squareName)
function generatePiece(pieceName, squareName) {
  var chessPiece = document.createElement('div');
  chessPiece.classList.add("piece");
  chessPiece.classList.add(pieceName);
  let square = document.querySelector("[id$='"+squareName+"']");
  square.appendChild(chessPiece);
  if (flipButton.textContent == "Black") {
    chessPiece.classList.toggle("flipped");
  }
  chessPiece.setAttribute("draggable", true);
  enablePieceDrag(chessPiece);
}

function undo(errorSquare, previousFEN) {
  errorSquare.classList.toggle("incorrect");
  setTimeout(() => {
    readFEN(previousFEN);
    errorSquare.classList.toggle("incorrect");
  }, 300);
}

// checks the user click with the correct square
function checkGuess(guessPiece, destSquareAns, origSquareAns) {
  var result = "Correct";
  const destSquareGuess = getSquareName(guessPiece);
  const origSquareGuess = guessPiece.getAttribute("data-orig-square");
  if (destSquareGuess == destSquareAns && origSquareGuess == origSquareAns) {
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
  // flipping the chessPieces
  var chessPieces = board.getElementsByTagName('div');
  for (let i = 0; i < chessPieces.length; i++) {
    chessPieces[i].classList.toggle(("flipped"));
  };
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

function tryRemovingHighlight() {
  const elements = document.getElementsByClassName("highlight");
  if (elements.length > 0) {
    elements[0].classList.remove("highlight");
    return true;
  }
}

function getSquareName(element) {
  if (element.tagName === "TD") {
    return element.id.split("-")[1];
  } else if (element.tagName === "DIV") {
    let square = element.closest("td");
    return square.id.split("-")[1];
  }
}

// chess pieces drag logic. I need to refresh this function everytime I generate a new chessPiece
function enablePieceDrag(thisPiece) {
  thisPiece.addEventListener("dragstart", function(event) {
    tryRemovingHighlight();
    thisPiece.setAttribute("data-orig-square", getSquareName(thisPiece));
    thisPiece.closest("td").classList.add("highlight");
    draggedPiece = thisPiece;
  });
}

function clearBoard() {
  for (var i = 0; i < squares.length; i++) {
    if (squares[i].childNodes.length > 0) {
      squares[i].removeChild(squares[i].firstChild);
    }
  }
}

function toggleScoreAlert(scoreAlert) {
  if (scoreAlert == null) return;
  document.getElementById('scoreAlert').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
  document.getElementById("message-score").textContent = "Score: " + (score.correct - score.incorrect);
  document.getElementById("message-score-breakdown").textContent = "Correct: " + score.correct + " Incorrect: " + score.incorrect;
  let roundScore = score.correct - score.incorrect;
  if (originalTime == 30) {
    if (roundScore > board_highScore1) {
        board_highScore1 = roundScore;
        window.localStorage.setItem("board_highScore1", board_highScore1);
        document.getElementById("highScore-notification").classList.remove("hidden");
      } else {
        document.getElementById("highScore-notification").classList.add("hidden");
      }
    document.getElementById('message-highScore').textContent = "High Score: " + board_highScore1;
  } else if (originalTime == 60) {
    if (roundScore > board_highScore2) {
        board_highScore2 = roundScore;
        window.localStorage.setItem("board_highScore2", board_highScore2);
        document.getElementById("highScore-notification").classList.remove("hidden");
      } else {
        document.getElementById("highScore-notification").classList.add("hidden");
      }
    document.getElementById('message-highScore').textContent = "High Score: " + board_highScore2;
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
  questionArray = [];
  question = generateQuestion();
  target = generateTarget();
  tryRemovingHighlight();
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

//piece move logic
document.addEventListener("DOMContentLoaded", function() {
  for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function() {
      // if this is the second click
      if (tryRemovingHighlight()) {
        if (this.hasChildNodes()) {
          this.removeChild(this.firstChild);
        }
        this.appendChild(selectedPiece);
        if (getSquareName(this) != selectedPiece.getAttribute("data-orig-square")) {
          if (checkGuess(selectedPiece, target.destSquare, target.origSquare)=="Correct") {
            setTimeout(function () {
              target = generateTarget();
            }, 300);
          } else {
            undo(this, target.origFEN);
          }
        }
      } else {
        // if this is the first click
        if (!(this.childNodes[0] === undefined)) {
          selectedPiece = this.childNodes[0]; // I could also use this.firstChild()
          selectedPiece.setAttribute("data-orig-square", getSquareName(selectedPiece));
          this.classList.add("highlight");
        }
      }
    });

    squares[i].addEventListener("dragover", function(event) {
      event.preventDefault();
    });

    squares[i].addEventListener("drop", function(event) {
      event.preventDefault();
      tryRemovingHighlight();
      if (this.hasChildNodes()) {
        this.removeChild(this.firstChild);
      }
      this.appendChild(draggedPiece);
      if (getSquareName(this) != draggedPiece.getAttribute("data-orig-square")) {
        if (checkGuess(draggedPiece, target.destSquare, target.origSquare)=="Correct") {
          setTimeout(function () {
            target = generateTarget();
          }, 300);
        } else {
          undo(this, target.origFEN);
        }
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

// ------------------------ logic to remove highlight if the player clicks outside the board -------------------//
document.getElementById("content-container").addEventListener('click', (e) => {
  if(e.target !== e.currentTarget) return;
  tryRemovingHighlight();
});

document.getElementById("widget-container").addEventListener('click', (e) => {
  tryRemovingHighlight();
});

document.getElementById("navbar").addEventListener('click', (e) => {
  tryRemovingHighlight();
});
