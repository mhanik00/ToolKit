import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode')
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 