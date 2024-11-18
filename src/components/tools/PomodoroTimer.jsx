import { useState, useEffect } from 'react';

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [cycles, setCycles] = useState(0);
  const [settings, setSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    playNotificationSound();
    showNotification();
    if (mode === 'work') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      if (newCycles % settings.longBreakInterval === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(settings[newMode] * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings[mode] * 60);
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3'); // Add a notification sound file
    audio.play().catch(err => console.log('Audio playback failed:', err));
  };

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: `${mode === 'work' ? 'Time for a break!' : 'Back to work!'}`,
        icon: '/favicon.ico'
      });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pomodoro Timer
            </h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ⚙️ Settings
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-gray-900 dark:text-white mb-4 font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {mode === 'work' ? 'Work Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Cycle: {Math.floor(cycles / 2) + 1}
            </div>
          </div>

          {/* Mode Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => switchMode('work')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'work'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'shortBreak'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'longBreak'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Long Break
            </button>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3 rounded-md text-white transition-colors ${
                isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-8 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Timer Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Work Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.work}
                      onChange={(e) => setSettings({ ...settings, work: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Short Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.shortBreak}
                      onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Long Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.longBreak}
                      onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Long Break Interval (cycles)
                    </label>
                    <input
                      type="number"
                      value={settings.longBreakInterval}
                      onChange={(e) => setSettings({ ...settings, longBreakInterval: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer; 