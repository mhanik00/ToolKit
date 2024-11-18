import { useState } from 'react';

function QRGenerator() {
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    size: 200,
    foreground: '#000000',
    background: '#FFFFFF',
    margin: 1,
    format: 'png'
  });
  const [wifiDetails, setWifiDetails] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA'
  });
  const [vCardDetails, setVCardDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    company: '',
    title: ''
  });

  const generateQRCode = async () => {
    if (!content.trim() && type !== 'wifi' && type !== 'vcard') return;

    setLoading(true);
    let data = content;

    // Format data based on type
    switch (type) {
      case 'url':
        if (!content.startsWith('http://') && !content.startsWith('https://')) {
          data = 'https://' + content;
        }
        break;
      case 'email':
        data = `mailto:${content}`;
        break;
      case 'phone':
        data = `tel:${content}`;
        break;
      case 'sms':
        data = `sms:${content}`;
        break;
      case 'wifi':
        data = `WIFI:T:${wifiDetails.encryption};S:${wifiDetails.ssid};P:${wifiDetails.password};;`;
        break;
      case 'vcard':
        data = `BEGIN:VCARD
VERSION:3.0
FN:${vCardDetails.name}
TEL:${vCardDetails.phone}
EMAIL:${vCardDetails.email}
ADR:;;${vCardDetails.address}
ORG:${vCardDetails.company}
TITLE:${vCardDetails.title}
END:VCARD`;
        break;
      default:
        break;
    }

    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${options.size}x${options.size}&data=${encodeURIComponent(data)}&bgcolor=${options.background.substring(1)}&color=${options.foreground.substring(1)}&margin=${options.margin}&format=${options.format}`;
      setQrCode(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode.${options.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContentInput = () => {
    switch (type) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiDetails.ssid}
                onChange={(e) => setWifiDetails({ ...wifiDetails, ssid: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={wifiDetails.password}
                onChange={(e) => setWifiDetails({ ...wifiDetails, password: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Encryption
              </label>
              <select
                value={wifiDetails.encryption}
                onChange={(e) => setWifiDetails({ ...wifiDetails, encryption: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={vCardDetails.name}
                onChange={(e) => setVCardDetails({ ...vCardDetails, name: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={vCardDetails.phone}
                  onChange={(e) => setVCardDetails({ ...vCardDetails, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={vCardDetails.email}
                  onChange={(e) => setVCardDetails({ ...vCardDetails, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                value={vCardDetails.address}
                onChange={(e) => setVCardDetails({ ...vCardDetails, address: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={vCardDetails.company}
                  onChange={(e) => setVCardDetails({ ...vCardDetails, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={vCardDetails.title}
                  onChange={(e) => setVCardDetails({ ...vCardDetails, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <input
              type={type === 'email' ? 'email' : 'text'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        );
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'url':
        return 'Enter website URL (e.g., example.com)';
      case 'email':
        return 'Enter email address';
      case 'phone':
        return 'Enter phone number';
      case 'sms':
        return 'Enter phone number';
      default:
        return 'Enter text';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            QR Code Generator
          </h2>

          <div className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setContent('');
                  setQrCode('');
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="text">Text</option>
                <option value="url">Website URL</option>
                <option value="email">Email Address</option>
                <option value="phone">Phone Number</option>
                <option value="sms">SMS</option>
                <option value="wifi">WiFi Network</option>
                <option value="vcard">Contact Card (vCard)</option>
              </select>
            </div>

            {/* Content Input */}
            {renderContentInput()}

            {/* QR Code Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Size (px): {options.size}
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={options.size}
                  onChange={(e) => setOptions({ ...options, size: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Margin
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={options.margin}
                  onChange={(e) => setOptions({ ...options, margin: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Foreground Color
                </label>
                <input
                  type="color"
                  value={options.foreground}
                  onChange={(e) => setOptions({ ...options, foreground: e.target.value })}
                  className="w-full p-1 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={options.background}
                  onChange={(e) => setOptions({ ...options, background: e.target.value })}
                  className="w-full p-1 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Format
                </label>
                <select
                  value={options.format}
                  onChange={(e) => setOptions({ ...options, format: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                  <option value="eps">EPS</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQRCode}
              disabled={loading || (!content && type !== 'wifi' && type !== 'vcard')}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>

            {/* QR Code Display */}
            {qrCode && (
              <div className="text-center">
                <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg inline-block">
                  <img
                    src={qrCode}
                    alt="Generated QR Code"
                    className="mx-auto"
                  />
                </div>
                <button
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRGenerator; 