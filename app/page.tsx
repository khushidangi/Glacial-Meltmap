'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import { MapPin, Home, Globe, Map, BarChart3, BookOpen, Settings, ChevronRight, AlertTriangle, Zap } from 'lucide-react'

// Mock data with proper styling
const lakesData = [
  { id: '1', name: 'Imja Tsho', region: 'Himalayas', location: 'Khumbu, Nepal', elevation: '5,010m', area: '1.28 km²', growth: '+12.4%', riskLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { id: '2', name: 'Tsho Rolpa', region: 'Himalayas', location: 'Rolwaling, Nepal', elevation: '4,580m', area: '1.54 km²', growth: '+8.2%', riskLevel: 'MODERATE', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { id: '3', name: 'Laguna Palcacocha', region: 'Andes', location: 'Peru', elevation: '4,500m', area: '2.1 km²', growth: '+15.3%', riskLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
]

const areaEvolutionData = [
  { year: 2008, area: 0.63, predicted: null },
  { year: 2010, area: 0.83, predicted: null },
  { year: 2012, area: 1.12, predicted: null },
  { year: 2014, area: 1.44, predicted: null },
  { year: 2016, area: 1.72, predicted: null },
  { year: 2018, area: 1.98, predicted: null },
  { year: 2020, area: 2.15, predicted: null },
  { year: 2022, area: 2.35, predicted: null },
  { year: 2024, area: 2.47, predicted: null },
  { year: 2026, area: 2.65, predicted: 2.75 },
  { year: 2030, area: null, predicted: 2.95 },
  { year: 2040, area: null, predicted: 3.45 },
  { year: 2050, area: null, predicted: 3.89 },
]

const temperatureData = [
  { month: 'Jan', temp: -10 },
  { month: 'Feb', temp: -8 },
  { month: 'Mar', temp: -2 },
  { month: 'Apr', temp: 4 },
  { month: 'May', temp: 12 },
  { month: 'Jun', temp: 14 },
  { month: 'Jul', temp: 13 },
  { month: 'Aug', temp: 12 },
  { month: 'Sep', temp: 8 },
  { month: 'Oct', temp: 2 },
  { month: 'Nov', temp: -5 },
  { month: 'Dec', temp: -12 },
]

const precipitationData = [
  { month: 'Jan', precip: 40 },
  { month: 'Feb', precip: 50 },
  { month: 'Mar', precip: 65 },
  { month: 'Apr', precip: 100 },
  { month: 'May', precip: 150 },
  { month: 'Jun', precip: 200 },
  { month: 'Jul', precip: 220 },
  { month: 'Aug', precip: 200 },
  { month: 'Sep', precip: 160 },
  { month: 'Oct', precip: 90 },
  { month: 'Nov', precip: 60 },
  { month: 'Dec', precip: 45 },
]

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'regions', label: 'Explore Regions', icon: Globe },
  { id: 'map', label: 'Map Viewer', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'stories', label: 'Story Mode', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const regions = [
  {
    id: 'himalayas',
    name: 'Himalayas',
    desc: 'Hindu Kush Karakoram Region',
    details: 'The largest concentration of glacial lakes. Rapid expansion observed.',
    lakes: '500+',
    status: 'HIGH GROWTH',
    statusColor: 'bg-destructive',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    id: 'andes',
    name: 'Andes',
    desc: 'South American Range',
    details: 'Significant glacial retreat with steady lake growth.',
    lakes: '300+',
    status: 'MODERATE',
    statusColor: 'bg-yellow-500',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    id: 'alps',
    name: 'Alps',
    desc: 'European Alpine Region',
    details: 'Well-monitored region with established baseline data.',
    lakes: '150+',
    status: 'STABLE',
    statusColor: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
]

export default function GlacialMeltDashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedLake, setSelectedLake] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLakes = lakesData.filter(
    lake => lake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lake.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedLakeData = selectedLake ? lakesData.find(l => l.id === selectedLake) : null

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10 p-16 border border-primary/30 backdrop-blur-sm">
              <div className="absolute -right-40 -top-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
              <div className="relative z-10 max-w-3xl">
                <Badge className="mb-6 inline-flex gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40">
                  <Zap className="w-3 h-3" />
                  Live Climate Data
                </Badge>
                <h1 className="text-7xl font-black mb-6 leading-tight">
                  Glacial Lake
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Evolution Tracker
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                  Visualize and analyze the historical and predicted evolution of glacial lakes across the world's major mountain ranges using advanced AI and satellite imagery.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold">
                    Start Exploring <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                    Watch Stories
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Lakes Tracked', value: '500+', desc: 'Hi-MAG Dataset', icon: '🗺️' },
                { label: 'Time Period', value: '2008-2023', desc: '15 years of data', icon: '📊' },
                { label: 'Avg Growth', value: '+12.4%', desc: 'Annual expansion', icon: '📈', highlight: true },
                { label: 'At Risk', value: '47', desc: 'High growth zones', icon: '⚠️' },
              ].map((stat) => (
                <Card key={stat.label} className={cn('backdrop-blur-sm border-primary/20', stat.highlight && 'border-destructive/50 bg-destructive/5')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'regions':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Explore Regions</h2>
              <p className="text-lg text-muted-foreground">Choose a mountain region to explore glacial lake data</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regions.map((region) => (
                <div key={region.id} className="group cursor-pointer rounded-2xl overflow-hidden border border-primary/20 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-400/20">
                  <div className="relative h-56 overflow-hidden">
                    <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-3">
                      <Badge className="text-xs bg-blue-500/90 hover:bg-blue-600">DATASET: 2008-2026</Badge>
                      <Badge variant="secondary" className={cn('text-xs font-semibold', region.statusColor, region.status === 'HIGH GROWTH' && 'bg-destructive/90 text-white')}>
                        {region.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 space-y-4 bg-gradient-to-b from-card/50 to-card/30">
                    <div>
                      <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{region.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{region.desc}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{region.details}</p>
                    <Separator className="bg-primary/10" />
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium">
                        <MapPin className="w-4 h-4" />
                        {region.lakes} Lakes
                      </div>
                      <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10">
                        Select Region <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Analytics</h2>
              <p className="text-lg text-muted-foreground">Climate data trends and lake evolution metrics</p>
            </div>

            {/* Main Area Evolution Chart */}
            <Card className="backdrop-blur-sm border-primary/20 bg-card/50">
              <CardHeader>
                <CardTitle className="text-cyan-400">Lake Area Evolution</CardTitle>
                <CardDescription>Historical data and AI predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={areaEvolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                    <XAxis dataKey="year" stroke="rgb(148, 163, 184)" />
                    <YAxis stroke="rgb(148, 163, 184)" />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 212, 255, 0.3)' }} />
                    <Area type="monotone" dataKey="area" stroke="#00d4ff" fillOpacity={1} fill="url(#colorArea)" name="Historical" />
                    <Area type="monotone" dataKey="predicted" stroke="#ef4444" strokeDasharray="5 5" fillOpacity={0} name="Predicted" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Temperature & Precipitation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm border-primary/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-400">Temperature</CardTitle>
                  <CardDescription>Monthly average °C — +1.2°C increase</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                      <XAxis dataKey="month" stroke="rgb(148, 163, 184)" />
                      <YAxis stroke="rgb(148, 163, 184)" />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(239, 68, 68, 0.5)' }} />
                      <Line type="monotone" dataKey="temp" stroke="#ef4444" dot={false} strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm border-primary/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-400">Precipitation</CardTitle>
                  <CardDescription>Monthly average mm — +15% change</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={precipitationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                      <XAxis dataKey="month" stroke="rgb(148, 163, 184)" />
                      <YAxis stroke="rgb(148, 163, 184)" />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 212, 255, 0.3)' }} />
                      <Bar dataKey="precip" fill="#00d4ff" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { metric: 'Avg. Expansion Rate', value: '3.2%', trend: '+0.4%', color: 'text-cyan-400' },
                { metric: 'Ice Volume Lost', value: '45km³', trend: '-12%', color: 'text-red-400' },
                { metric: 'New Lakes Formed', value: '23', trend: '+5', color: 'text-green-400' },
                { metric: 'At-Risk Communities', value: '156', trend: '+12', color: 'text-orange-400' },
              ].map((item) => (
                <Card key={item.metric} className="backdrop-blur-sm border-primary/20 bg-card/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-muted-foreground">{item.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={cn('text-3xl font-bold', item.color)}>{item.value}</div>
                    <p className="text-xs text-muted-foreground mt-2">{item.trend} trend</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'stories':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Story Mode</h2>
              <p className="text-lg text-muted-foreground">Immersive visual narratives of glacial evolution</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Glacier Retreat and Lake Expansion', desc: 'Witness the dramatic transformation of the Imja Glacier over the last two decades.', tag: 'SCIENTIFIC VISUALIZATION' },
                { title: 'The Andes Glacial Timeline', desc: 'Explore how South American glaciers have retreated over 30 years.', tag: 'HISTORICAL ANALYSIS' },
              ].map((story) => (
                <div key={story.title} className="group cursor-pointer rounded-2xl overflow-hidden border border-primary/20 hover:border-cyan-400/50 transition-all duration-300 h-72 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-400/20">
                  <div className="relative w-full h-full">
                    <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="text-xs bg-cyan-500/90 hover:bg-cyan-600">{story.tag}</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                      <h3 className="text-xl font-bold text-cyan-300">{story.title}</h3>
                      <p className="text-sm text-muted-foreground">{story.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'map':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Map Viewer</h2>
              <p className="text-lg text-muted-foreground">Interactive satellite map with real-time glacial lake data</p>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-primary/20 backdrop-blur-sm">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=600&fit=crop" alt="Map" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-cyan-300 mb-3">Interactive Map Viewer</h3>
                <p className="text-muted-foreground max-w-xl">Explore glacial lakes with satellite imagery and real-time data overlay. Click on markers to view detailed analytics.</p>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">Settings</h2>
              <p className="text-lg text-muted-foreground">Configure your dashboard preferences</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Data Sources', desc: 'Configure satellite imagery and climate data providers' },
                { title: 'Notifications', desc: 'Set up alerts for high-risk lake activity' },
                { title: 'Display Preferences', desc: 'Customize map layers and visualization options' },
                { title: 'Export & Sharing', desc: 'Download reports and share findings' },
              ].map((item) => (
                <Card key={item.title} className="backdrop-blur-sm border-primary/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10 transition-all cursor-pointer bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-primary/20 bg-gradient-to-b from-background/80 to-background backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-400/20">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">GlacialMelt</h1>
              <p className="text-xs text-cyan-400/70">Analysis Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-400/10'
                    : 'text-muted-foreground hover:text-cyan-300 hover:bg-cyan-500/10'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary/20 bg-gradient-to-t from-cyan-500/10 to-transparent">
          <p className="text-xs text-muted-foreground mb-2">Version</p>
          <p className="text-sm font-mono text-cyan-400">v1.0.0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {renderContent()}
        </div>
      </div>

      {/* Lake Detail Sheet */}
      {selectedLakeData && (
        <Sheet open={!!selectedLake} onOpenChange={(open) => !open && setSelectedLake(null)}>
          <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto border-l border-primary/20 bg-gradient-to-b from-card/90 to-background">
            <SheetHeader>
              <SheetTitle className="text-cyan-400">{selectedLakeData.name}</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <img src={selectedLakeData.image} alt={selectedLakeData.name} className="w-full h-48 object-cover rounded-lg border border-primary/20" />
              <div>
                <p className="text-xs text-cyan-400/70 font-semibold mb-1 uppercase tracking-wider">Location</p>
                <p className="font-medium text-foreground">{selectedLakeData.location}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400/70 font-semibold mb-1 uppercase tracking-wider">Elevation</p>
                <p className="font-medium text-foreground">{selectedLakeData.elevation}</p>
              </div>
              <Separator className="bg-primary/10" />
              <div>
                <p className="text-xs text-cyan-400/70 font-semibold mb-2 uppercase tracking-wider">Risk Level</p>
                <Badge className={cn('font-semibold', selectedLakeData.riskLevel === 'HIGH' ? 'bg-destructive/90 text-white' : 'bg-yellow-500/90 text-white')}>
                  {selectedLakeData.riskLevel}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-cyan-400/70 font-semibold mb-2 uppercase tracking-wider">Current Area</p>
                <p className="text-3xl font-bold text-cyan-300">{selectedLakeData.area}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400/70 font-semibold mb-2 uppercase tracking-wider">Growth Rate</p>
                <p className="text-2xl font-bold text-orange-400">{selectedLakeData.growth}</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
