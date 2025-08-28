import React from 'react';

type Mode = 'easy' | 'medium' | 'hard' | 'two';

interface ModeSelectorProps {
  onSelect: (mode: Mode) => void;
}

const modes: { label: string; value: Mode; color: string }[] = [
  { label: 'Easy', value: 'easy', color: 'from-green-400 to-green-600' },
  { label: 'Medium', value: 'medium', color: 'from-blue-400 to-blue-600' },
  { label: 'Hard', value: 'hard', color: 'from-pink-400 to-pink-600' },
  { label: 'Two Player', value: 'two', color: 'from-yellow-400 to-pink-500' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => (
  <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mt-8">
    {modes.map((mode) => (
      <button
        key={mode.value}
        className={`py-3 px-6 rounded-xl bg-gradient-to-r ${mode.color} text-white font-bold text-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
        onClick={() => onSelect(mode.value)}
      >
        {mode.label}
      </button>
    ))}
  </div>
);

export default ModeSelector;
