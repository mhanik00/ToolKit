import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';

function CodeFormatter() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('light');
  const [error, setError] = useState('');

  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'html':
        return html();
      case 'css':
        return css();
      default:
        return javascript();
    }
  };

  const formatCode = () => {
    try {
      setError('');
      let formattedCode;

      switch (language) {
        case 'javascript':
          formattedCode = prettier.format(code, {
            parser: 'babel',
            plugins: [parserBabel],
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
          });
          break;
        case 'html':
          formattedCode = prettier.format(code, {
            parser: 'html',
            plugins: [parserHtml],
            printWidth: 80,
          });
          break;
        case 'css':
          formattedCode = prettier.format(code, {
            parser: 'css',
            plugins: [parserCss],
          });
          break;
        default:
          return;
      }

      setCode(formattedCode);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const clearCode = () => {
    setCode('');
    setError('');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Code Formatter
            </h2>
            <div className="flex gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          {/* Code Editor */}
          <div className="mb-4 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <CodeMirror
              value={code}
              height="400px"
              theme={theme}
              extensions={[getLanguageExtension()]}
              onChange={(value) => setCode(value)}
              className="text-base"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={formatCode}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Format Code
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Copy Code
            </button>
            <button
              onClick={clearCode}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Language Tips */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Formatting Rules
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {language === 'javascript' && (
                <>
                  <p>• Uses semicolons</p>
                  <p>• Single quotes for strings</p>
                  <p>• ES5 trailing commas</p>
                  <p>• 2 spaces indentation</p>
                </>
              )}
              {language === 'html' && (
                <>
                  <p>• Formats nested elements</p>
                  <p>• Preserves content whitespace</p>
                  <p>• 80 characters line width</p>
                  <p>• Sorts attributes</p>
                </>
              )}
              {language === 'css' && (
                <>
                  <p>• Sorts properties</p>
                  <p>• Normalizes colors</p>
                  <p>• Fixes formatting</p>
                  <p>• Maintains vendor prefixes</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeFormatter; 