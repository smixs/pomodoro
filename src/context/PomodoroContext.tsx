import React, { createContext, useContext, useEffect, useReducer } from 'react';

type Phase = 'work' | 'shortBreak' | 'longBreak';

interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

interface Stats {
  completedSessions: number;
  totalFocusTime: number;
}

interface State {
  settings: Settings;
  timeLeft: number;
  isActive: boolean;
  currentPhase: Phase;
  sessionCount: number;
  stats: Stats;
}

type Action =
  | { type: 'TICK' }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'UPDATE_SETTINGS'; payload: Settings }
  | { type: 'COMPLETE_SESSION' };

const defaultSettings: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const initialState: State = {
  settings: defaultSettings,
  timeLeft: defaultSettings.workDuration * 60,
  isActive: false,
  currentPhase: 'work',
  sessionCount: 0,
  stats: {
    completedSessions: 0,
    totalFocusTime: 0,
  },
};

function loadState(): State {
  try {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
  return initialState;
}

function saveState(state: State) {
  try {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TICK':
      if (state.timeLeft <= 0) {
        const audio = new Audio('/notification.mp3');
        audio.play();

        if (state.currentPhase === 'work') {
          const newSessionCount = state.sessionCount + 1;
          const isLongBreak =
            newSessionCount % state.settings.sessionsBeforeLongBreak === 0;
          const nextPhase = isLongBreak ? 'longBreak' : 'shortBreak';
          const duration = isLongBreak
            ? state.settings.longBreakDuration
            : state.settings.shortBreakDuration;

          return {
            ...state,
            timeLeft: duration * 60,
            currentPhase: nextPhase,
            sessionCount: newSessionCount,
            isActive: false,
            stats: {
              ...state.stats,
              completedSessions: state.stats.completedSessions + 1,
              totalFocusTime:
                state.stats.totalFocusTime + state.settings.workDuration * 60,
            },
          };
        } else {
          return {
            ...state,
            timeLeft: state.settings.workDuration * 60,
            currentPhase: 'work',
            isActive: false,
          };
        }
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };

    case 'TOGGLE_TIMER':
      return {
        ...state,
        isActive: !state.isActive,
      };

    case 'RESET_TIMER':
      const duration =
        state.currentPhase === 'work'
          ? state.settings.workDuration
          : state.currentPhase === 'shortBreak'
          ? state.settings.shortBreakDuration
          : state.settings.longBreakDuration;
      return {
        ...state,
        timeLeft: duration * 60,
        isActive: false,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        timeLeft:
          state.currentPhase === 'work'
            ? action.payload.workDuration * 60
            : state.currentPhase === 'shortBreak'
            ? action.payload.shortBreakDuration * 60
            : action.payload.longBreakDuration * 60,
        isActive: false,
      };

    default:
      return state;
  }
}

const PomodoroContext = createContext<{
  timeLeft: number;
  isActive: boolean;
  currentPhase: Phase;
  settings: Settings;
  stats: Stats;
  progress: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  updateSettings: (settings: Settings) => void;
} | null>(null);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    let interval: number;
    if (state.isActive) {
      interval = window.setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isActive]);

  const totalTime =
    state.currentPhase === 'work'
      ? state.settings.workDuration * 60
      : state.currentPhase === 'shortBreak'
      ? state.settings.shortBreakDuration * 60
      : state.settings.longBreakDuration * 60;

  const progress = state.timeLeft / totalTime;

  const value = {
    timeLeft: state.timeLeft,
    isActive: state.isActive,
    currentPhase: state.currentPhase,
    settings: state.settings,
    stats: state.stats,
    progress,
    toggleTimer: () => dispatch({ type: 'TOGGLE_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    updateSettings: (settings: Settings) =>
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
  };

  return (
    <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
}