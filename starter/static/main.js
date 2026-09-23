const SIZE = 9;
const STORAGE_KEY = 'sudoku-top10';
let puzzle = [];
let solution = [];
let gameStartedAt = null;
let timerInterval = null;
let hintsUsed = 0;
let difficulty = 'medium';
let solved = false;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  clearInterval(timerInterval);
  gameStartedAt = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - gameStartedAt) / 1000);
    document.getElementById('timer').textContent = formatTime(elapsed);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function setMessage(text, tone = 'info') {
  const message = document.getElementById('message');
  message.textContent = text;
  message.style.color = tone === 'error' ? '#dc2626' : tone === 'success' ? '#1f9d61' : '#60708a';
}

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.dataset.row = row;
      input.dataset.col = col;
      input.dataset.fixed = 'false';
      input.dataset.hint = 'false';
      input.dataset.isIncorrect = 'false';
      input.dataset.box = String(Math.floor(row / 3) * 3 + Math.floor(col / 3));
      input.addEventListener('input', (event) => {
        const target = event.target;
        const value = target.value.replace(/[^1-9]/g, '').slice(0, 1);
        target.value = value;
        if (target.dataset.fixed === 'true') {
          target.value = '';
          return;
        }
        target.dataset.isIncorrect = 'false';
        target.classList.remove('incorrect');
        if (value) {
          validateLiveBoard();
        }
      });
      boardDiv.appendChild(input);
    }
  }
}

function renderPuzzle(puz, sol) {
  puzzle = puz;
  solution = sol;
  createBoardElement();
  const inputs = document.querySelectorAll('.sudoku-cell');

  inputs.forEach((input) => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    const value = puz[row][col];
    const fixed = value !== 0;
    input.dataset.fixed = String(fixed);
    input.dataset.hint = 'false';
    input.dataset.isIncorrect = 'false';
    input.value = fixed ? String(value) : '';
    input.disabled = fixed;
    if (fixed) {
      input.classList.add('prefilled');
    }
  });

  solved = false;
  hintsUsed = 0;
  setMessage('');
  startTimer();
}

function getBoardFromInputs() {
  const cells = document.querySelectorAll('.sudoku-cell');
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = cell.value.trim();
    board[row][col] = value ? parseInt(value, 10) : 0;
  });

  return board;
}

function hasDuplicateConflict(board, row, col, value) {
  if (!value) {
    return false;
  }

  for (let c = 0; c < SIZE; c++) {
    if (c !== col && board[row][c] === value) {
      return true;
    }
  }

  for (let r = 0; r < SIZE; r++) {
    if (r !== row && board[r][col] === value) {
      return true;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        return true;
      }
    }
  }

  return false;
}

function validateLiveBoard() {
  const cells = document.querySelectorAll('.sudoku-cell');
  const board = getBoardFromInputs();

  cells.forEach((cell) => {
    cell.classList.remove('incorrect', 'conflict');
    cell.dataset.isIncorrect = 'false';
    cell.dataset.conflict = 'false';

    if (cell.dataset.fixed === 'true') {
      return;
    }

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = cell.value ? Number(cell.value) : 0;
    const conflict = hasDuplicateConflict(board, row, col, value);
    const incorrect = value !== 0 && value !== solution[row][col];

    cell.dataset.isIncorrect = String(incorrect);
    cell.dataset.conflict = String(conflict);
    cell.classList.toggle('incorrect', incorrect);
    cell.classList.toggle('conflict', conflict);
  });
}

async function fetchNewPuzzle() {
  const response = await fetch(`/new?difficulty=${encodeURIComponent(difficulty)}`);
  const data = await response.json();
  if (!response.ok || !data.puzzle) {
    throw new Error(data.error || 'Unable to create a valid sudoku puzzle.');
  }
  return data;
}

async function newGame() {
  try {
    const payload = await fetchNewPuzzle();
    solution = payload.solution;
    renderPuzzle(payload.puzzle, payload.solution);
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

async function checkSolution() {
  const board = getBoardFromInputs();
  const response = await fetch('/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board })
  });

  const data = await response.json();
  const cells = document.querySelectorAll('.sudoku-cell');

  cells.forEach((cell) => {
    cell.classList.remove('incorrect', 'conflict');
    cell.dataset.isIncorrect = 'false';
    cell.dataset.conflict = 'false';

    if (cell.dataset.fixed === 'true') {
      return;
    }

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = cell.value ? Number(cell.value) : 0;
    const conflict = hasDuplicateConflict(board, row, col, value);
    const incorrect = value !== 0 && value !== solution[row][col];

    cell.dataset.isIncorrect = String(incorrect);
    cell.dataset.conflict = String(conflict);
    cell.classList.toggle('incorrect', incorrect);
    cell.classList.toggle('conflict', conflict);
  });

  if (!response.ok) {
    setMessage(data.error || 'Something went wrong.', 'error');
    return;
  }

  if (data.solved) {
    solved = true;
    stopTimer();
    const elapsed = Math.floor((Date.now() - gameStartedAt) / 1000);
    const name = window.prompt('Congratulations! Enter your name for the Top 10 leaderboard:');
    if (name && name.trim()) {
      saveScore(name.trim(), elapsed, hintsUsed, difficulty);
    }
    setMessage(`Congratulations! You solved the ${difficulty} puzzle in ${formatTime(elapsed)}.`, 'success');
    return;
  }

  setMessage('Some entries are incorrect. Keep going!', 'error');
}

function saveScore(name, elapsedSeconds, hintsUsedCount, difficultyLevel) {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  raw.push({
    name,
    time: elapsedSeconds,
    hintsUsed: hintsUsedCount,
    difficulty: difficultyLevel,
  });

  raw.sort((a, b) => a.time - b.time);
  const topTen = raw.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topTen));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  leaderboard.innerHTML = '';

  if (!entries.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No scores yet</td>';
    leaderboard.appendChild(row);
    return;
  }

  entries.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${index + 1}</td>
      <td>${entry.name}</td>
      <td>${formatTime(entry.time)}</td>
      <td>${entry.difficulty}</td>
      <td>${entry.hintsUsed} hint(s)</td>
    `;
    leaderboard.appendChild(row);
  });
}

function giveHint() {
  if (solved) {
    return;
  }

  const emptyCells = [];
  const inputs = document.querySelectorAll('.sudoku-cell');

  inputs.forEach((cell) => {
    if (cell.dataset.fixed === 'true') {
      return;
    }
    const value = cell.value ? Number(cell.value) : 0;
    if (value === 0) {
      emptyCells.push(cell);
    }
  });

  if (!emptyCells.length) {
    setMessage('No empty cells left to hint.', 'info');
    return;
  }

  const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const row = Number(target.dataset.row);
  const col = Number(target.dataset.col);
  target.value = String(solution[row][col]);
  target.dataset.fixed = 'true';
  target.dataset.hint = 'true';
  target.disabled = true;
  target.classList.add('hint');
  hintsUsed += 1;
  setMessage(`Hint used. ${hintsUsed} hint(s) used so far.`, 'info');
}

function enableInputEvents() {
  const difficultySelect = document.getElementById('difficulty-select');
  difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
    newGame();
  });

  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('hint-button').addEventListener('click', giveHint);
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = localStorage.getItem('sudoku-theme') === 'dark';
  document.body.classList.toggle('dark', prefersDark);
  themeToggle.querySelector('.theme-icon').textContent = prefersDark ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('sudoku-theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
  });
}

window.addEventListener('load', async () => {
  renderLeaderboard();
  enableInputEvents();
  await newGame();
});