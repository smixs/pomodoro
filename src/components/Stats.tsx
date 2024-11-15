import React from 'react';
import { usePomodoro } from '../context/PomodoroContext';
import { Timer, Coffee } from 'lucide-react';

function Stats() {
  const { stats } = usePomodoro();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="w-5 h-5 opacity-80" />
          <h3 className="font-medium">Focus Sessions</h3>
        </div>
        <p className="text-2xl font-bold">{stats.completedSessions}</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Coffee className="w-5 h-5 opacity-80" />
          <h3 className="font-medium">Total Focus Time</h3>
        </div>
        <p className="text-2xl font-bold">
          {Math.round(stats.totalFocusTime / 60)} min
        </p>
      </div>
    </div>
  );
}

export default Stats;