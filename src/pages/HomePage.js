import React from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Zap, Mountain, ArrowRight } from 'lucide-react';

export default function HomePage({ onNavigate }) {
  const features = [
    {
      icon: Mountain,
      title: 'Glacier Tracking',
      description: 'Monitor glacial lake evolution from 2008 to present with high-resolution satellite data.',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'AI-driven predictions for future glacial lake growth and expansion patterns.',
    },
    {
      icon: Zap,
      title: 'Interactive Timeline',
      description: 'Smooth slider control to explore temporal changes in glacial lakes.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Data from Himalayas, Andes, and Alps with 500+ lakes tracked.',
    },
  ];

  const stats = [
    { label: 'Lakes Tracked', value: '500+' },
    { label: 'Years of Data', value: '10+' },
    { label: 'Regions Covered', value: '3' },
    { label: 'Accuracy', value: '95%' },
  ];

  return (
    <div className="relative w-full h-full overflow-y-auto bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-8 md:p-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6"
            >
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span className="text-primary-300 text-sm font-medium">Live Climate Data</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent leading-tight">
              Glacial Lake Evolution Tracker
            </h1>

            <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
              Visualize and analyze the historical and predicted evolution of glacial lakes across the world's major mountain ranges using advanced AI and satellite imagery.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('regions')}
                className="btn btn-primary flex items-center gap-2"
              >
                Start Exploring <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('story')}
                className="btn btn-secondary flex items-center gap-2"
              >
                Watch Stories
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card text-center"
              >
                <p className="text-text-muted text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-display font-bold text-primary-300">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Powerful Insights
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="card group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-text-muted text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-4xl mx-auto mt-16 p-8 rounded-xl border border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-accent-500/5"
        >
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold mb-3">Ready to explore?</h3>
            <p className="text-text-muted mb-6">
              Select a region to view detailed glacial lake data, historical trends, and AI predictions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('regions')}
              className="btn btn-accent"
            >
              Choose a Region
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
