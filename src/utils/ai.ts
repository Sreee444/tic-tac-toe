// Simple AI for Tic Tac Toe (random move for easy mode)
export function getRandomMove(squares: string[]): number {
  const emptyIndices = squares
    .map((val, idx) => (val === '' ? idx : null))
    .filter((v) => v !== null) as number[];
  if (emptyIndices.length === 0) return -1;
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}
