import { useState } from 'react';

function ColorTool() {
  const [activeTab, setActiveTab] = useState('picker');
  const [color, setColor] = useState('#3B82F6');
  const [gradientColors, setGradientColors] = useState(['#3B82F6', '#8B5CF6']);
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [paletteType, setPaletteType] = useState('monochromatic');
  const [colorHistory, setColorHistory] = useState([]);

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert hex to HSL
  const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Generate color palette
  const generatePalette = (baseColor) => {
    const hsl = hexToHsl(baseColor);
    if (!hsl) return [];

    switch (paletteType) {
      case 'monochromatic':
        return [
          `hsl(${hsl.h}, ${hsl.s}%, 90%)`,
          `hsl(${hsl.h}, ${hsl.s}%, 70%)`,
          `hsl(${hsl.h}, ${hsl.s}%, 50%)`,
          `hsl(${hsl.h}, ${hsl.s}%, 30%)`,
          `hsl(${hsl.h}, ${hsl.s}%, 10%)`
        ];
      case 'complementary':
        return [
          `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`
        ];
      case 'triadic':
        return [
          `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`,
          `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`
        ];
      default:
        return [];
    }
  };

  const addToHistory = (newColor) => {
    setColorHistory(prev => {
      const updated = [newColor, ...prev.filter(c => c !== newColor)].slice(0, 10);
      return updated;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Color Tools
          </h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {['picker', 'gradient', 'palette'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md capitalize ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Color Picker */}
          {activeTab === 'picker' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pick a Color
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      addToHistory(e.target.value);
                    }}
                    className="w-full h-20 p-1 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Values
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <span className="text-gray-600 dark:text-gray-300">HEX</span>
                      <button
                        onClick={() => copyToClipboard(color)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {color}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <span className="text-gray-600 dark:text-gray-300">RGB</span>
                      <button
                        onClick={() => {
                          const rgb = hexToRgb(color);
                          copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {(() => {
                          const rgb = hexToRgb(color);
                          return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                        })()}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <span className="text-gray-600 dark:text-gray-300">HSL</span>
                      <button
                        onClick={() => {
                          const hsl = hexToHsl(color);
                          copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {(() => {
                          const hsl = hexToHsl(color);
                          return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                        })()}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color History */}
              {colorHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recent Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colorHistory.map((c, index) => (
                      <button
                        key={index}
                        onClick={() => setColor(c)}
                        className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gradient Generator */}
          {activeTab === 'gradient' && (
            <div className="space-y-6">
              <div className="h-32 rounded-lg mb-4"
                style={{
                  background: `linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color 1
                  </label>
                  <input
                    type="color"
                    value={gradientColors[0]}
                    onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])}
                    className="w-full h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color 2
                  </label>
                  <input
                    type="color"
                    value={gradientColors[1]}
                    onChange={(e) => setGradientColors([gradientColors[0], e.target.value])}
                    className="w-full h-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Direction
                </label>
                <select
                  value={gradientDirection}
                  onChange={(e) => setGradientDirection(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="to right">→ To Right</option>
                  <option value="to left">← To Left</option>
                  <option value="to bottom">↓ To Bottom</option>
                  <option value="to top">↑ To Top</option>
                  <option value="45deg">↗ 45°</option>
                  <option value="135deg">↘ 135°</option>
                  <option value="225deg">↙ 225°</option>
                  <option value="315deg">↖ 315°</option>
                </select>
              </div>
              <button
                onClick={() => copyToClipboard(
                  `background: linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]});`
                )}
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Copy CSS
              </button>
            </div>
          )}

          {/* Color Palette */}
          {activeTab === 'palette' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Base Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Palette Type
                </label>
                <select
                  value={paletteType}
                  onChange={(e) => setPaletteType(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="monochromatic">Monochromatic</option>
                  <option value="complementary">Complementary</option>
                  <option value="triadic">Triadic</option>
                </select>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {generatePalette(color).map((c, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md relative group"
                    style={{ backgroundColor: c }}
                  >
                    <button
                      onClick={() => copyToClipboard(c)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColorTool; 