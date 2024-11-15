import React from 'react';
import { usePomodoro } from '../context/PomodoroContext';
import { X } from 'lucide-react';

function Settings({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = usePomodoro();
  const [tempSettings, setTempSettings] = React.useState(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    onClose();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm opacity-80 mb-2">
              Focus Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={tempSettings.workDuration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  workDuration: Number(e.target.value),
                })
              }
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div>
            <label className="block text-sm opacity-80 mb-2">
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="15"
              value={tempSettings.shortBreakDuration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  shortBreakDuration: Number(e.target.value),
                })
              }
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div>
            <label className="block text-sm opacity-80 mb-2">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={tempSettings.longBreakDuration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  longBreakDuration: Number(e.target.value),
                })
              }
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div>
            <label className="block text-sm opacity-80 mb-2">
              Sessions Before Long Break
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={tempSettings.sessionsBeforeLongBreak}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  sessionsBeforeLongBreak: Number(e.target.value),
                })
              }
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default Settings;