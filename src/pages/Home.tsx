import React from 'react';
import ModeSelector from '../components/ModeSelector';
import Footer from '../components/Footer';

type Mode = 'easy' | 'medium' | 'hard' | 'two';

interface HomeProps {
  onModeSelect: (mode: Mode) => void;
}

const Home: React.FC<HomeProps> = ({ onModeSelect }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 px-4">
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 text-center drop-shadow-lg">Tic Tac Toe</h1>
      <p className="text-lg md:text-xl text-gray-700 mb-4 text-center">Welcome! Choose a mode to start playing:</p>
      <ModeSelector onSelect={onModeSelect} />
      <Footer />
    </div>
  </div>
);

export default Home;