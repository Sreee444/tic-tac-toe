

import React, { useState } from 'react';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import useLocalStorage from './hooks/useLocalStorage';
import { getRandomMove } from './utils/ai';
import './index.css';


type Mode = 'easy' | 'medium' | 'hard' | 'two';

const emptyBoard = Array(9).fill('');

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode | null>(null);
  const [squares, setSquares] = useState([...emptyBoard]);
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState('');
  const [xWins, setXWins] = useLocalStorage('xWins', 0);
  const [oWins, setOWins] = useLocalStorage('oWins', 0);
  const [draws, setDraws] = useLocalStorage('draws', 0);

  React.useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setStatus(`${winner} wins!`);
      if (winner === 'X') setXWins((prev: number) => prev + 1);
      else setOWins((prev: number) => prev + 1);
    } else if (!squares.includes('')) {
      setStatus('Draw!');
      setDraws((prev: number) => prev + 1);
    } else {
      setStatus(`${xIsNext ? 'X' : 'O'}'s turn`);
    }
  }, [squares, xIsNext, setXWins, setOWins, setDraws]);

  const handleClick = React.useCallback((i: number) => {
    if (squares[i] || calculateWinner(squares) || status === 'Draw!') return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }, [squares, xIsNext, status]);

  React.useEffect(() => {
    if (
      mode === 'easy' &&
      !xIsNext &&
      !calculateWinner(squares) &&
      squares.includes('')
    ) {
      const move = getRandomMove(squares);
      if (move !== -1) {
        setTimeout(() => handleClick(move), 500);
      }
    }
  }, [mode, xIsNext, squares, handleClick]);


  function startGame(selectedMode: Mode) {
    setMode(selectedMode);
    setSquares([...emptyBoard]);
    setXIsNext(true);
    setStatus('X starts!');
  }

  function resetGame() {
    setSquares([...emptyBoard]);
    setXIsNext(true);
    setStatus('X starts!');
  }

  if (!mode) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
        <div className="w-full max-w-md mx-auto px-4">
          <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-8 text-center animate-bounce">Tic Tac Toe</h1>
          <div className="backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-white/40">
            <p className="text-lg font-semibold text-gray-900 mb-6 text-center">Welcome! Choose a mode to start playing:</p>
            <div className="flex flex-col gap-4 w-full">
              <button className="py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold text-xl shadow transition-all duration-200" onClick={() => startGame('easy')}>Easy</button>
              <button className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 via-blue-400 to-green-400 hover:from-purple-600 hover:to-green-500 text-white font-bold text-xl shadow transition-all duration-200" onClick={() => startGame('medium')}>Medium</button>
              <button className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold text-xl shadow transition-all duration-200" onClick={() => startGame('hard')}>Hard</button>
              <button className="py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:to-purple-600 text-white font-bold text-xl shadow transition-all duration-200" onClick={() => startGame('two')}>Two Player</button>
            </div>
          </div>
          <footer className="mt-10 text-white text-opacity-80 text-center">Made with <span className="text-pink-200">♥</span> by Sreee444</footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
      <div className="w-full max-w-md mx-auto px-4">
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-8 text-center animate-bounce">Tic Tac Toe</h1>
        <Scoreboard xWins={xWins} oWins={oWins} draws={draws} />
        <div className="backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-white/40">
          <div className="mb-4 text-2xl font-bold text-gray-900 text-center">{status}</div>
          <div className="flex justify-center w-full mb-6">
            <Board squares={squares} onClick={handleClick} />
          </div>
          <div className="flex gap-4 mt-4 w-full justify-center">
            <button className="py-2 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow transition-all duration-200" onClick={resetGame}>Restart</button>
            <button className="py-2 px-6 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-bold text-lg shadow transition-all duration-200" onClick={() => setMode(null)}>Back</button>
          </div>
        </div>
        <footer className="mt-10 text-white text-opacity-80 text-center">Made with <span className="text-pink-200">♥</span> by Sreee444</footer>
      </div>
    </div>
  );
};


export default App;
