import { useState } from 'react';

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [copied, setCopied] = useState(false);

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';

    // Build character set based on selected options
    if (options.uppercase) charset += characters.uppercase;
    if (options.lowercase) charset += characters.lowercase;
    if (options.numbers) charset += characters.numbers;
    if (options.symbols) charset += characters.symbols;

    // Ensure at least one option is selected
    if (!charset) {
      setPassword('Please select at least one option');
      return;
    }

    // Generate password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    // Ensure password contains at least one character from each selected option
    let validPassword = true;
    if (options.uppercase && !newPassword.match(/[A-Z]/)) validPassword = false;
    if (options.lowercase && !newPassword.match(/[a-z]/)) validPassword = false;
    if (options.numbers && !newPassword.match(/[0-9]/)) validPassword = false;
    if (options.symbols && !newPassword.match(/[^A-Za-z0-9]/)) validPassword = false;

    if (!validPassword) {
      generatePassword(); // Recursively generate new password if requirements not met
      return;
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!password || password === 'Please select at least one option') return;
    
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const calculatePasswordStrength = () => {
    if (!password || password === 'Please select at least one option') return '';
    
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;

    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    const strength = calculatePasswordStrength();
    switch (strength) {
      case 'Weak': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Strong': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Password Generator
          </h2>

          {/* Password Display */}
          <div className="relative mb-6">
            <div className="flex">
              <input
                type="text"
                value={password}
                readOnly
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                placeholder="Generated password"
              />
              <button
                onClick={copyToClipboard}
                disabled={!password || password === 'Please select at least one option'}
                className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {password && password !== 'Please select at least one option' && (
              <div className={`absolute right-20 top-1/2 -translate-y-1/2 text-sm font-semibold ${getStrengthColor()}`}>
                {calculatePasswordStrength()}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Length: {length}
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Uppercase Letters</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Lowercase Letters</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Numbers</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Special Characters</span>
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Password
          </button>

          {/* Password Tips */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Password Tips
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Use a minimum of 12 characters</li>
              <li>• Include a mix of letters, numbers, and symbols</li>
              <li>• Avoid using personal information</li>
              <li>• Use different passwords for different accounts</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordGenerator; 