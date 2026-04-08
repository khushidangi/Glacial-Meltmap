import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Mountain } from 'lucide-react';

export default function Header({ onMenuClick, currentView }) {
  const viewTitles = {
    home: 'Glacial MeltMap',
    regions: 'Select Region',
    lakes: 'Select Lake',
    map: 'Lake Visualization',
    analytics: 'Analytics Dashboard',
    story: 'Story Mode',
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-b border-dark-700 z-50 backdrop-blur-md">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-dark-700 rounded-lg transition"
          >
            <Menu className="w-6 h-6 text-primary-400" />
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white leading-tight">
                GlacialMelt
              </h1>
              <p className="text-xs text-primary-300">Analysis Platform</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="font-display font-semibold text-lg text-white">
            {viewTitles[currentView] || 'Dashboard'}
          </h2>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-text-muted">
            <p className="text-primary-300 font-semibold">AI-Driven</p>
            <p className="text-text-muted">Visualization</p>
          </div>
        </div>
      </div>
    </header>
  );
}
