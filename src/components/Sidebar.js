import React from 'react';
import { motion } from 'framer-motion';
import { Home, Map, BarChart3, BookOpen, Globe, Settings } from 'lucide-react';

export default function Sidebar({ open, currentView, onNavigate }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'regions', label: 'Explore Regions', icon: Globe },
    { id: 'map', label: 'Map Viewer', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'story', label: 'Story Mode', icon: BookOpen },
  ];

  return (
    <motion.aside
      animate={{ width: open ? 256 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-gradient-to-b from-dark-800 to-dark-900 border-r border-dark-700 overflow-hidden z-40 backdrop-blur-md ${
        open ? 'shadow-xl' : ''
      }`}
    >
      <nav className="flex flex-col p-4 h-full">
        <div className="space-y-2 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                    : 'text-text-muted hover:bg-dark-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-dark-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-dark-700 hover:text-white transition">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>

        <div className="mt-4 p-3 bg-dark-800 rounded-lg border border-dark-700">
          <p className="text-xs text-text-muted font-medium mb-2">Version</p>
          <p className="text-xs text-primary-300">v1.0.0</p>
        </div>
      </nav>
    </motion.aside>
  );
}
