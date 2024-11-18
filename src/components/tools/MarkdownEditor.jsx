import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const templates = {
    heading: '# Heading 1\n## Heading 2\n### Heading 3',
    emphasis: '**Bold Text**\n*Italic Text*\n~~Strikethrough~~',
    lists: '- Item 1\n- Item 2\n  - Nested Item\n\n1. First\n2. Second',
    links: '[Link Text](https://example.com)\n![Image Alt](image-url.jpg)',
    code: '`Inline Code`\n\n```javascript\nconst code = "block";\n```',
    tables: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',
    quotes: '> This is a blockquote\n>\n> Multiple lines'
  };

  const insertTemplate = (template) => {
    setMarkdown(prev => prev + (prev ? '\n\n' : '') + templates[template]);
  };

  const copyHtml = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = document.querySelector('.markdown-preview').innerHTML;
    navigator.clipboard.writeText(tempDiv.innerHTML);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Markdown Editor
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={copyHtml}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Copy HTML
              </button>
            </div>
          </div>

          {/* Templates */}
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.keys(templates).map((template) => (
              <button
                key={template}
                onClick={() => insertTemplate(template)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors capitalize"
              >
                {template}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editor */}
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Markdown
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[600px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono resize-none"
                placeholder="Type your markdown here..."
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div>
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preview
                </div>
                <div className="w-full h-[600px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 overflow-auto">
                  <div className="markdown-preview prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkdownEditor;