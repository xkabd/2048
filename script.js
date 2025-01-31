const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const undoButton = document.getElementById('undo-button');
const resetButton = document.getElementById('reset-button');
const undoCountElement = document.getElementById('undo-count');
const endButton = document.getElementById('end-button');
const congratsElement = document.getElementById('congrats');
const winScreen = document.getElementById('win-screen');
const loseScreen = document.getElementById('lose-screen');
const winScoreElement = document.getElementById('win-score');
const winTimeElement = document.getElementById('win-time');
const winUndoElement = document.getElementById('win-undo');
const loseScoreElement = document.getElementById('lose-score');
const loseTimeElement = document.getElementById('lose-time');
const loseUndoElement = document.getElementById('lose-undo');
const restartWinButton = document.getElementById('restart-win');
const restartLoseButton = document.getElementById('restart-lose');

let board = [];
let score = 0;
let time = 0;
let interval;
let undoState = [];
let undoCount = 5;
let gameWon = false;
let gameOver = false;

const tileColors = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
};

function initBoard() {
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        renderBoard();
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (board[i][j] !== 0) {
                tile.textContent = board[i][j];
                tile.style.backgroundColor = tileColors[board[i][j]];
                tile.classList.add('appear');
                setTimeout(() => {
                    tile.classList.add('active');
                }, 10);
            }
            gameBoard.appendChild(tile);
        }
    }
    scoreElement.textContent = score;
}

function move(direction) {
    if (gameOver) return;
    const prevBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            for (let i = 1; i < 4; i++) {
                if (board[i][j] !== 0) {
                    let k = i;
                    while (k > 0 && board[k - 1][j] === 0) {
                        board[k - 1][j] = board[k][j];
                        board[k][j] = 0;
                        k--;
                        moved = true;
                        const tile = document.querySelector(`.tile:nth-child(${(k * 4) + j + 1})`);
                        if (tile) {
                            tile.classList.add('move');
                            tile.style.transform = `translateY(-${(i - k) * 80}px)`;
                            setTimeout(() => {
                                tile.classList.remove('move');
                                tile.style.transform = '';
                            }, 300);
                        }
                    }
                    if (k > 0 && board[k - 1][j] === board[k][j]) {
                        board[k - 1][j] *= 2;
                        board[k][j] = 0;
                        score += board[k - 1][j];
                        moved = true;
                        checkCongrats(board[k - 1][j]);
                        if (board[k - 1][j] === 2048) {
                            gameWon = true;
                            endButton.style.display = 'block';
                        }
                        const tile = document.querySelector(`.tile:nth-child(${(k - 1) * 4 + j + 1})`);
                        tile.classList.add('merge');
                        setTimeout(() => {
                            tile.classList.add('active');
                            setTimeout(() => {
                                tile.classList.remove('merge', 'active');
                            }, 300);
                        }, 10);
                    }
                }
            }
        }
    } else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
            for (let i = 2; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    let k = i;
                    while (k < 3 && board[k + 1][j] === 0) {
                        board[k + 1][j] = board[k][j];
                        board[k][j] = 0;
                        k++;
                        moved = true;
                        const tile = document.querySelector(`.tile:nth-child(${(k + 1) * 4 + j + 1})`);
                        if (tile) {
                            tile.classList.add('move');
                            tile.style.transform = `translateY(${(k - i) * 80}px)`;
                            setTimeout(() => {
                                tile.classList.remove('move');
                                tile.style.transform = '';
                            }, 300);
                        }
                    }
                    if (k < 3 && board[k + 1][j] === board[k][j]) {
                        board[k + 1][j] *= 2;
                        board[k][j] = 0;
                        score += board[k + 1][j];
                        moved = true;
                        checkCongrats(board[k + 1][j]);
                        if (board[k + 1][j] === 2048) {
                            gameWon = true;
                            endButton.style.display = 'block';
                        }
                        const tile = document.querySelector(`.tile:nth-child(${(k + 1) * 4 + j + 1})`);
                        tile.classList.add('merge');
                        setTimeout(() => {
                            tile.classList.add('active');
                            setTimeout(() => {
                                tile.classList.remove('merge', 'active');
                            }, 300);
                        }, 10);
                    }
                }
            }
        }
    } else if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                if (board[i][j] !== 0) {
                    let k = j;
                    while (k > 0 && board[i][k - 1] === 0) {
                        board[i][k - 1] = board[i][k];
                        board[i][k] = 0;
                        k--;
                        moved = true;
                        const tile = document.querySelector(`.tile:nth-child(${i * 4 + k + 1})`);
                        if (tile) {
                            tile.classList.add('move');
                            tile.style.transform = `translateX(-${(j - k) * 80}px)`;
                            setTimeout(() => {
                                tile.classList.remove('move');
                                tile.style.transform = '';
                            }, 300);
                        }
                    }
                    if (k > 0 && board[i][k - 1] === board[i][k]) {
                        board[i][k - 1] *= 2;
                        board[i][k] = 0;
                        score += board[i][k - 1];
                        moved = true;
                        checkCongrats(board[i][k - 1]);
                        if (board[i][k - 1] === 2048) {
                            gameWon = true;
                            endButton.style.display = 'block';
                        }
                        const tile = document.querySelector(`.tile:nth-child(${i * 4 + (k - 1) + 1})`);
                        tile.classList.add('merge');
                        setTimeout(() => {
                            tile.classList.add('active');
                            setTimeout(() => {
                                tile.classList.remove('merge', 'active');
                            }, 300);
                        }, 10);
                    }
                }
            }
        }
    } else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            for (let j = 2; j >= 0; j--) {
                if (board[i][j] !== 0) {
                    let k = j;
                    while (k < 3 && board[i][k + 1] === 0) {
                        board[i][k + 1] = board[i][k];
                        board[i][k] = 0;
                        k++;
                        moved = true;
                        const tile = document.querySelector(`.tile:nth-child(${i * 4 + (k + 1) + 1})`);
                        if (tile) {
                            tile.classList.add('move');
                            tile.style.transform = `translateX(${(k - j) * 80}px)`;
                            setTimeout(() => {
                                tile.classList.remove('move');
                                tile.style.transform = '';
                            }, 300);
                        }
                    }
                    if (k < 3 && board[i][k + 1] === board[i][k]) {
                        board[i][k + 1] *= 2;
                        board[i][k] = 0;
                        score += board[i][k + 1];
                        moved = true;
                        checkCongrats(board[i][k + 1]);
                        if (board[i][k + 1] === 2048) {
                            gameWon = true;
                            endButton.style.display = 'block';
                        }
                        const tile = document.querySelector(`.tile:nth-child(${i * 4 + (k + 1) + 1})`);
                        tile.classList.add('merge');
                        setTimeout(() => {
                            tile.classList.add('active');
                            setTimeout(() => {
                                tile.classList.remove('merge', 'active');
                            }, 300);
                        }, 10);
                    }
                }
            }
        }
    }
    if (moved) {
        undoState.push(JSON.parse(JSON.stringify(board)));
        undoButton.disabled = false;
        addRandomTile();
        renderBoard();
        if (isGameOver()) {
            gameOver = true;
            showResult();
        }
    }
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (i > 0 && board[i][j] === board[i - 1][j]) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
            if (j > 0 && board[i][j] === board[i][j - 1]) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
}

function checkCongrats(value) {
    if ([64, 128, 256, 512, 1024].includes(value)) {
        const randomNum = Math.floor(Math.random() * 6) + 1;
        congratsElement.innerHTML = `<img src="congrats${randomNum}.png" alt="Congrats">`;
        congratsElement.style.display = 'block';
        congratsElement.style.position = 'absolute';
        congratsElement.style.top = '50%';
        congratsElement.style.left = '50%';
        congratsElement.style.transform = 'translate(-50%, -50%) scale(0)';
        congratsElement.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
        ], {
            duration: 300,
            easing: 'ease-out',
            fill: 'forwards'
        }).onfinish = () => {
            congratsElement.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 300,
                easing: 'ease-out',
                fill: 'forwards'
            }).onfinish = () => {
                congratsElement.style.display = 'none';
            };
        };
        setTimeout(() => {
            if (congratsElement.style.display === 'block') {
                congratsElement.style.display = 'none';
            }
        }, 2500);
    }
}

function undo() {
    if (undoState.length > 0 && undoCount > 0) {
        board = undoState.pop();
        undoCount--;
        undoCountElement.textContent = undoCount;
        if (undoState.length === 0) {
            undoButton.disabled = true;
        }
        renderBoard();
    }
}

function resetGame() {
    board = [];
    score = 0;
    time = 0;
    undoState = [];
    undoCount = 5;
    gameWon = false;
    gameOver = false;
    endButton.style.display = 'none';
    winScreen.style.display = 'none';
    loseScreen.style.display = 'none';
    initBoard();
    clearInterval(interval);
    startTimer();
    undoCountElement.textContent = undoCount;
    undoButton.disabled = true;
}

function startTimer() {
    interval = setInterval(() => {
        time++;
        timeElement.textContent = `${time}s`;
    }, 1000);
}

function showResult() {
    clearInterval(interval);
    if (gameWon) {
        winScoreElement.textContent = score;
        winTimeElement.textContent = `${time}s`;
        winUndoElement.textContent = 5 - undoCount;
        winScreen.style.display = 'flex';
    } else {
        loseScoreElement.textContent = score;
        loseTimeElement.textContent = `${time}s`;
        loseUndoElement.textContent = 5 - undoCount;
        loseScreen.style.display = 'flex';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move('up');
    else if (e.key === 'ArrowDown') move('down');
    else if (e.key === 'ArrowLeft') move('left');
    else if (e.key === 'ArrowRight') move('right');
});

document.addEventListener('touchstart', (e) => {
    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) move('right');
            else move('left');
        } else {
            if (dy > 0) move('down');
            else move('up');
        }
    }, { once: true });
});

undoButton.addEventListener('click', undo);
resetButton.addEventListener('click', resetGame);
endButton.addEventListener('click', () => {
    if (gameWon) {
        showResult();
    }
});
restartWinButton.addEventListener('click', resetGame);
restartLoseButton.addEventListener('click', resetGame);

initBoard();
startTimer();