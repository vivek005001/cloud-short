import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft, FiAlertTriangle, FiLoader } from "react-icons/fi";
import api from "../../utils/api";
import AnalyticsCard from "../../components/AnalyticsCard";

export default function AnalyticsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api.get(`/analytics/${id}`)
      .then(res => {
        // Ensure arrays exist
        setAnalytics({
          ...res.data,
          recentClicks: Array.isArray(res.data.recentClicks) ? res.data.recentClicks : [],
          topReferrers: Array.isArray(res.data.topReferrers) ? res.data.topReferrers : []
        });
      })
      .catch(err => {
        setError(err.response?.data?.error || "Server error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin w-12 h-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Analytics</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center mx-auto w-fit">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Analytics for <span className="text-blue-400">{analytics.short}</span>
            </h2>
            <p className="text-gray-400">
              Track your URL performance and engagement metrics
            </p>
          </div>

          <AnalyticsCard analytics={analytics} />
        </motion.div>
      </div>
    </div>
  );
}
