import React from 'react';

type Mode = 'easy' | 'medium' | 'hard' | 'two';

interface ScoreboardProps {
  mode: Mode | null;
  playerSymbol?: 'X' | 'O';
  scores: { playerWins: number; aiWins: number; draws: number } | { xWins: number; oWins: number; draws: number };
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

const Scoreboard: React.FC<ScoreboardProps> = ({ mode, playerSymbol = 'X', scores }) => {
  const isAIMode = mode === 'easy' || mode === 'medium' || mode === 'hard';
  
  // Handle different score structures
  let leftScore, rightScore, drawScore;
  let leftLabel, rightLabel;
  
  if (isAIMode) {
    const aiScores = scores as { playerWins: number; aiWins: number; draws: number };
    leftScore = aiScores.playerWins;
    rightScore = aiScores.aiWins;
    drawScore = aiScores.draws;
    leftLabel = `Player (${playerSymbol})`;
    rightLabel = `AI (${playerSymbol === 'X' ? 'O' : 'X'})`;
  } else {
    const twoPlayerScores = scores as { xWins: number; oWins: number; draws: number };
    leftScore = twoPlayerScores.xWins;
    rightScore = twoPlayerScores.oWins;
    drawScore = twoPlayerScores.draws;
    leftLabel = 'X Wins';
    rightLabel = 'O Wins';
  }
  
  return (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '1rem',
      textAlign: 'center'
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
        gap: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '0.5rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#e74c3c'
          }}>
            {isAIMode ? '👤' : '❌'} {leftScore}
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666'
          }}>
            {leftLabel}
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: '0.5rem'
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
          padding: '0.5rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#3498db'
          }}>
            {isAIMode ? '🤖' : '⭕'} {rightScore}
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666'
          }}>
            {rightLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;