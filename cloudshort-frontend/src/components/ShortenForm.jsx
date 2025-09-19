import { useState } from "react";

export default function ShortenForm({ onShorten, loading }) {
    const [url, setUrl] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!url) return;
      onShorten(url);
    };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter your long URL here..."
            className="w-full px-6 py-4 rounded-lg border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform hover:scale-105 active:scale-95"
          disabled={loading || !url.trim()}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Shortening...
            </span>
          ) : (
            "Shorten URL"
          )}
        </button>
      </div>
    </form>
  );
  }
  