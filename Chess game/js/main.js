const piece = document.querySelector(".piece");
const empties = document.querySelectorAll(".square");

// piece listeners
piece.addEventListener('dragstart', dragStart);
piece.addEventListener('dragend', dragEnd);

//Loop through empties and call drag events
for (const square of empties) {
  square.addEventListener("dragover", dragOver);
  square.addEventListener('dragenter', dragEnter);
  square.addEventListener('drop', dragDrop);
}
//Drag functions
function dragStart() {
  setTimeout(() => (this.className = "invisible"), 0);
  console.log("drag start");
}

function dragEnd() {
  this.className = "piece"
  console.log("drag end");
}

function dragOver() {
  event.preventDefault();
}

function dragEnter() {
  event.preventDefault();
}

function dragDrop() {
  this.className = "square";
  this.append(piece);
  console.log("drop");
}
