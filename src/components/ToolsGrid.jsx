import { Link } from 'react-router-dom'

const tools = [
  {
    id: 1,
    name: 'Calculator',
    description: 'Basic and scientific calculations',
    icon: '🧮',
    path: '/calculator'
  },
  {
    id: 2,
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    icon: '📏',
    path: '/converter'
  },
  {
    id: 3,
    name: 'Timer',
    description: 'Countdown timer and stopwatch',
    icon: '⏲️',
    path: '/timer'
  },
  {
    id: 4,
    name: 'Notes',
    description: 'Quick note-taking and lists',
    icon: '📝',
    path: '/notes'
  },
  {
    id: 5,
    name: 'Weather',
    description: 'Check current weather conditions',
    icon: '🌤️',
    path: '/weather'
  },
  {
    id: 6,
    name: 'Calendar',
    description: 'Calendar and date calculator',
    icon: '📅',
    path: '/calendar'
  },
  {
    id: 7,
    name: 'Password Generator',
    description: 'Create secure passwords',
    icon: '🔐',
    path: '/password'
  },
  {
    id: 8,
    name: 'QR Generator',
    description: 'Create QR codes for text, URLs, and more',
    icon: '📱',
    path: '/qr-generator'
  },
  {
    id: 9,
    name: 'Color Tools',
    description: 'Color picker, gradients, and palettes',
    icon: '🎨',
    path: '/color-tools'
  },
  {
    id: 10,
    name: 'Text Tools',
    description: 'Text transformation and analysis',
    icon: '📝',
    path: '/text-tools'
  },
  {
    id: 11,
    name: 'Markdown Editor',
    description: 'Write and preview markdown documents',
    icon: '📝',
    path: '/markdown-editor'
  },
  {
    id: 12,
    name: 'Image Editor',
    description: 'Edit and enhance images',
    icon: '🖼️',
    path: '/image-editor'
  },
  {
    id: 13,
    name: 'Code Formatter',
    description: 'Format and beautify code',
    icon: '⌨️',
    path: '/code-formatter'
  },
  {
    id: 14,
    name: 'File Converter',
    description: 'Convert files between formats',
    icon: '📁',
    path: '/file-converter'
  },
  {
    id: 15,
    name: 'PDF Viewer',
    description: 'View and manipulate PDF files',
    icon: '📄',
    path: '/pdf-viewer'
  },
  {
    id: 16,
    name: 'URL Shortener',
    description: 'Create and manage shortened URLs',
    icon: '🔗',
    path: '/url-shortener'
  },
  {
    id: 17,
    name: 'JSON Tools',
    description: 'Format and validate JSON data',
    icon: '{ }',
    path: '/json-tools'
  },
  {
    id: 18,
    name: 'Pomodoro Timer',
    description: 'Focus timer with work/break intervals',
    icon: '⏱️',
    path: '/pomodoro'
  },
  {
    id: 19,
    name: 'Drawing Tool',
    description: 'Create simple drawings and sketches',
    icon: '🎨',
    path: '/drawing'
  },
  {
    id: 20,
    name: 'Screen Recorder',
    description: 'Record your screen, camera, or both',
    icon: '🎥',
    path: '/screen-recorder'
  },
  {
    id: 21,
    name: 'Whiteboard',
    description: 'Draw and sketch on a digital whiteboard',
    icon: '✏️',
    path: '/whiteboard'
  },
  {
    id: 22,
    name: 'Regex Tester',
    description: 'Test and validate regular expressions',
    icon: '🔍',
    path: '/regex-tester'
  }
]

function ToolsGrid() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Available Tools
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Choose from our collection of useful tools and utilities
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-7xl lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all bg-white dark:bg-gray-800"
            >
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {tool.name}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ToolsGrid 