import { useState, useRef, useEffect } from 'react';

function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingType, setRecordingType] = useState('screen'); // screen, camera, both
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [previewStream, setPreviewStream] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [previewStream]);

  const startRecording = async () => {
    try {
      setError(null);
      const streams = [];

      // Get screen stream if needed
      if (recordingType !== 'camera') {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: audioEnabled
        });
        streams.push(screenStream);
      }

      // Get camera stream if needed
      if (recordingType !== 'screen') {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: audioEnabled
        });
        streams.push(cameraStream);
      }

      // Combine streams if both selected
      let finalStream;
      if (streams.length > 1) {
        const tracks = streams.flatMap(stream => stream.getTracks());
        finalStream = new MediaStream(tracks);
      } else {
        finalStream = streams[0];
      }

      // Set up preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = finalStream;
      }
      setPreviewStream(finalStream);

      // Set up recording
      const mediaRecorder = new MediaRecorder(finalStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError('Failed to start recording: ' + err.message);
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, {
      type: 'video/webm'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const clearRecording = () => {
    setRecordedChunks([]);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Screen Recorder
            </h2>
            {isRecording && (
              <div className="flex items-center text-red-500">
                <span className="animate-pulse mr-2">●</span>
                {formatTime(recordingTime)}
              </div>
            )}
          </div>

          {/* Recording Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recording Type
              </label>
              <select
                value={recordingType}
                onChange={(e) => setRecordingType(e.target.value)}
                disabled={isRecording}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="screen">Screen Only</option>
                <option value="camera">Camera Only</option>
                <option value="both">Screen + Camera</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={audioEnabled}
                  onChange={(e) => setAudioEnabled(e.target.checked)}
                  disabled={isRecording}
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                Include Audio
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Stop Recording
              </button>
            )}
            {recordedChunks.length > 0 && (
              <>
                <button
                  onClick={downloadRecording}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Download Recording
                </button>
                <button
                  onClick={clearRecording}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Clear Recording
                </button>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Instructions */}
          {!isRecording && !recordedChunks.length && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Instructions
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Choose what you want to record: screen, camera, or both</li>
                <li>• Enable/disable audio recording as needed</li>
                <li>• Click "Start Recording" and select the content to share</li>
                <li>• Click "Stop Recording" when finished</li>
                <li>• Download or clear your recording</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScreenRecorder; 