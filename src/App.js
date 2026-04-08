import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RegionSelector from './pages/RegionSelector';
import LakeSelector from './pages/LakeSelector';
import MapViewer from './pages/MapViewer';
import Analytics from './pages/Analytics';
import StoryMode from './pages/StoryMode';
import './styles/App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedLake, setSelectedLake] = useState(null);
  const [currentYear, setCurrentYear] = useState(2013);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />;
      case 'regions':
        return <RegionSelector 
          onRegionSelect={(region) => {
            setSelectedRegion(region);
            setCurrentView('lakes');
          }} 
        />;
      case 'lakes':
        return <LakeSelector 
          region={selectedRegion}
          onLakeSelect={(lake) => {
            setSelectedLake(lake);
            setCurrentView('map');
          }}
          onBack={() => setCurrentView('regions')}
        />;
      case 'map':
        return <MapViewer 
          lake={selectedLake}
          region={selectedRegion}
          year={currentYear}
          onYearChange={setCurrentYear}
          onNavigate={setCurrentView}
        />;
      case 'analytics':
        return <Analytics 
          lake={selectedLake}
          region={selectedRegion}
          onNavigate={setCurrentView}
        />;
      case 'story':
        return <StoryMode 
          lake={selectedLake}
          region={selectedRegion}
          onNavigate={setCurrentView}
        />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="app-container bg-dark-900 min-h-screen text-white">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
      />
      <div className="flex pt-16">
        <Sidebar 
          open={sidebarOpen}
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            if(view === 'home') {
              setSelectedRegion(null);
              setSelectedLake(null);
            }
          }}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
