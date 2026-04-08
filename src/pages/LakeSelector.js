import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Droplets, TrendingUp, ArrowLeft } from 'lucide-react';

export default function LakeSelector({ region, onLakeSelect, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  // Mock lake data based on region
  const getLakesForRegion = () => {
    const lakesData = {
      himalayas: [
        { id: 'imja', name: 'Imja Tsho', elevation: 5010, area: 1.28, growth: '+12.4%', risk: 'high' },
        { id: 'tsho', name: 'Tsho Rolpa', elevation: 4580, area: 1.54, growth: '+8.2%', risk: 'high' },
        { id: 'pho', name: 'Pho Chu', elevation: 4800, area: 0.92, growth: '+15.3%', risk: 'very-high' },
        { id: 'dig', name: 'Dig Tsho', elevation: 4560, area: 0.45, growth: '+5.1%', risk: 'moderate' },
        { id: 'nak', name: 'Nakoda Lake', elevation: 5100, area: 0.78, growth: '+9.8%', risk: 'high' },
        { id: 'ang', name: 'Angladumla', elevation: 4950, area: 0.65, growth: '+11.2%', risk: 'high' },
      ],
      andes: [
        { id: 'pam', name: 'Palcacocha', elevation: 4580, area: 0.95, growth: '+7.3%', risk: 'moderate' },
        { id: 'cha', name: 'Chaupimayo', elevation: 4450, area: 0.68, growth: '+4.5%', risk: 'low' },
        { id: 'sap', name: 'Sapagua', elevation: 4650, area: 0.82, growth: '+6.8%', risk: 'moderate' },
        { id: 'rac', name: 'Racacocha', elevation: 4720, area: 1.12, growth: '+9.2%', risk: 'high' },
      ],
      alps: [
        { id: 'oeschinen', name: 'Oeschinen', elevation: 1680, area: 0.42, growth: '+3.1%', risk: 'low' },
        { id: 'rhone', name: 'Rhone', elevation: 1800, area: 0.58, growth: '+2.4%', risk: 'low' },
        { id: 'morteratsch', name: 'Morteratsch', elevation: 2400, area: 0.72, growth: '+4.7%', risk: 'moderate' },
        { id: 'pizol', name: 'Pizol', elevation: 2460, area: 0.35, growth: '+1.8%', risk: 'low' },
      ],
    };

    return lakesData[region.id] || [];
  };

  const lakes = getLakesForRegion();

  const filteredLakes = lakes.filter(lake => {
    const matchesSearch = lake.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || lake.risk === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'very-high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-300 hover:text-primary-200 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Regions
          </button>
          <h1 className="text-4xl font-display font-bold mb-2">
            {region.name} - Lake Selection
          </h1>
          <p className="text-text-muted text-lg">
            Browse and select a glacial lake to view detailed analysis and predictions.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search lakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
            />
          </div>

          {/* Filter */}
          <div className="relative flex items-center gap-2">
            <Filter className="w-5 h-5 text-text-muted" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
              <option value="very-high">Very High Risk</option>
            </select>
          </div>
        </motion.div>

        {/* Lakes Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredLakes.map((lake, index) => (
            <motion.button
              key={lake.id}
              onClick={() => onLakeSelect(lake)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (index + 1) }}
              whileHover={{ y: -4 }}
              className="card group text-left relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>

              <div className="relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-primary-300 transition">
                      {lake.name}
                    </h3>
                    <p className="text-xs text-text-muted">
                      Lake ID: {lake.id.toUpperCase()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(lake.risk)}`}>
                    {lake.risk.replace('-', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-dark-900/50 rounded-lg">
                  <div>
                    <p className="text-xs text-text-muted">Elevation</p>
                    <p className="font-display font-bold text-primary-300 text-sm">
                      {lake.elevation}m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Area</p>
                    <p className="font-display font-bold text-primary-300 text-sm">
                      {lake.area}km²
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Growth</p>
                    <p className="font-display font-bold text-accent-300 text-sm">
                      {lake.growth}
                    </p>
                  </div>
                </div>

                {/* View Analysis CTA */}
                <div className="flex items-center gap-2 text-primary-300 group-hover:text-primary-200 transition text-sm font-medium">
                  <Droplets className="w-4 h-4" />
                  View Analysis
                  <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredLakes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Droplets className="w-12 h-12 text-text-muted opacity-50 mx-auto mb-4" />
            <p className="text-text-muted text-lg">No lakes found matching your criteria.</p>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg text-sm text-text-muted"
        >
          <p>💡 <strong>Tip:</strong> Select a lake to view detailed mapping, historical trends, and AI predictions for future expansion.</p>
        </motion.div>
      </div>
    </div>
  );
}
