import { useState } from 'react';

function JSONTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    try {
      if (!input.trim()) {
        setError('Please enter JSON data');
        return;
      }

      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
    }
  };

  const minifyJSON = () => {
    try {
      if (!input.trim()) {
        setError('Please enter JSON data');
        return;
      }

      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
    }
  };

  const validateJSON = () => {
    try {
      if (!input.trim()) {
        setError('Please enter JSON data');
        return;
      }

      JSON.parse(input);
      setError('JSON is valid!');
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSampleJSON = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      hobbies: ["reading", "gaming", "coding"],
      active: true
    };
    setInput(JSON.stringify(sample));
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              JSON Formatter
            </h2>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Indent Size:
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="ml-2 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {[2, 4, 6, 8].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </label>
              <button
                onClick={loadSampleJSON}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Load Sample
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input JSON
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[400px] p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Paste your JSON here..."
              />
            </div>

            {/* Output */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output
              </label>
              <textarea
                value={output}
                readOnly
                className="w-full h-[400px] p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Formatted output will appear here..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={formatJSON}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Format
            </button>
            <button
              onClick={minifyJSON}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Minify
            </button>
            <button
              onClick={validateJSON}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Validate
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:bg-purple-300"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Error/Success Message */}
          {error && (
            <div className={`mt-4 p-4 rounded-md ${
              error === 'JSON is valid!' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {error}
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tips
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Format: Beautifies JSON with proper indentation</li>
              <li>• Minify: Removes all whitespace for compact JSON</li>
              <li>• Validate: Checks if JSON is syntactically correct</li>
              <li>• Adjust indent size to your preference</li>
              <li>• Use the sample JSON to test functionality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JSONTool; 