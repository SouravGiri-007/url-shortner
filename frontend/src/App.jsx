import React, { useState } from 'react';
import { AlertCircle, Copy, Link2, Github, Moon, Sun } from 'lucide-react';

const App = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch('http://localhost:3000/api/short', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortUrl(data.url.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`http://localhost:3000/${shortUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header with Dark Mode Toggle */}
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h2 className={`mt-6 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>URL Shortener</h2>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Paste your long URL below to create a shorter version
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="url" className="sr-only">
                  URL to shorten
                </label>
                <input
                  id="url"
                  type="url"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                    darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your URL here"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !originalUrl.trim()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Link2 className="w-4 h-4 mr-2" />
                {loading ? 'Shortening...' : 'Shorten URL'}
              </button>
            </div>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {shortUrl && (
            <div className={`mt-4 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your shortened URL:</h3>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href={`http://localhost:3000/${shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  http://localhost:3000/{shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className={`ml-2 p-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-sm text-green-500">Copied to clipboard!</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className={`py-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="max-w-md mx-auto px-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Made with ❤️ by Your Name
          </p>
          <div className="mt-3 flex justify-center space-x-4 items-center">
            <a 
              href="https://github.com/SouravGiri-007" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="mailto:souravgiri.dev@gmail.com"
              className={`text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Contact Here 💌
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;