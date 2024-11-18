import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Contact
          </Link>
          <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Privacy Policy
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            &copy; {currentYear} Your App Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 