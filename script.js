const board = document.getElementById("board");
let targetRow;
let targetCol;
let correct = 0;
let incorrect = 0;


function generateTarget() {
    let files = ["A", "B", "C", "D", "E", "F", "G", "H"];
    targetCol = Math.floor(Math.random() * 8);
    targetRow = Math.floor(Math.random() * 8);
    let targetX = files[targetCol];
    let targetY = targetRow + 1;
    document.getElementById("target").textContent = targetX + targetY;
}

function checkGuess(col, row) {
    let result = "Correct!";
    if (col === targetCol + 1 && row === targetRow + 1) {
        correct++;
        document.getElementById("result_wrapper").classList.add("correct");
        setTimeout(() => {
            document.getElementById("result_wrapper").classList.remove("correct");
        }, 500);
    } else {
        incorrect++;
        result = "Incorrect"
        document.getElementById("result_wrapper").classList.add("incorrect");
        setTimeout(() => {
            document.getElementById("result_wrapper").classList.remove("incorrect");
        }, 500);
    }
    document.getElementById("result").textContent = result;
    document.getElementById("scoreboard").textContent = "Correct: " + correct + " Incorrect: " + incorrect;
}


window.onload = function() {
    generateTarget();
}

board.addEventListener("click", function(event) {
    // check if click event was on a cell of the chessboard
    if (event.target.id.includes("cell")) {
        let row = parseInt(event.target.id.split("-")[1]);
        let col = parseInt(event.target.id.split("-")[2]);
        checkGuess(col, row);
        generateTarget();
    }
});


let flipButton = document.getElementById("flip-button");
flipButton.addEventListener("click", flipBoard);

function flipBoard() {
    board.classList.toggle("flipped");
    let flipButton = document.getElementById("flip-button");
    let flipButtonText = flipButton.textContent;
    flipButton.textContent = flipButton.getAttribute("data-text");
    flipButton.setAttribute("data-text", flipButtonText);
    let labels = document.querySelectorAll(".label");
    labels.forEach(label => label.classList.toggle("hidden"));
}

let toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", toggleLabels);

function toggleLabels() {
    let labels = document.querySelectorAll(".label");
    labels.forEach(function(label) {
        label.classList.toggle("hiddenlabel");
    });
}
