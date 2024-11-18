import { useState, useEffect, useCallback } from 'react';

function Timer() {
  // Countdown Timer State
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // Timer Functions
  const startTimer = useCallback(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  }, [hours, minutes, seconds]);

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  // Stopwatch Functions
  const startStopwatch = () => {
    setIsStopwatchRunning(true);
  };

  const stopStopwatch = () => {
    setIsStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps([...laps, stopwatchTime]);
  };

  // Format time helper function
  const formatTime = (timeInSeconds) => {
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer Effect
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Stopwatch Effect
  useEffect(() => {
    let interval;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Countdown Timer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Countdown Timer</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isRunning}
                />
              </div>
            </div>

            <div className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center space-x-4">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Stop
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Stopwatch */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Stopwatch</h2>
            
            <div className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              {formatTime(stopwatchTime)}
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {!isStopwatchRunning ? (
                <button
                  onClick={startStopwatch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={stopStopwatch}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Stop
                </button>
              )}
              <button
                onClick={resetStopwatch}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={addLap}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                disabled={!isStopwatchRunning}
              >
                Lap
              </button>
            </div>

            {laps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Laps</h3>
                <div className="max-h-40 overflow-y-auto">
                  {laps.map((lap, index) => (
                    <div
                      key={index}
                      className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    >
                      Lap {index + 1}: {formatTime(lap)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timer; 