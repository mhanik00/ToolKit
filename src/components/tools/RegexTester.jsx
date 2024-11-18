import { useState, useEffect } from 'react';

function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = {
    email: {
      pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
      description: 'Match email addresses',
      example: 'test@example.com'
    },
    phone: {
      pattern: '^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$',
      description: 'Match phone numbers',
      example: '+1 (555) 123-4567'
    },
    url: {
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      description: 'Match URLs',
      example: 'https://www.example.com'
    },
    date: {
      pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
      description: 'Match dates (YYYY-MM-DD)',
      example: '2024-03-15'
    },
    ipv4: {
      pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
      description: 'Match IPv4 addresses',
      example: '192.168.1.1'
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testText]);

  const testRegex = () => {
    if (!pattern || !testText) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(matches);
      setError(null);
    } catch (err) {
      setError(err.message);
      setMatches([]);
    }
  };

  const loadTemplate = (key) => {
    if (templates[key]) {
      setPattern(templates[key].pattern);
      setTestText(templates[key].example);
      setSelectedTemplate(key);
    }
  };

  const toggleFlag = (flag) => {
    setFlags(prev => 
      prev.includes(flag)
        ? prev.replace(flag, '')
        : prev + flag
    );
  };

  const highlightMatches = () => {
    if (!testText || matches.length === 0) return testText;

    let result = testText;
    let offset = 0;

    matches.forEach(match => {
      const before = result.slice(0, match.index + offset);
      const after = result.slice(match.index + match.text.length + offset);
      const highlighted = `<mark class="bg-yellow-200 dark:bg-yellow-500/50">${match.text}</mark>`;
      result = before + highlighted + after;
      offset += highlighted.length - match.text.length;
    });

    return result;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Regex Tester
          </h2>

          {/* Templates */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Common Patterns
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => loadTemplate(key)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTemplate === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Pattern Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Regular Expression
                </label>
                <div className="flex gap-2">
                  <span className="text-gray-500 dark:text-gray-400">/</span>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="Enter regex pattern"
                  />
                  <span className="text-gray-500 dark:text-gray-400">/</span>
                  <input
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="flags"
                  />
                </div>
              </div>

              {/* Flags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Flags
                </label>
                <div className="flex flex-wrap gap-2">
                  {['g', 'i', 'm', 's', 'u', 'y'].map(flag => (
                    <button
                      key={flag}
                      onClick={() => toggleFlag(flag)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        flags.includes(flag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Test Text
                </label>
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full h-40 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono resize-none"
                  placeholder="Enter text to test against"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Results */}
              {error ? (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                  {error}
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Matches ({matches.length})
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div
                        className="font-mono whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                      />
                    </div>
                  </div>

                  {matches.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Match Details
                      </h3>
                      <div className="space-y-2">
                        {matches.map((match, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="font-mono text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Match {index + 1}:
                              </span>{' '}
                              {match.text}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Index: {match.index}
                            </div>
                            {match.groups.length > 0 && (
                              <div className="mt-1 text-sm">
                                <div className="text-gray-500 dark:text-gray-400">
                                  Groups:
                                </div>
                                {match.groups.map((group, i) => (
                                  <div key={i} className="ml-4 font-mono">
                                    {i + 1}: {group}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegexTester; 