import React from 'react';

interface BoardProps {
  squares: string[];
  onClick: (i: number) => void;
  winningLine?: number[] | null;
  playerSymbol?: 'X' | 'O';
  playerXColor?: string;
  playerOColor?: string;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine, playerXColor = '#e74c3c', playerOColor = '#3498db' }) => {
  // Animation logic
  const getSquareClass = (i: number) => {
    if (winningLine && winningLine.includes(i)) {
      return 'winning-square';
    }
    return '';
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 320,
        aspectRatio: '1 / 1',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '8px',
          width: '100%',
          height: '100%',
        }}
      >
        {squares.map((square, i) => (
          <button
            key={i}
            className={getSquareClass(i)}
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '1 / 1',
              fontSize: '2rem',
              fontWeight: 'bold',
              backgroundColor: square ? '#f0f8ff' : 'white',
              border: '2px solid #667eea',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              color: square === 'X' ? playerXColor : square === 'O' ? playerOColor : '#333',
              position: 'relative',
              zIndex: 1,
              minWidth: 0,
              minHeight: 0,
              maxWidth: '100%',
              maxHeight: '100%',
              padding: 0,
              boxSizing: 'border-box',
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
    </div>
  );
};

export default Board;
