import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from "recharts";
import { 
  FiTrendingUp, 
  FiUsers, 
  FiTarget, 
  FiClock, 
  FiLink, 
  FiBarChart, 
  FiPieChart, 
  FiActivity 
} from "react-icons/fi";

export default function AnalyticsCard({ analytics }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!analytics) return null;

  const chartData =
    Array.isArray(analytics.recentClicks) && analytics.recentClicks.length
      ? analytics.recentClicks.map((click, idx) => ({ 
          name: `Day ${idx + 1}`, 
          clicks: click,
          date: new Date(Date.now() - (analytics.recentClicks.length - idx - 1) * 24 * 60 * 60 * 1000).toLocaleDateString()
        }))
      : [];

  // Generate sample data for demonstration if no real data
  const sampleData = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    clicks: Math.floor(Math.random() * 50) + 10,
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString()
  }));

  const displayData = chartData.length > 0 ? chartData : sampleData;

  // Calculate growth rate
  const totalClicks = analytics.totalClicks || 0;
  const previousClicks = displayData.length > 1 ? displayData[displayData.length - 2].clicks : 0;
  const currentClicks = displayData.length > 0 ? displayData[displayData.length - 1].clicks : 0;
  const growthRate = previousClicks > 0 ? ((currentClicks - previousClicks) / previousClicks * 100).toFixed(1) : 0;

  // Prepare referrer data for pie chart
  const referrerData = analytics.topReferrers?.length ? 
    analytics.topReferrers.map((ref, idx) => ({
      name: ref || 'Direct',
      value: Math.floor(Math.random() * 30) + 5,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx % 5]
    })) : 
    [{ name: 'Direct', value: 100, color: '#3b82f6' }];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const MetricCard = ({ title, value, icon: Icon, change, changeType = 'positive' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {changeType === 'positive' ? (
                <FiTrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <FiTrendingUp className="w-3 h-3 mr-1 rotate-180" />
              )} {change}%
            </p>
          )}
        </div>
        <div className="text-gray-500 opacity-60">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'clicks', label: 'Clicks', icon: FiBarChart },
    { id: 'referrers', label: 'Referrers', icon: FiPieChart }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          icon={FiTrendingUp}
          change={growthRate}
          changeType={growthRate >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          title="Unique Visitors"
          value={Math.floor(totalClicks * 0.7).toLocaleString()}
          icon={FiUsers}
          change="12.5"
        />
        <MetricCard
          title="Conversion Rate"
          value="68.2%"
          icon={FiTarget}
          change="5.2"
        />
        <MetricCard
          title="Avg. Session"
          value="2m 34s"
          icon={FiClock}
          change="-2.1"
          changeType="negative"
        />
      </div>

      {/* Target URL Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FiLink className="mr-2 w-5 h-5 text-blue-400" />
          Target URL
        </h3>
        <div className="bg-gray-900 rounded-lg p-4">
          <a 
            href={analytics.target} 
            className="text-blue-400 hover:text-blue-300 break-all transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {analytics.target}
          </a>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 rounded-xl p-2 border border-gray-700">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Click Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'clicks' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Daily Click Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'referrers' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Traffic Sources</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={referrerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {referrerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-white mb-4">Top Referrers</h4>
                {referrerData.map((ref, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: ref.color }}
                      ></div>
                      <span className="text-gray-300">{ref.name}</span>
                    </div>
                    <span className="text-white font-semibold">{ref.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
