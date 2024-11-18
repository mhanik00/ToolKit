import { useState } from 'react';

function TextTool() {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('transform');

  const getTextInfo = () => {
    return {
      characters: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.split('\n').length,
      paragraphs: text.split('\n\n').filter(p => p.trim()).length,
      spaces: text.split(' ').length - 1,
      numbers: (text.match(/\d/g) || []).length,
      letters: (text.match(/[a-zA-Z]/g) || []).length,
      symbols: (text.match(/[^a-zA-Z0-9\s]/g) || []).length
    };
  };

  const transformText = (type) => {
    switch (type) {
      case 'uppercase':
        setText(text.toUpperCase());
        break;
      case 'lowercase':
        setText(text.toLowerCase());
        break;
      case 'capitalize':
        setText(
          text.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        );
        break;
      case 'reverse':
        setText(text.split('').reverse().join(''));
        break;
      case 'remove-spaces':
        setText(text.replace(/\s+/g, ''));
        break;
      case 'remove-lines':
        setText(text.replace(/\n/g, ' ').replace(/\s+/g, ' '));
        break;
      case 'trim-lines':
        setText(text.split('\n').map(line => line.trim()).join('\n'));
        break;
      case 'sort-lines':
        setText(text.split('\n').sort().join('\n'));
        break;
      case 'reverse-lines':
        setText(text.split('\n').reverse().join('\n'));
        break;
      case 'remove-duplicates':
        setText([...new Set(text.split('\n'))].join('\n'));
        break;
      default:
        break;
    }
  };

  const findAndReplace = (find, replace) => {
    setText(text.replaceAll(find, replace));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Text Tools
          </h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {['transform', 'analyze', 'find-replace'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md capitalize ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste your text here..."
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Transform Tools */}
          {activeTab === 'transform' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => transformText('uppercase')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  UPPERCASE
                </button>
                <button
                  onClick={() => transformText('lowercase')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  lowercase
                </button>
                <button
                  onClick={() => transformText('capitalize')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Capitalize Words
                </button>
                <button
                  onClick={() => transformText('reverse')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Reverse Text
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => transformText('remove-spaces')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Remove Spaces
                </button>
                <button
                  onClick={() => transformText('remove-lines')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Remove Lines
                </button>
                <button
                  onClick={() => transformText('trim-lines')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Trim Lines
                </button>
                <button
                  onClick={() => transformText('sort-lines')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Sort Lines
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => transformText('reverse-lines')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Reverse Lines
                </button>
                <button
                  onClick={() => transformText('remove-duplicates')}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Remove Duplicates
                </button>
              </div>
            </div>
          )}

          {/* Text Analysis */}
          {activeTab === 'analyze' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(getTextInfo()).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Find and Replace */}
          {activeTab === 'find-replace' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Find
                  </label>
                  <input
                    type="text"
                    id="find"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Text to find"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Replace
                  </label>
                  <input
                    type="text"
                    id="replace"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Replace with"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const find = document.getElementById('find').value;
                  const replace = document.getElementById('replace').value;
                  findAndReplace(find, replace);
                }}
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Replace All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextTool; 