"use client"

import { useState } from "react"
import {
  X,
  TrendingUp,
  Mountain,
  AlertTriangle,
  Ruler,
  Waves,
  Calendar,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Focus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface LakeDetailPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function LakeDetailPanel({ isOpen, onClose }: LakeDetailPanelProps) {
  const [activeYear, setActiveYear] = useState(2022)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<"historical" | "predicted">("historical")

  const years = [2008, 2013, 2017, 2022, 2030, 2050]

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-border">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop"
                alt="Imja Tsho"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Imja Tsho</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-chart-2/20 text-chart-2 border border-chart-2/30">
                  HIGH GROWTH RISK
                </span>
                <span className="text-sm text-muted-foreground">Nepal</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <StatBox
          icon={Ruler}
          label="SURFACE AREA"
          value="1.28 km²"
          subtext="+0.05% YoY"
          subtextColor="text-chart-3"
          iconColor="text-primary"
        />
        <StatBox
          icon={Mountain}
          label="ELEVATION"
          value="5,010m"
          subtext="Above sea level"
          iconColor="text-muted-foreground"
        />
        <StatBox
          icon={TrendingUp}
          label="GROWTH %"
          value="+12.4%"
          subtext="Past decade"
          subtextColor="text-chart-3"
          iconColor="text-chart-3"
        />
        <StatBox
          icon={AlertTriangle}
          label="PREDICTED (2050)"
          value="1.85 km²"
          subtext="+44.5% total"
          subtextColor="text-chart-2"
          iconColor="text-chart-2"
        />
      </div>

      {/* Chart Section */}
      <div className="px-6 pb-6">
        <div className="p-5 rounded-2xl bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Lake Area Change</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">HISTORICAL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="text-muted-foreground">PREDICTED</span>
              </div>
            </div>
          </div>

          {/* Simplified Chart Visualization */}
          <div className="h-32 flex items-end gap-1">
            {[40, 45, 52, 58, 65, 72, 78, 85, 90, 95, 100].map((height, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t transition-all duration-300 hover:opacity-80",
                  i < 7 ? "bg-primary/60" : "bg-chart-2/60"
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>2008</span>
            <span>2026</span>
            <span>2050</span>
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="px-6 pb-6 space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("historical")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              activeTab === "historical"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            Historical
          </button>
          <button
            onClick={() => setActiveTab("predicted")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              activeTab === "predicted"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            Predicted
          </button>
        </div>

        {/* Year Pills */}
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                activeYear === year
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <Slider
            value={[activeYear]}
            min={2008}
            max={2050}
            step={1}
            onValueChange={(value) => setActiveYear(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2008</span>
            <span className="text-primary font-medium">{activeYear}</span>
            <span>2050</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">PLAY TIMELINE</p>
      </div>

      {/* Focus Button */}
      <div className="p-6 border-t border-border">
        <Button className="w-full py-6 rounded-xl bg-chart-2 hover:bg-chart-2/90 text-white font-semibold">
          <Focus className="w-5 h-5 mr-2" />
          Focus on Lake
        </Button>
      </div>
    </div>
  )
}

function StatBox({
  icon: Icon,
  label,
  value,
  subtext,
  subtextColor,
  iconColor = "text-primary",
}: {
  icon: React.ElementType
  label: string
  value: string
  subtext: string
  subtextColor?: string
  iconColor?: string
}) {
  return (
    <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", iconColor)} />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className={cn("text-sm", subtextColor || "text-muted-foreground")}>
        {subtext}
      </p>
    </div>
  )
}
