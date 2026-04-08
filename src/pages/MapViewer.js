import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Download, Share2, Info } from 'lucide-react';

export default function MapViewer({ lake, region, year, onYearChange, onNavigate }) {
  const [showInfo, setShowInfo] = useState(true);
  const [bounds, setBounds] = useState(null);

  const years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

  // Generate realistic lake data for visualization
  const getLakeDataByYear = (lakeId, selectedYear) => {
    const baseData = {
      imja: { 2008: 0.02, 2009: 0.05, 2010: 0.12, 2011: 0.19, 2012: 0.32, 2013: 0.45, 2014: 0.62, 2015: 0.89, 2016: 1.12, 2017: 1.28 },
      tsho: { 2008: 0.8, 2009: 0.92, 2010: 1.02, 2011: 1.15, 2012: 1.28, 2013: 1.35, 2014: 1.42, 2015: 1.48, 2016: 1.51, 2017: 1.54 },
    };
    return baseData[lakeId]?.[selectedYear] || 0;
  };

  const currentArea = getLakeDataByYear(lake.id, year);
  const previousArea = year > 2008 ? getLakeDataByYear(lake.id, year - 1) : currentArea;
  const yearlyChange = ((currentArea - previousArea) / previousArea * 100).toFixed(1);

  return (
    <div className="w-full h-full overflow-y-auto bg-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">{lake.name}</h1>
            <p className="text-text-muted">
              {region.name} • Elevation {lake.elevation}m
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="btn btn-secondary">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map and Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Map Container */}
            <div className="card p-0 overflow-hidden mb-6 h-96 relative bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5"></div>
              
              {/* Placeholder for map - would use Leaflet in production */}
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-text-muted mb-2">
                  {lake.name} - {year}
                </p>
                <p className="text-primary-300 font-display font-bold">
                  {currentArea.toFixed(2)} km²
                </p>
                <p className="text-xs text-text-muted mt-2">
                  (Map visualization would display satellite imagery with lake boundaries)
                </p>
              </div>

              {/* Year Badge */}
              <div className="absolute top-4 right-4 px-4 py-2 bg-dark-900/80 border border-primary-500/30 rounded-lg backdrop-blur">
                <p className="text-sm font-display font-bold text-primary-300">{year}</p>
              </div>
            </div>

            {/* Timeline Slider */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <span>Timeline</span>
                <span className="text-primary-300 text-sm font-normal">2008 - 2017</span>
              </h3>

              {/* Slider */}
              <div className="space-y-4">
                <input
                  type="range"
                  min="2008"
                  max="2017"
                  value={year}
                  onChange={(e) => onYearChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--primary-blue) 0%, var(--primary-blue) ${((year - 2008) / 9) * 100}%, var(--dark-tertiary) ${((year - 2008) / 9) * 100}%, var(--dark-tertiary) 100%)`
                  }}
                />

                {/* Year Labels */}
                <div className="flex justify-between text-xs text-text-muted px-1">
                  <span>2008</span>
                  <span>2013</span>
                  <span>2017</span>
                </div>

                {/* Year Display */}
                <div className="text-center py-2 bg-dark-900/50 rounded-lg">
                  <p className="font-display font-bold text-2xl text-primary-300">{year}</p>
                  <p className="text-xs text-text-muted">Selected Year</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => onYearChange(Math.max(2008, year - 1))}
                  disabled={year === 2008}
                  className="flex-1 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => onYearChange(Math.min(2017, year + 1))}
                  disabled={year === 2017}
                  className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Play Animation */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 btn btn-accent"
              >
                ▶ Play Timeline Animation
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Sidebar - Statistics and Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Current Stats */}
            <div className="card">
              <h3 className="font-display font-semibold mb-4">Current Metrics ({year})</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-dark-900/50 rounded-lg">
                  <p className="text-xs text-text-muted mb-1">Surface Area</p>
                  <p className="text-2xl font-display font-bold text-primary-300">
                    {currentArea.toFixed(2)} <span className="text-sm">km²</span>
                  </p>
                  <p className={`text-xs font-medium mt-1 ${yearlyChange > 0 ? 'text-accent-300' : 'text-green-300'}`}>
                    {yearlyChange > 0 ? '📈' : '📉'} {Math.abs(parseFloat(yearlyChange)).toFixed(1)}% YoY
                  </p>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-lg">
                  <p className="text-xs text-text-muted mb-1">Total Growth</p>
                  <p className="text-2xl font-display font-bold text-accent-300">
                    {((currentArea - getLakeDataByYear(lake.id, 2008)) / getLakeDataByYear(lake.id, 2008) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-text-muted mt-1">Since 2008</p>
                </div>

                <div className="p-3 bg-dark-900/50 rounded-lg">
                  <p className="text-xs text-text-muted mb-1">Elevation</p>
                  <p className="text-2xl font-display font-bold text-primary-300">
                    {lake.elevation} <span className="text-sm">m</span>
                  </p>
                  <p className="text-xs text-text-muted mt-1">Above sea level</p>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Risk Level</h3>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-primary-400 hover:text-primary-300"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              <div className={`p-4 rounded-lg border ${
                lake.risk === 'very-high'
                  ? 'bg-red-500/20 border-red-500/30'
                  : lake.risk === 'high'
                  ? 'bg-orange-500/20 border-orange-500/30'
                  : lake.risk === 'moderate'
                  ? 'bg-yellow-500/20 border-yellow-500/30'
                  : 'bg-green-500/20 border-green-500/30'
              }`}>
                <p className="font-display font-bold text-white mb-2">
                  {lake.risk.replace('-', ' ').toUpperCase()}
                </p>
                <p className="text-sm text-text-muted">
                  High growth rate and rapid expansion observed. Continuous monitoring recommended.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-display font-semibold mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('analytics')}
                  className="w-full btn btn-primary"
                >
                  View Analytics
                </button>
                <button
                  onClick={() => onNavigate('story')}
                  className="w-full btn btn-secondary"
                >
                  Watch Story
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="card">
              <h3 className="font-display font-semibold mb-4">Legend</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-text-muted">Lake Boundary</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-text-muted">Growth Area</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-text-muted">Glacier</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark) 100%);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark) 100%);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
          border: none;
        }
      `}</style>
    </div>
  );
}
