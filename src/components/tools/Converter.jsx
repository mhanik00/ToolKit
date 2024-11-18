import { useState } from 'react';

function Converter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [category, setCategory] = useState('length');

  const conversions = {
    length: {
      units: ['meters', 'feet', 'inches', 'kilometers', 'miles', 'centimeters'],
      ratesToMeter: {
        meters: 1,
        feet: 0.3048,
        inches: 0.0254,
        kilometers: 1000,
        miles: 1609.34,
        centimeters: 0.01
      }
    },
    weight: {
      units: ['kilograms', 'pounds', 'ounces', 'grams', 'tons'],
      ratesToKg: {
        kilograms: 1,
        pounds: 0.453592,
        ounces: 0.0283495,
        grams: 0.001,
        tons: 907.185
      }
    },
    temperature: {
      units: ['celsius', 'fahrenheit', 'kelvin'],
    }
  };

  const convert = () => {
    if (!value) return '';

    if (category === 'temperature') {
      return convertTemperature(parseFloat(value), fromUnit, toUnit);
    }

    const baseUnit = category === 'length' ? 'meters' : 'kilograms';
    const rates = category === 'length' ? conversions.length.ratesToMeter : conversions.weight.ratesToKg;

    // Convert to base unit first
    const baseValue = value * (rates[fromUnit] / rates[baseUnit]);
    // Then convert to target unit
    const result = baseValue / (rates[toUnit] / rates[baseUnit]);
    
    return result.toFixed(4);
  };

  const convertTemperature = (value, from, to) => {
    let result;
    // Convert to Celsius first
    let celsius;
    
    switch(from) {
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target unit
    switch(to) {
      case 'fahrenheit':
        result = (celsius * 9/5) + 32;
        break;
      case 'kelvin':
        result = celsius + 273.15;
        break;
      default:
        result = celsius;
    }

    return result.toFixed(2);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Unit Converter</h2>
        
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setFromUnit(conversions[e.target.value].units[0]);
              setToUnit(conversions[e.target.value].units[1]);
            }}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="temperature">Temperature</option>
          </select>
        </div>

        {/* Conversion Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
              placeholder="Enter value"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {conversions[category].units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <input
              type="text"
              value={value ? convert() : ''}
              readOnly
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white mb-2"
              placeholder="Result"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {conversions[category].units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Converter; 