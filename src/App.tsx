import React from 'react';
import Timer from './components/Timer';
import Settings from './components/Settings';
import Stats from './components/Stats';
import { PomodoroProvider } from './context/PomodoroContext';
import { Clock, Settings2 } from 'lucide-react';

function App() {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Settings"
            >
              <Settings2 className="w-6 h-6" />
            </button>
          </header>

          <main className="max-w-2xl mx-auto">
            {showSettings ? (
              <Settings onClose={() => setShowSettings(false)} />
            ) : (
              <div className="space-y-8">
                <Timer />
                <Stats />
              </div>
            )}
          </main>
        </div>
      </div>
    </PomodoroProvider>
  );
}

export default App;