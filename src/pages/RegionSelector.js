import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mountain } from 'lucide-react';

export default function RegionSelector({ onRegionSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const regions = [
    {
      id: 'himalayas',
      name: 'Himalayas',
      subtitle: 'Hindu Kush Karakoram Region',
      lakeCount: '500+',
      dataYears: '2008-2020',
      riskLevel: 'HIGH GROWTH',
      description: 'The largest concentration of glacial lakes. Rapid expansion observed.',
      color: 'from-blue-600 to-blue-400',
      risk: 'high',
    },
    {
      id: 'andes',
      name: 'Andes',
      subtitle: 'South American Range',
      lakeCount: '300+',
      dataYears: '2010-2020',
      riskLevel: 'MODERATE',
      description: 'Significant glacial retreat with steady lake growth.',
      color: 'from-green-600 to-green-400',
      risk: 'moderate',
    },
    {
      id: 'alps',
      name: 'Alps',
      subtitle: 'European Alpine Region',
      lakeCount: '150+',
      dataYears: '2005-2022',
      riskLevel: 'STABLE',
      description: 'Well-monitored region with established baseline data.',
      color: 'from-purple-600 to-purple-400',
      risk: 'low',
    },
  ];

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'moderate':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-green-500/10 border-green-500/30 text-green-300';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-3">Select a Region</h1>
          <p className="text-text-muted text-lg">
            Choose a mountain region to explore glacial lake data, trends, and predictions.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
            />
          </div>
        </motion.div>

        {/* Region Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredRegions.map((region, index) => (
            <motion.button
              key={region.id}
              onClick={() => onRegionSelect(region)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ y: -8 }}
              className="text-left"
            >
              <div className={`card h-full overflow-hidden group cursor-pointer bg-gradient-to-br ${region.color} relative opacity-20 mb-4 h-32 rounded-lg`}></div>
              
              <div className="card group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      {region.name}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {region.subtitle}
                    </p>
                  </div>
                  <Mountain className="w-6 h-6 text-primary-400 opacity-0 group-hover:opacity-100 transition" />
                </div>

                {/* Description */}
                <p className="text-text-muted text-sm mb-4">
                  {region.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-dark-900/50 rounded-lg">
                  <div>
                    <p className="text-xs text-text-muted">Lakes</p>
                    <p className="font-display font-bold text-primary-300">
                      {region.lakeCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Data Years</p>
                    <p className="font-display font-bold text-primary-300">
                      {region.dataYears}
                    </p>
                  </div>
                </div>

                {/* Risk Badge */}
                <div className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${getRiskColor(region.risk)}`}>
                  {region.riskLevel}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredRegions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-text-muted text-lg">No regions found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
