import React from 'react';

const Home: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
    <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-8 animate-bounce">Tic Tac Toe</h1>
    <div className="bg-white bg-opacity-80 rounded-xl shadow-2xl p-8 flex flex-col items-center">
      <p className="text-lg font-semibold text-gray-800 mb-4">Welcome! Choose a mode to start playing:</p>
      <div className="flex flex-col gap-4 w-full">
        <button className="py-3 px-6 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold text-xl transition">Easy</button>
        <button className="py-3 px-6 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-bold text-xl transition">Medium</button>
        <button className="py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl transition">Hard</button>
        <button className="py-3 px-6 rounded-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:to-purple-600 text-white font-bold text-xl transition">Two Player</button>
      </div>
    </div>
    <footer className="mt-10 text-white text-opacity-80">Made with <span className="text-pink-200">♥</span> by Sreee444</footer>
  </div>
);

export default Home;
