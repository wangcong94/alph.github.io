const board = document.getElementById("board");
let targetRow;
let targetCol;
let correct = 0;
let incorrect = 0;




// generate a random chess coordinate
function generateTarget() {
    let files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    targetCol = Math.floor(Math.random() * 8);
    targetRow = Math.floor(Math.random() * 8);
    let targetX = files[targetCol];
    let targetY = targetRow + 1;
    document.getElementById("target").textContent = targetX + targetY;
}

// checks the user click with the correct square
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


function flipBoard() {
    board.classList.toggle("flipped");
    let flipButton = document.getElementById("flip-button");
    let flipButtonText = flipButton.textContent;
    flipButton.textContent = flipButton.getAttribute("data-text");
    flipButton.setAttribute("data-text", flipButtonText);
    let labels = document.querySelectorAll(".label");
    labels.forEach(label => label.classList.toggle("hidden"));



    outerCells.forEach((outerCell)=>{
        let rank_white = outerCell.getAttribute("data-top");
        let rank_black = outerCell.getAttribute("data-top-reverse");
        outerCell.setAttribute("data-top",rank_black);
        outerCell.setAttribute("data-top-reverse",rank_white);

        let file_white = outerCell.getAttribute("data-bottom");
        let file_black = outerCell.getAttribute("data-bottom-reverse");
        outerCell.setAttribute("data-bottom",file_black);
        outerCell.setAttribute("data-bottom-reverse",file_white);

        outerCell.classList.toggle("rotate");
    });

}

function toggleLabels() {
  outerCells.forEach((outerCell)=>{
    outerCell.classList.toggle("show");
  });
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


const flipButton = document.getElementById("flip-button");
const outerCells = document.querySelectorAll("[id^='outercell']");
flipButton.addEventListener("click", flipBoard);

const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", toggleLabels);
