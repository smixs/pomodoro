import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePomodoro } from '../context/PomodoroContext';

function Timer() {
  const {
    timeLeft,
    isActive,
    currentPhase,
    toggleTimer,
    resetTimer,
    progress,
  } = usePomodoro();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const phases = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-current text-white/10"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-current text-white"
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-6xl font-bold mb-2">
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
          <div className="text-lg opacity-80">{phases[currentPhase]}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors"
          aria-label={isActive ? 'Pause' : 'Start'}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={resetTimer}
          className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors"
          aria-label="Reset"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Timer;