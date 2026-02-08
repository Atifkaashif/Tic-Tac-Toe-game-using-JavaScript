const board = document.getElementById("board");
const statusText = document.getElementById("status");
const winLine = document.getElementById("win-line");
const confettiContainer = document.getElementById("confetti-container");
const winSound = document.getElementById("winSound");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");

let currentPlayer = "X";
let gameActive = true;
let cells = Array(9).fill("");

let scoreX = 0;
let scoreO = 0;

const winningCombos = [
  { combo: [0,1,2], line: "row1" },
  { combo: [3,4,5], line: "row2" },
  { combo: [6,7,8], line: "row3" },
  { combo: [0,3,6], line: "col1" },
  { combo: [1,4,7], line: "col2" },
  { combo: [2,5,8], line: "col3" },
  { combo: [0,4,8], line: "diag1" },
  { combo: [2,4,6], line: "diag2" }
];

createBoard();

function createBoard() {
  board.querySelectorAll(".cell").forEach(c => c.remove());

  cells.forEach((_, i) => {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(i, cell));
    board.appendChild(cell);
  });
}

function handleClick(index, cell) {
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  if (checkWinner()) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    updateScore();
    winSound.play();
    launchConfetti();
    gameActive = false;
    return;
  }

  if (!cells.includes("")) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {
  for (let win of winningCombos) {
    if (win.combo.every(i => cells[i] === currentPlayer)) {
      drawWinLine(win.line);
      return true;
    }
  }
  return false;
}

function drawWinLine(type) {
  winLine.style.display = "block";

  const styles = {
    row1: "top:45px;",
    row2: "top:145px;",
    row3: "top:245px;",
    col1: "transform: rotate(90deg); top:145px; left:-90px;",
    col2: "transform: rotate(90deg); top:145px;",
    col3: "transform: rotate(90deg); top:145px; left:90px;",
    diag1: "transform: rotate(45deg); top:145px;",
    diag2: "transform: rotate(-45deg); top:145px;"
  };

  winLine.style.cssText += styles[type];
}

function updateScore() {
  if (currentPlayer === "X") {
    scoreX++;
    scoreXText.textContent = scoreX;
  } else {
    scoreO++;
    scoreOText.textContent = scoreO;
  }
}

function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.classList.add("confetti");
    c.style.left = Math.random() * 100 + "vw";
    c.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
    c.style.animationDuration = Math.random()*2 + 2 + "s";
    confettiContainer.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  cells.fill("");
  statusText.textContent = "Player X's Turn";
  winLine.style.display = "none";
  winLine.style.cssText = "";
  confettiContainer.innerHTML = "";
  createBoard();
}
