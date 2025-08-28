

import React, { useState, useEffect, useCallback } from 'react';

import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getEasyMove, getMediumMove, getHardMove } from './utils/ai';
import './index.css';


type Mode = 'easy' | 'medium' | 'hard' | 'two';
type AIScores = { playerWins: number; aiWins: number; draws: number };
type TwoPlayerScores = { xWins: number; oWins: number; draws: number };
type GameScores = AIScores | TwoPlayerScores;

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
      return { winner: squares[a], winningLine: line };
    }
  }
  return null;
}

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode | null>(null);
  const [squares, setSquares] = useState([...emptyBoard]);
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X'); // Track what symbol the player is using
  
  // Separate score tracking for each mode
  const [easyScores, setEasyScores] = useLocalStorage('easyScores', { playerWins: 0, aiWins: 0, draws: 0 });
  const [mediumScores, setMediumScores] = useLocalStorage('mediumScores', { playerWins: 0, aiWins: 0, draws: 0 });
  const [hardScores, setHardScores] = useLocalStorage('hardScores', { playerWins: 0, aiWins: 0, draws: 0 });
  const [twoPlayerScores, setTwoPlayerScores] = useLocalStorage('twoPlayerScores', { xWins: 0, oWins: 0, draws: 0 });

  // Get current mode's scores
  const getCurrentScores = useCallback(() => {
    switch (mode) {
      case 'easy': return easyScores;
      case 'medium': return mediumScores;
      case 'hard': return hardScores;
      case 'two': return twoPlayerScores;
      default: return { playerWins: 0, aiWins: 0, draws: 0 };
    }
  }, [mode, easyScores, mediumScores, hardScores, twoPlayerScores]);

  // Update current mode's scores
  const updateCurrentScores = useCallback((newScores: GameScores) => {
    switch (mode) {
      case 'easy': setEasyScores(newScores as AIScores); break;
      case 'medium': setMediumScores(newScores as AIScores); break;
      case 'hard': setHardScores(newScores as AIScores); break;
      case 'two': setTwoPlayerScores(newScores as TwoPlayerScores); break;
    }
  }, [mode, setEasyScores, setMediumScores, setHardScores, setTwoPlayerScores]);

  // Streak and animation state
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [resultAnimation, setResultAnimation] = useState<'win' | 'loss' | 'draw' | null>(null);

  const resetGame = useCallback(() => {
    setSquares([...emptyBoard]);
    setGameEnded(false);
    setWinningLine(null);
    setResultAnimation(null);
    
    if (mode === 'two') {
      setXIsNext(true);
      setStatus('X starts!');
    } else {
      // Re-randomize for AI modes
      const playerGoesFirst = Math.random() < 0.5;
      setPlayerSymbol(playerGoesFirst ? 'X' : 'O');
      setXIsNext(true);
      
      if (playerGoesFirst) {
        setStatus('You go first! (X)');
      } else {
        setStatus('AI goes first! (X)');
      }
    }
  }, [mode]);

  

  useEffect(() => {
    const result = calculateWinner(squares);
    if (result && !gameEnded) {
      setWinningLine(result.winningLine);
      setGameEnded(true);
      const winner = result.winner;
      const currentScores = getCurrentScores();
      let isPlayerWin = false;
      let isAIWin = false;
      if (mode === 'two') {
        // Two player mode - track X and O wins
        const twoPlayerScores = currentScores as TwoPlayerScores;
        if (winner === 'X') {
          updateCurrentScores({ ...twoPlayerScores, xWins: twoPlayerScores.xWins + 1 });
        } else {
          updateCurrentScores({ ...twoPlayerScores, oWins: twoPlayerScores.oWins + 1 });
        }
      } else {
        // AI modes - track player vs AI wins
        const aiScores = currentScores as AIScores;
        if (winner === playerSymbol) {
          updateCurrentScores({ ...aiScores, playerWins: aiScores.playerWins + 1 });
          isPlayerWin = true;
        } else {
          updateCurrentScores({ ...aiScores, aiWins: aiScores.aiWins + 1 });
          isAIWin = true;
        }
      }
      // Animation and streaks
      if (mode !== 'two') {
        if (isPlayerWin) {
          setResultAnimation('win');
          setCurrentStreak((s) => {
            const newStreak = s + 1;
            setBestStreak((b) => Math.max(b, newStreak));
            return newStreak;
          });
        } else if (isAIWin) {
          setResultAnimation('loss');
          setCurrentStreak(0);
        }
      }
      setStatus(`Player ${winner} wins! 🎉`);
      // Auto-restart after 2 seconds
      setTimeout(() => resetGame(), 2000);
    } else if (squares.every(Boolean) && !result && !gameEnded) {
      setStatus("It's a draw! 🤝");
      setGameEnded(true);
      setResultAnimation('draw');
      setCurrentStreak(0);
      setWinningLine(null);
      const currentScores = getCurrentScores();
      updateCurrentScores({ ...currentScores, draws: currentScores.draws + 1 });
      setTimeout(() => resetGame(), 2000);
    } else if (!result && !squares.every(Boolean)) {
      setStatus('');
      setWinningLine(null);
      setResultAnimation(null);
    }
  }, [squares, gameEnded, getCurrentScores, updateCurrentScores, mode, playerSymbol, resetGame]);

  const handleClick = React.useCallback((i: number) => {
    if (squares[i] || calculateWinner(squares) || gameEnded) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }, [squares, xIsNext, gameEnded]);

  useEffect(() => {
    if (
      (mode === 'easy' || mode === 'medium' || mode === 'hard') &&
      !gameEnded &&
      !calculateWinner(squares) &&
      squares.includes('')
    ) {
      const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
      const isAITurn = (xIsNext && aiSymbol === 'X') || (!xIsNext && aiSymbol === 'O');
      
      if (isAITurn) {
        let move = -1;
        
        if (mode === 'easy') {
          move = getEasyMove(squares);
        } else if (mode === 'medium') {
          move = getMediumMove(squares, aiSymbol);
        } else if (mode === 'hard') {
          move = getHardMove(squares, aiSymbol);
        }
        
        if (move !== -1) {
          setTimeout(() => handleClick(move), 500);
        }
      }
    }
  }, [mode, xIsNext, squares, gameEnded, handleClick, playerSymbol]);


  function startGame(selectedMode: Mode) {
    setMode(selectedMode);
    setSquares([...emptyBoard]);
    setGameEnded(false);
    
    if (selectedMode === 'two') {
      // Two player mode - X always starts
      setXIsNext(true);
      setPlayerSymbol('X');
      setStatus('X starts!');
    } else {
      // AI modes - randomize who goes first
      const playerGoesFirst = Math.random() < 0.5;
      setPlayerSymbol(playerGoesFirst ? 'X' : 'O');
      setXIsNext(true); // X always starts, but player might be O
      
      if (playerGoesFirst) {
        setStatus('You go first! (X)');
      } else {
        setStatus('AI goes first! (X)');
      }
    }
  }

  if (!mode) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              textAlign: 'center',
              lineHeight: '1',
              margin: '0',
              padding: '0',
              width: '100%',
              letterSpacing: '0.05em'
            }}>
              Tic Tac Toe
            </h1>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{
              fontSize: '1.2rem',
              color: '#333',
              marginBottom: '2rem',
              fontWeight: '500'
            }}>
              🎯 Welcome! Choose a mode to start playing:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                style={{
                  padding: '15px 25px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255,107,107,0.4)'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0px)'}
                onClick={() => startGame('easy')}
              >
                🟢 Easy
              </button>
              
              <button
                style={{
                  padding: '15px 25px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(78,205,196,0.4)'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0px)'}
                onClick={() => startGame('medium')}
              >
                🟡 Medium
              </button>
              
              <button
                style={{
                  padding: '15px 25px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0px)'}
                onClick={() => startGame('hard')}
              >
                🔴 Hard
              </button>
              
              <button
                style={{
                  padding: '15px 25px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(240,147,251,0.4)'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0px)'}
                onClick={() => startGame('two')}
              >
                👥 Two Player
              </button>
            </div>
          </div>
          
          <p style={{
            marginTop: '2rem',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.9rem'
          }}>
            Made with ❤️ by Sreee444
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            textAlign: 'center',
            lineHeight: '1',
            margin: '0',
            padding: '0',
            width: '100%',
            letterSpacing: '0.05em'
          }}>
            Tic Tac Toe
          </h1>
        </div>
        
        <Scoreboard 
          mode={mode} 
          playerSymbol={playerSymbol}
          scores={getCurrentScores()}
        />
        
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          marginTop: '1rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '1rem'
          }}>
            {status}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
            <Board 
              squares={squares} 
              onClick={handleClick} 
              winningLine={winningLine}
            />
          </div>
          {(mode === 'easy' || mode === 'medium' || mode === 'hard') && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '1rem',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#333',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              padding: '0.5rem 1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
            }}>
              <span>Current Streak: <span style={{ color: '#4ecdc4' }}>{currentStreak}</span></span>
              <span>Best Streak: <span style={{ color: '#ff6b6b' }}>{bestStreak}</span></span>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(76,175,80,0.3)'
              }}
              onClick={resetGame}
            >
              🔄 Restart
            </button>
            
            <button
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(45deg, #757575, #616161)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(117,117,117,0.3)'
              }}
              onClick={() => setMode(null)}
            >
              ⬅️ Back
            </button>
          </div>
        </div>
        
        <p style={{
          marginTop: '2rem',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.9rem'
        }}>
          Made with ❤️ by Sreee444
        </p>
      </div>
    </div>
  );
};


export default App;
