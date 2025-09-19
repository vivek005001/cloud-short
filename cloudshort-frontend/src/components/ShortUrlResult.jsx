import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheck, FiAlertTriangle, FiCopy, FiBarChart, FiRefreshCw } from "react-icons/fi";

export default function ShortUrlResult({ result }) {
  if (!result) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.redirect_url);
  };

  return (
    <motion.div
      className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FiCheck className="mr-2 w-5 h-5 text-green-400" />
            URL Shortened Successfully!
          </h3>
          {result.mlResult?.is_suspicious && (
            <motion.div
              className="bg-red-900/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-sm font-medium flex items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FiAlertTriangle className="w-3 h-3 mr-1" />
              Suspicious
            </motion.div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-1">Short URL:</p>
              <Link 
                href={result.redirect_url} 
                className="text-blue-400 hover:text-blue-300 break-all transition-colors font-mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.redirect_url}
              </Link>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-4 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <FiCopy className="w-4 h-4 mr-2" />
              Copy
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href={`/analytics/${result.short}`} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center"
          >
            <FiBarChart className="w-5 h-5 mr-2" />
            View Analytics
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Shorten Another
          </button>
        </div>
      </div>
    </motion.div>
  );
}
