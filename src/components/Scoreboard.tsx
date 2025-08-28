import React from 'react';

type Mode = 'easy' | 'medium' | 'hard' | 'two';

interface ScoreboardProps {
  mode: Mode | null;
  playerSymbol?: 'X' | 'O';
  scores: { playerWins: number; aiWins: number; draws: number } | { xWins: number; oWins: number; draws: number };
  playerXName?: string;
  playerOName?: string;
  playerXColor?: string;
  playerOColor?: string;
  xIsNext?: boolean;
}

const getModeTitle = (mode: Mode | null) => {
  switch (mode) {
    case 'easy': return 'Easy AI Mode';
    case 'medium': return 'Medium AI Mode';
    case 'hard': return 'Hard AI Mode';
    case 'two': return 'Two Player Mode';
    default: return 'Game Mode';
  }
};

const Scoreboard: React.FC<ScoreboardProps> = ({ mode, playerSymbol = 'X', scores, playerXName = 'Player X', playerOName = 'Player O', playerXColor = '#e74c3c', playerOColor = '#3498db', xIsNext }) => {
  const isAIMode = mode === 'easy' || mode === 'medium' || mode === 'hard';

  // Handle different score structures
  let leftScore, rightScore, drawScore;
  let leftLabel, rightLabel;
  let leftColor = playerXColor, rightColor = playerOColor;

  if (isAIMode) {
    const aiScores = scores as { playerWins: number; aiWins: number; draws: number };
    leftScore = aiScores.playerWins;
    rightScore = aiScores.aiWins;
    drawScore = aiScores.draws;
    leftLabel = `Player (${playerSymbol})`;
    rightLabel = `AI (${playerSymbol === 'X' ? 'O' : 'X'})`;
    leftColor = '#e74c3c';
    rightColor = '#3498db';
  } else {
    const twoPlayerScores = scores as { xWins: number; oWins: number; draws: number };
    leftScore = twoPlayerScores.xWins;
    rightScore = twoPlayerScores.oWins;
    drawScore = twoPlayerScores.draws;
    leftLabel = playerXName + ' (X)';
    rightLabel = playerOName + ' (O)';
  }

  // Highlight active player in two player mode
  const highlightStyle = (isLeft: boolean) => {
    if (mode === 'two' && typeof xIsNext === 'boolean') {
      return {
        boxShadow: xIsNext === isLeft ? `0 0 0 3px ${isLeft ? playerXColor : playerOColor}` : 'none',
        background: xIsNext === isLeft ? (isLeft ? playerXColor + '22' : playerOColor + '22') : 'none',
        borderRadius: 8,
        transition: 'box-shadow 0.2s, background 0.2s',
      };
    }
    return {};
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '1rem',
      textAlign: 'center',
      maxWidth: 500,
      width: '100%',
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#2c3e50'
      }}>
        📊 {getModeTitle(mode)} Scores
      </h3>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '0.5rem',
          minWidth: 80,
          ...highlightStyle(true)
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: leftColor
          }}>
            {isAIMode ? '👤' : '❌'} {leftScore}
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            wordBreak: 'break-word',
          }}>
            {leftLabel}
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '0.5rem',
          minWidth: 80,
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#95a5a6'
          }}>
            🤝 {drawScore}
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666'
          }}>
            Draws
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '0.5rem',
          minWidth: 80,
          ...highlightStyle(false)
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: rightColor
          }}>
            {isAIMode ? '🤖' : '⭕'} {rightScore}
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            wordBreak: 'break-word',
          }}>
            {rightLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;