import React from 'react';

interface ScoreboardProps {
  xWins: number;
  oWins: number;
  draws: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ xWins, oWins, draws }) => (
  <div className="flex justify-center gap-8 my-4">
    <div className="text-xl font-bold text-pink-600">X: {xWins}</div>
    <div className="text-xl font-bold text-blue-600">O: {oWins}</div>
    <div className="text-xl font-bold text-gray-700">Draws: {draws}</div>
  </div>
);

export default Scoreboard;
