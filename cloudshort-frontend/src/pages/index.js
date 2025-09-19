import { useState } from "react";
import { motion } from "framer-motion";
import { FiBarChart, FiShield, FiTarget } from "react-icons/fi";
import api from "../utils/api";
import ShortenForm from "../components/ShortenForm";
import ShortUrlResult from "../components/ShortUrlResult";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShorten = async (url) => {
    setLoading(true);
    try {
      const res = await api.post("/shorten", { url });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <h1 className="text-xl font-semibold">Smart URL Shortener</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-4 text-white">
            Shorten URLs with
            <span className="text-blue-400 block">Smart Analytics</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Create short links and track their performance with detailed analytics, 
            real-time insights, and beautiful visualizations.
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ShortenForm onShorten={handleShorten} loading={loading} />
          <ShortUrlResult result={result} />
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-center mb-4">
              <FiBarChart className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-400">Track clicks, referrers, and engagement with beautiful charts</p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-center mb-4">
              <FiShield className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Fast</h3>
            <p className="text-gray-400">Enterprise-grade security with lightning-fast redirects</p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-center mb-4">
              <FiTarget className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Detection</h3>
            <p className="text-gray-400">AI-powered suspicious URL detection and filtering</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
