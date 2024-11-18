import { useState } from 'react'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')
  const [hasCalculated, setHasCalculated] = useState(false)

  const handleNumber = (number) => {
    if (hasCalculated) {
      setDisplay(number)
      setEquation(number)
      setHasCalculated(false)
    } else {
      if (display === '0') {
        setDisplay(number)
        setEquation(number)
      } else {
        setDisplay(display + number)
        setEquation(equation + number)
      }
    }
  }

  const handleOperator = (operator) => {
    setHasCalculated(false)
    setDisplay(display + operator)
    setEquation(equation + operator)
  }

  const handleEqual = () => {
    try {
      // Replace × with * and ÷ with / for evaluation
      const sanitizedEquation = equation.replace(/×/g, '*').replace(/÷/g, '/')
      // Use Function constructor instead of eval for safer evaluation
      const result = new Function('return ' + sanitizedEquation)()
      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(2)
      setDisplay(formattedResult)
      setEquation(formattedResult)
      setHasCalculated(true)
    } catch {
      setDisplay('Error')
      setEquation('')
      setHasCalculated(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setEquation('')
    setHasCalculated(false)
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
      setEquation(equation + '.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6">
          <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-3xl font-semibold text-gray-900 dark:text-white">
              {display}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button onClick={handleClear} className="col-span-2 p-4 text-lg font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
              AC
            </button>
            <button onClick={() => handleOperator('÷')} className="p-4 text-lg font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
              ÷
            </button>
            <button onClick={() => handleOperator('×')} className="p-4 text-lg font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
              ×
            </button>
            
            {[7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-4 text-lg font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                {num}
              </button>
            ))}
            <button onClick={() => handleOperator('-')} className="p-4 text-lg font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
              -
            </button>
            
            {[4, 5, 6].map((num) => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-4 text-lg font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                {num}
              </button>
            ))}
            <button onClick={() => handleOperator('+')} className="p-4 text-lg font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
              +
            </button>
            
            {[1, 2, 3].map((num) => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-4 text-lg font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                {num}
              </button>
            ))}
            <button onClick={handleEqual} className="row-span-2 p-4 text-lg font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
              =
            </button>
            
            <button onClick={() => handleNumber('0')} className="col-span-2 p-4 text-lg font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              0
            </button>
            <button onClick={handleDecimal} className="p-4 text-lg font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              .
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator
