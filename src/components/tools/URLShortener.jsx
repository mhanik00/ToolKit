import { useState, useEffect } from 'react';

function URLShortener() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load saved URLs from localStorage
  useEffect(() => {
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      setShortenedUrls(JSON.parse(savedUrls));
    }
  }, []);

  // Save URLs to localStorage
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const shortenUrl = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      // Using TinyURL API (you can replace this with your preferred URL shortening service)
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to shorten URL');
      
      const shortUrl = await response.text();
      const newEntry = {
        id: Date.now(),
        originalUrl: url,
        shortUrl,
        customAlias: customAlias || '',
        createdAt: new Date().toISOString(),
        clicks: 0
      };

      setShortenedUrls(prev => [newEntry, ...prev]);
      setUrl('');
      setCustomAlias('');
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteUrl = (id) => {
    setShortenedUrls(prev => prev.filter(url => url.id !== id));
  };

  const incrementClicks = (id) => {
    setShortenedUrls(prev =>
      prev.map(url =>
        url.id === id ? { ...url, clicks: url.clicks + 1 } : url
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            URL Shortener
          </h2>

          {/* URL Input Form */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Long URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to shorten"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Custom Alias (Optional)
              </label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="Enter custom alias"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={shortenUrl}
              disabled={!url || loading}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>

            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Shortened URLs List */}
          {shortenedUrls.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Shortened URLs
              </h3>
              <div className="space-y-4">
                {shortenedUrls.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {item.originalUrl}
                        </p>
                        <div className="flex items-center mt-1">
                          <a
                            href={item.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => incrementClicks(item.id)}
                            className="text-blue-500 hover:text-blue-600 font-medium"
                          >
                            {item.shortUrl}
                          </a>
                          <button
                            onClick={() => copyToClipboard(item.shortUrl)}
                            className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {copied === item.shortUrl ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteUrl(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDate(item.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{item.clicks} clicks</span>
                      {item.customAlias && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Alias: {item.customAlias}</span>
                        </>
                      )}
                    </div>
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

export default URLShortener; 