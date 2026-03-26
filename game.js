// 游戏常量定义
const BOARD_SIZE = 15;          // 棋盘大小（15x15）
const EMPTY = 0;                // 空位
const BLACK = 1;                // 黑棋
const WHITE = 2;                // 白棋

// 游戏状态
let board = [];                 // 棋盘数组
let currentPlayer = BLACK;      // 当前玩家
let gameEnded = false;          // 游戏是否结束
let moveHistory = [];           // 移动历史记录

// 获取DOM元素
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

/**
 * 初始化游戏
 */
function initGame() {
    // 初始化棋盘数组
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
    currentPlayer = BLACK;
    gameEnded = false;
    moveHistory = [];
    renderBoard();
    updateStatus();
}

/**
 * 渲染棋盘
 */
function renderBoard() {
    // 清空棋盘
    boardElement.innerHTML = '';

    // 创建棋盘格子
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // 如果有棋子，显示棋子
            if (board[row][col] !== EMPTY) {
                const stone = document.createElement('div');
                stone.className = `stone ${board[row][col] === BLACK ? 'black' : 'white'}`;
                cell.appendChild(stone);
                cell.classList.add('occupied');
            }

            // 添加点击事件
            cell.addEventListener('click', () => handleCellClick(row, col));

            boardElement.appendChild(cell);
        }
    }
}

/**
 * 处理格子点击事件
 * @param {number} row - 行索引
 * @param {number} col - 列索引
 */
function handleCellClick(row, col) {
    // 如果游戏结束或位置已有棋子，则不处理
    if (gameEnded || board[row][col] !== EMPTY) {
        return;
    }

    // 放置棋子
    board[row][col] = currentPlayer;
    moveHistory.push({ row, col, player: currentPlayer });

    // 重新渲染棋盘
    renderBoard();

    // 检查是否获胜
    const winner = checkWinner(row, col);
    if (winner) {
        gameEnded = true;
        highlightWinner(row, col);
        const playerName = winner === BLACK ? '黑棋' : '白棋';
        updateStatus(`${playerName} 获胜！`);
        return;
    }

    // 检查是否平局
    if (moveHistory.length === BOARD_SIZE * BOARD_SIZE) {
        gameEnded = true;
        updateStatus('平局！');
        return;
    }

    // 切换玩家
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    updateStatus();
}

/**
 * 检查是否获胜
 * @param {number} row - 最后一手棋的行
 * @param {number} col - 最后一手棋的列
 * @returns {number|null} - 获胜玩家或null
 */
function checkWinner(row, col) {
    const player = board[row][col];

    // 检查四个方向：水平、垂直、主对角线、副对角线
    const directions = [
        [[0, 1], [0, -1]],   // 水平
        [[1, 0], [-1, 0]],   // 垂直
        [[1, 1], [-1, -1]], // 主对角线
        [[1, -1], [-1, 1]]  // 副对角线
    ];

    for (const direction of directions) {
        let count = 1; // 当前棋子算一个

        // 向两个方向延伸检查
        for (const [dr, dc] of direction) {
            let r = row + dr;
            let c = col + dc;

            while (
                r >= 0 && r < BOARD_SIZE &&
                c >= 0 && c < BOARD_SIZE &&
                board[r][c] === player
            ) {
                count++;
                r += dr;
                c += dc;
            }
        }

        // 如果连成五子，返回获胜者
        if (count >= 5) {
            return player;
        }
    }

    return null;
}

/**
 * 高亮获胜的棋子
 * @param {number} row - 最后一手棋的行
 * @param {number} col - 最后一手棋的列
 */
function highlightWinner(row, col) {
    const player = board[row][col];
    const directions = [
        [[0, 1], [0, -1]],   // 水平
        [[1, 0], [-1, 0]],   // 垂直
        [[1, 1], [-1, -1]], // 主对角线
        [[1, -1], [-1, 1]]  // 副对角线
    ];

    for (const direction of directions) {
        const cells = [[row, col]];

        for (const [dr, dc] of direction) {
            let r = row + dr;
            let c = col + dc;

            while (
                r >= 0 && r < BOARD_SIZE &&
                c >= 0 && c < BOARD_SIZE &&
                board[r][c] === player
            ) {
                cells.push([r, c]);
                r += dr;
                c += dc;
            }
        }

        // 如果找到连成五子的方向，高亮这些棋子
        if (cells.length >= 5) {
            for (const [r, c] of cells) {
                const cell = boardElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (cell) {
                    cell.classList.add('winner');
                }
            }
            return;
        }
    }
}

/**
 * 更新状态显示
 * @param {string} message - 状态消息
 */
function updateStatus(message) {
    const playerName = currentPlayer === BLACK ? '黑棋' : '白棋';
    statusElement.innerHTML = message || `当前玩家: <span class="current-player">${playerName}</span>`;
}

/**
 * 重新开始游戏
 */
function restartGame() {
    initGame();
}

// 绑定重新开始按钮事件
restartBtn.addEventListener('click', restartGame);

// 初始化游戏
initGame();
