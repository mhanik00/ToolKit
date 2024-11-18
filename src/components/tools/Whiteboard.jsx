import { useState, useRef, useEffect } from 'react';

function Whiteboard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // pen, eraser, shapes
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [shape, setShape] = useState('line'); // line, rectangle, circle
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveState();
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 2 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    setUndoStack(prev => [...prev, canvas.toDataURL()]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      setRedoStack(prev => [...prev, undoStack[undoStack.length - 1]]);
      
      const img = new Image();
      img.src = undoStack[undoStack.length - 2];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.src = redoStack[redoStack.length - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      
      setUndoStack(prev => [...prev, redoStack[redoStack.length - 1]]);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Whiteboard
            </h2>
            <div className="flex gap-2">
              <button
                onClick={downloadCanvas}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Download
              </button>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Tool:</label>
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 p-0 border border-gray-300 dark:border-gray-600 rounded"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Size:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{lineWidth}px</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={undoStack.length <= 1}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Undo
              </button>
              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Redo
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              className="w-full h-[600px] bg-white cursor-crosshair touch-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Whiteboard; 