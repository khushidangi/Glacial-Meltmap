import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function StoryMode({ lake, region, onNavigate }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const scenes = [
    {
      title: 'The Glacier Story Begins',
      subtitle: 'Understanding Glacial Lake Formation',
      narration: 'Glacial lakes form when glaciers melt due to rising temperatures. As the ice retreats, meltwater accumulates in depressions, creating dynamic lakes that tell the story of climate change.',
      image: '🏔️',
      year: '2008',
      facts: [
        'Initial lake formation from glacier melt',
        'Small meltwater accumulation',
        'Beginning of monitoring efforts'
      ]
    },
    {
      title: 'Acceleration Phase',
      subtitle: 'Rapid Growth Detection',
      narration: 'Between 2010 and 2015, we observe accelerating growth patterns. Temperature increases and glacier retreat rates intensify, leading to dramatic expansion of the lake.',
      image: '💧',
      year: '2013',
      facts: [
        'Significant area expansion',
        'Increased meltwater flow',
        'Higher growth rates detected'
      ]
    },
    {
      title: 'Modern Era',
      subtitle: 'Current State and Trends',
      narration: `${lake.name} has grown from a small water body to a significant glacial lake. Modern satellite monitoring reveals the dramatic transformation and ongoing changes.`,
      image: '🌊',
      year: '2017',
      facts: [
        `Current area: ${lake.area} km²`,
        `Elevation: ${lake.elevation}m`,
        `Risk level: ${lake.risk.toUpperCase()}`
      ]
    },
    {
      title: 'Future Outlook',
      subtitle: 'AI Predictions for 2025',
      narration: 'Advanced AI models predict continued expansion. Without intervention, these lakes pose increasing risks to downstream communities. Monitoring and adaptation are critical.',
      image: '🔮',
      year: '2025 (Predicted)',
      facts: [
        'Projected area: 1.85 km²',
        'Expected growth: +44.5%',
        'Risk level: HIGH'
      ]
    },
    {
      title: 'The Bigger Picture',
      subtitle: 'Climate Change Implications',
      narration: 'Glacial lakes are powerful indicators of climate change. Their expansion reflects rising global temperatures and changing precipitation patterns across mountain regions.',
      image: '🌍',
      year: 'Present',
      facts: [
        '500+ lakes tracked in Himalayas',
        '300+ in Andes mountains',
        '150+ in Alpine regions'
      ]
    }
  ];

  const scene = scenes[currentScene];

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const handlePrev = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-8 py-6 border-b border-dark-700"
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-primary-300 text-sm font-medium mb-1">STORY MODE</p>
              <h1 className="text-3xl font-display font-bold">
                {lake.name} - A Glacial Tale
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-dark-800 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-text-muted">
                Scene {currentScene + 1} of {scenes.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Story Content */}
        <div className="flex-1 overflow-y-auto px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              {/* Left - Story Content */}
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2"
              >
                {/* Title & Subtitle */}
                <div className="mb-8">
                  <h2 className="text-5xl font-display font-bold mb-3 bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent">
                    {scene.title}
                  </h2>
                  <p className="text-xl text-text-muted mb-6">
                    {scene.subtitle}
                  </p>

                  {/* Year Badge */}
                  <div className="inline-block px-6 py-3 bg-primary-500/20 border border-primary-500/30 rounded-lg">
                    <p className="font-display font-bold text-primary-300 text-lg">
                      {scene.year}
                    </p>
                  </div>
                </div>

                {/* Narration */}
                <div className="prose prose-invert max-w-none mb-12">
                  <p className="text-lg leading-relaxed text-text-light mb-8">
                    {scene.narration}
                  </p>
                </div>

                {/* Key Facts */}
                <div className="space-y-3">
                  <p className="text-sm font-display font-semibold text-primary-300 uppercase tracking-wide">Key Facts</p>
                  {scene.facts.map((fact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg border border-dark-700"
                    >
                      <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                      <p className="text-text-light">{fact}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Visual & Timeline */}
              <motion.div
                key={`visual-${currentScene}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col gap-8"
              >
                {/* Large Visual */}
                <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-dark-700 rounded-lg flex items-center justify-center overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition"></div>
                  <div className="text-9xl">
                    {scene.image}
                  </div>
                </div>

                {/* Scene Navigation */}
                <div className="space-y-3">
                  <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden border border-dark-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                    />
                  </div>
                  <p className="text-xs text-text-muted text-center">
                    {currentScene + 1} of {scenes.length}
                  </p>
                </div>

                {/* Timeline Dots */}
                <div className="flex gap-2 justify-center">
                  {scenes.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentScene(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-3 h-3 rounded-full transition ${
                        index === currentScene
                          ? 'bg-accent-400 w-8'
                          : 'bg-dark-600 hover:bg-dark-500'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-dark-700 px-8 py-6 bg-gradient-to-t from-dark-900 to-transparent"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Controls */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  disabled={currentScene === 0}
                  className="p-3 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-3 btn btn-primary"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={currentScene === scenes.length - 1}
                  className="p-3 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-3 rounded-lg transition ${
                    voiceEnabled ? 'bg-primary-500/20 text-primary-300' : 'bg-dark-800'
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </motion.button>
              </div>

              {/* Info */}
              <p className="text-text-muted text-sm">
                {voiceEnabled && '🔊 Voice narration enabled'}
              </p>

              {/* Action */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('analytics')}
                className="btn btn-secondary"
              >
                View Full Analytics
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
