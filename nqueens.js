const size = 8;  // For an 8x8 board
let grid = Array.from({ length: size }, () => Array(size).fill("0"));
let steps = [];  // For visualization steps

// Check if the current row is safe for placing a queen
function checkRow(row, grid) {
    for (let i = 0; i < grid.length; i++) {
        if (grid[row][i] === "Q") {
            return false;
        }
    }
    return true;
}

// Check if the current column is safe for placing a queen
function checkCol(col, grid) {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i][col] === "Q") {
            return false;
        }
    }
    return true;
}

// Check if the diagonals are safe for placing a queen
function checkDiagonal(row, col, grid) {
    const n = grid.length;

    // Check the main diagonal (top-left to bottom-right)
    for (let i = 0; i < n; i++) {
        if ((row - i >= 0 && col - i >= 0 && grid[row - i][col - i] === "Q") ||
            (row + i < n && col + i < n && grid[row + i][col + i] === "Q")) {
            return false;
        }
    }

    // Check the anti-diagonal (top-right to bottom-left)
    for (let i = 0; i < n; i++) {
        if ((row - i >= 0 && col + i < n && grid[row - i][col + i] === "Q") ||
            (row + i < n && col - i >= 0 && grid[row + i][col - i] === "Q")) {
            return false;
        }
    }

    return true;
}

// Check if placing a queen is safe
function safe(row, col, grid) {
    return checkRow(row, grid) && checkCol(col, grid) && checkDiagonal(row, col, grid);
}

// Function to solve the board and visualize each step
async function solveBoardVisual(grid, row) {
    if (size === row) return true;

    for (let col = 0; col < size; col++) {
        if (safe(row, col, grid)) {
            grid[row][col] = "Q";
            steps.push(grid.map(row => row.slice()));  // Save current step
            displayBoard(grid);  // Update the display

            await new Promise(resolve => setTimeout(resolve, 100));  // Delay for visualization

            if (await solveBoardVisual(grid, row + 1)) {
                return true;
            }
            grid[row][col] = "0";  // Backtrack
            steps.push(grid.map(row => row.slice()));  // Save backtracking step
            displayBoard(grid);  // Update the display

            await new Promise(resolve => setTimeout(resolve, 100));  // Delay for visualization
        }
    }
    return false;
}

// Function to solve the board (without visualization)
function solveBoard(grid, row) {
    if (size === row) return true;

    for (let col = 0; col < size; col++) {
        if (safe(row, col, grid)) {
            grid[row][col] = "Q";
            steps.push(grid.map(row => row.slice()));  // Save current step

            if (solveBoard(grid, row + 1)) {
                return true;
            }
            grid[row][col] = "0";  // Backtrack
            steps.push(grid.map(row => row.slice()));  // Save backtracking step
        }
    }
    return false;
}

// Function to display the board
function displayBoard(grid) {
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let row = 0; row < grid.length; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < grid[row].length; col++) {
            const td = document.createElement('td');
            if (grid[row][col] === "Q") {
                td.textContent = "Q";
                td.classList.add('queen');
            } else {
                td.textContent = "";
                td.classList.add('empty');
            }
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}

// Event listener for solving the board
document.querySelector('.btnSolve').addEventListener('click', () => {
    const tempGrid = Array.from({ length: size }, () => Array(size).fill("0"));
    if (solveBoard(tempGrid, 0)) {
        displayBoard(tempGrid);
    } else {
        alert("No solution exists.");
    }
});

// Event listener for visualizing the solving process
document.querySelector('.btnVisualize').addEventListener('click', async () => {
    const tempGrid = Array.from({ length: size }, () => Array(size).fill("0"));
    steps = [];  // Clear previous steps
    await solveBoardVisual(tempGrid, 0);  // Solve and visualize simultaneously
    if (steps.length === 0) {
        alert("No solution exists.");
    }
});

// Initial empty board display
displayBoard(Array.from({ length: size }, () => Array(size).fill("0")));
