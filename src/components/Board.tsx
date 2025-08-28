import React from 'react';

interface BoardProps {
  squares: string[];
  onClick: (i: number) => void;
}

const Board: React.FC<BoardProps> = ({ squares, onClick }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {squares.map((square, i) => (
        <button
          key={i}
          className="w-20 h-20 text-3xl font-bold bg-white bg-opacity-80 rounded-lg shadow hover:bg-blue-200 transition"
          onClick={() => onClick(i)}
        >
          {square}
        </button>
      ))}
    </div>
  );
};

export default Board;
