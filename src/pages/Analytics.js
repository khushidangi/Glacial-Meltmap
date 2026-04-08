import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Download } from 'lucide-react';

export default function Analytics({ lake, region, onNavigate }) {
  const [selectedMetric, setSelectedMetric] = useState('area');

  // Generate historical and predicted data
  const generateChartData = () => {
    const data = [];
    for (let year = 2008; year <= 2025; year++) {
      const baseGrowth = year <= 2017 ? (year - 2008) * 0.12 : (9 * 0.12) + ((year - 2017) * 0.15);
      const isPredicted = year > 2017;
      
      data.push({
        year,
        area: Math.max(0.01, 0.02 + baseGrowth),
        elevation: 5010 - Math.random() * 50,
        growth: isPredicted ? null : Math.random() * 20,
        predicted: isPredicted,
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const historicalData = chartData.filter(d => d.year <= 2017);
  const predictedData = chartData.filter(d => d.year >= 2017);

  // Statistics
  const stats = [
    {
      label: 'Growth Rate',
      value: '+12.4%',
      subtext: 'Past Decade',
      color: 'accent',
    },
    {
      label: 'Current Area',
      value: '1.28 km²',
      subtext: 'As of 2017',
      color: 'primary',
    },
    {
      label: 'Total Expansion',
      value: '6,200%',
      subtext: 'Since 2008',
      color: 'accent',
    },
    {
      label: 'Risk Level',
      value: 'HIGH',
      subtext: 'Continuous Growth',
      color: 'orange',
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">{lake.name} - Analytics</h1>
            <p className="text-text-muted">
              Detailed analysis and predictions for {region.name}
            </p>
          </div>
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="card">
              <p className="text-xs text-text-muted mb-2">{stat.label}</p>
              <p className={`text-2xl font-display font-bold ${
                stat.color === 'accent' ? 'text-accent-300' :
                stat.color === 'primary' ? 'text-primary-300' :
                'text-orange-300'
              }`}>
                {stat.value}
              </p>
              <p className="text-xs text-text-muted mt-1">{stat.subtext}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-display font-bold mb-6">Lake Area Evolution</h2>
          <p className="text-text-muted text-sm mb-4">Historical data (2008-2017) and AI predictions (2018-2025)</p>
          
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="year" 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                label={{ value: 'Area (km²)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="area"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorArea)"
                name="Historical Area"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Growth Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Year-over-Year Growth */}
          <div className="card">
            <h3 className="text-xl font-display font-bold mb-4">Year-over-Year Growth</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData.slice(1)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(value) => value ? `${value.toFixed(1)}%` : 'N/A'}
                />
                <Bar 
                  dataKey="growth" 
                  fill="#f97316"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Boundary Complexity */}
          <div className="card">
            <h3 className="text-xl font-display font-bold mb-4">Boundary Expansion</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="year" 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  dataKey="area" 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
                />
                <Scatter 
                  name="Lake Boundary" 
                  data={historicalData}
                  fill="#0ea5e9"
                />
                <Scatter 
                  name="Predicted" 
                  data={predictedData}
                  fill="#f97316"
                  shape="diamond"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Predictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent-400" />
            AI Predictions (2018-2025)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
              <p className="text-xs text-text-muted mb-2">Projected 2025 Area</p>
              <p className="text-3xl font-display font-bold text-accent-300 mb-2">1.85 km²</p>
              <p className="text-sm text-text-muted">
                Expected expansion of <span className="text-accent-300 font-semibold">+44.5%</span> from 2017 baseline
              </p>
            </div>

            <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
              <p className="text-xs text-text-muted mb-2">Growth Rate (Annual)</p>
              <p className="text-3xl font-display font-bold text-accent-300 mb-2">5.9%</p>
              <p className="text-sm text-text-muted">
                Projected average annual growth through 2025
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-orange-200">
              ⚠️ <strong>Warning:</strong> This lake shows accelerating growth patterns. Enhanced monitoring and risk assessment recommended for downstream communities.
            </p>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          <div className="card">
            <h3 className="font-display font-semibold mb-3">Trend Analysis</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>✓ Consistent expansion since 2008</li>
              <li>✓ Acceleration phase 2013-2017</li>
              <li>⚠ Rapid growth expected 2018-2025</li>
              <li>✓ Higher elevation lakes more stable</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold mb-3">Climate Factors</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>📊 Temperature increase: +1.2°C</li>
              <li>📊 Precipitation change: -5%</li>
              <li>📊 Glacier retreat rate: High</li>
              <li>📊 NDVI decline: Significant</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>🎯 Monthly monitoring advised</li>
              <li>🎯 Impact assessment needed</li>
              <li>🎯 Community alert systems</li>
              <li>🎯 Continued research priority</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
