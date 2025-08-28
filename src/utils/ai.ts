// AI logic for Tic Tac Toe

// Check if there's a winning move or block opponent's winning move
function findBestMove(squares: string[], player: string): number {
  const opponent = player === 'X' ? 'O' : 'X';
  
  // First, try to win
  for (let i = 0; i < 9; i++) {
    if (squares[i] === '') {
      const testSquares = [...squares];
      testSquares[i] = player;
      if (calculateWinner(testSquares) === player) {
        return i;
      }
    }
  }
  
  // Then, try to block opponent from winning
  for (let i = 0; i < 9; i++) {
    if (squares[i] === '') {
      const testSquares = [...squares];
      testSquares[i] = opponent;
      if (calculateWinner(testSquares) === opponent) {
        return i;
      }
    }
  }
  
  return -1;
}

function calculateWinner(squares: string[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Minimax algorithm for hard mode
function minimax(squares: string[], depth: number, isMaximizing: boolean, aiSymbol: string, alpha: number = -Infinity, beta: number = Infinity): number {
  const winner = calculateWinner(squares);
  const playerSymbol = aiSymbol === 'X' ? 'O' : 'X';
  
  if (winner === aiSymbol) return 10 - depth; // AI wins
  if (winner === playerSymbol) return depth - 10; // Human wins
  if (!squares.includes('')) return 0; // Draw
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === '') {
        squares[i] = aiSymbol;
        const evaluation = minimax(squares, depth + 1, false, aiSymbol, alpha, beta);
        squares[i] = '';
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === '') {
        squares[i] = playerSymbol;
        const evaluation = minimax(squares, depth + 1, true, aiSymbol, alpha, beta);
        squares[i] = '';
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

// Easy mode - random move
export function getEasyMove(squares: string[]): number {
  const emptyIndices = squares
    .map((val, idx) => (val === '' ? idx : null))
    .filter((v) => v !== null) as number[];
  if (emptyIndices.length === 0) return -1;
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// Medium mode - try to win/block, otherwise random
export function getMediumMove(squares: string[], aiSymbol: string = 'O'): number {
  const bestMove = findBestMove(squares, aiSymbol);
  if (bestMove !== -1) return bestMove;
  
  // Take center if available
  if (squares[4] === '') return 4;
  
  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => squares[i] === '');
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Otherwise random
  return getEasyMove(squares);
}

// Hard mode - use minimax algorithm
export function getHardMove(squares: string[], aiSymbol: string = 'O'): number {
  let bestMove = -1;
  let bestValue = -Infinity;
  
  for (let i = 0; i < 9; i++) {
    if (squares[i] === '') {
      squares[i] = aiSymbol;
      const moveValue = minimax(squares, 0, false, aiSymbol);
      squares[i] = '';
      
      if (moveValue > bestValue) {
        bestMove = i;
        bestValue = moveValue;
      }
    }
  }
  
  return bestMove;
}

// Legacy function for backwards compatibility
export function getRandomMove(squares: string[]): number {
  return getEasyMove(squares);
}
