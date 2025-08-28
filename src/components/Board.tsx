import React from 'react';

interface BoardProps {
  squares: string[];
  onClick: (i: number) => void;
  winningLine?: number[] | null;
  playerSymbol?: 'X' | 'O';
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine }) => {
  // Animation logic
  const getSquareClass = (i: number) => {
    if (winningLine && winningLine.includes(i)) {
      return 'winning-square';
    }
    return '';
  };



  return (
    <div style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      padding: '10px',
      minWidth: '260px',
      minHeight: '260px',
    }}>
      {squares.map((square, i) => (
        <button
          key={i}
          className={getSquareClass(i)}
          style={{
            width: '80px',
            height: '80px',
            fontSize: '2rem',
            fontWeight: 'bold',
            backgroundColor: square ? '#f0f8ff' : 'white',
            border: '2px solid #667eea',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            color: square === 'X' ? '#e74c3c' : square === 'O' ? '#3498db' : '#333',
            position: 'relative',
            zIndex: 1
          }}
          onClick={() => onClick(i)}
          onMouseOver={(e) => {
            if (!square) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#e3f2fd';
              (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => {
            if (!square) {
              (e.target as HTMLButtonElement).style.backgroundColor = 'white';
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            }
          }}
        >
          {square}
        </button>
      ))}
    </div>
  );
};

export default Board;
