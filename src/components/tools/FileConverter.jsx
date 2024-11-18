import { useState } from 'react';

function FileConverter() {
  const [file, setFile] = useState(null);
  const [convertTo, setConvertTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);

  const fileTypes = {
    image: {
      name: 'Image',
      formats: ['jpg', 'png', 'webp', 'gif'],
      accept: 'image/*'
    },
    document: {
      name: 'Document',
      formats: ['pdf', 'docx', 'txt'],
      accept: '.pdf,.docx,.txt'
    },
    audio: {
      name: 'Audio',
      formats: ['mp3', 'wav', 'ogg'],
      accept: 'audio/*'
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setConvertedFile(null);
      
      // Auto-select conversion format based on file type
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const category = Object.keys(fileTypes).find(key => 
        fileTypes[key].formats.includes(fileExtension)
      );
      
      if (category) {
        const availableFormats = fileTypes[category].formats.filter(
          format => format !== fileExtension
        );
        if (availableFormats.length > 0) {
          setConvertTo(availableFormats[0]);
        }
      }
    }
  };

  const convertFile = async () => {
    if (!file || !convertTo) return;

    setLoading(true);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', convertTo);

      // Here you would typically send the file to your backend for conversion
      // For this example, we'll simulate a conversion
      await simulateConversion();

      // Create a dummy converted file for demonstration
      const blob = await file.arrayBuffer();
      const convertedBlob = new Blob([blob], { type: `application/${convertTo}` });
      const convertedFileUrl = URL.createObjectURL(convertedBlob);
      
      setConvertedFile({
        url: convertedFileUrl,
        name: `converted.${convertTo}`
      });
    } catch (err) {
      setError('Error converting file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simulate file conversion delay
  const simulateConversion = () => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const downloadFile = () => {
    if (!convertedFile) return;

    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileCategory = () => {
    if (!file) return null;
    const extension = file.name.split('.').pop().toLowerCase();
    return Object.keys(fileTypes).find(key => 
      fileTypes[key].formats.includes(extension)
    );
  };

  const getAvailableFormats = () => {
    const category = getFileCategory();
    if (!category || !file) return [];
    
    const currentExtension = file.name.split('.').pop().toLowerCase();
    return fileTypes[category].formats.filter(
      format => format !== currentExtension
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            File Converter
          </h2>

          {/* File Upload */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept={Object.values(fileTypes).map(type => type.accept).join(',')}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Choose File
              </label>
              {file && (
                <div className="mt-4 text-gray-600 dark:text-gray-300">
                  Selected: {file.name}
                </div>
              )}
            </div>
          </div>

          {/* Conversion Options */}
          {file && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Convert to:
              </label>
              <select
                value={convertTo}
                onChange={(e) => setConvertTo(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select format</option>
                {getAvailableFormats().map(format => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={convertFile}
            disabled={!file || !convertTo || loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Converting...' : 'Convert File'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Converted File */}
          {convertedFile && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Conversion complete!
                </span>
                <button
                  onClick={downloadFile}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Supported Formats */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Supported Formats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(fileTypes).map(([key, type]) => (
                <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {type.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {type.formats.map(format => (
                      <span
                        key={format}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        {format.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileConverter; 