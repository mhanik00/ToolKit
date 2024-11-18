import { Link } from 'react-router-dom'


function Navbar() {


  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              ToolKit
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </Link>
            <Link 
              to="/tools" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Tools
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar