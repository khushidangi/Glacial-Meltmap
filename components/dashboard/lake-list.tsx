"use client"

import { useState } from "react"
import { Search, Mountain, Waves, ChevronRight, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface Lake {
  id: string
  name: string
  region: string
  elevation: string
  area: string
  riskLevel: "high" | "moderate" | "low"
  growth: string
  imageUrl: string
}

const lakes: Lake[] = [
  {
    id: "1",
    name: "Imja Tsho",
    region: "Khumbu, Nepal",
    elevation: "5,010m",
    area: "1.28 km²",
    riskLevel: "high",
    growth: "+12.4%",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Tsho Rolpa",
    region: "Rolwaling, Nepal",
    elevation: "4,580m",
    area: "1.54 km²",
    riskLevel: "moderate",
    growth: "+8.2%",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Laguna Palcacocha",
    region: "Cordillera Blanca, Peru",
    elevation: "4,566m",
    area: "0.52 km²",
    riskLevel: "high",
    growth: "+15.7%",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Grinnell Lake",
    region: "Montana, USA",
    elevation: "1,553m",
    area: "0.24 km²",
    riskLevel: "low",
    growth: "+3.1%",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  },
]

const riskStyles = {
  high: {
    badge: "bg-chart-2/20 text-chart-2",
    icon: "text-chart-2",
  },
  moderate: {
    badge: "bg-chart-4/20 text-chart-4",
    icon: "text-chart-4",
  },
  low: {
    badge: "bg-chart-3/20 text-chart-3",
    icon: "text-chart-3",
  },
}

const filterTabs = ["All Lakes", "High Risk", "Recently Updated"]

interface LakeListProps {
  onSelectLake: (lakeId: string) => void
}

export function LakeList({ onSelectLake }: LakeListProps) {
  const [activeFilter, setActiveFilter] = useState("All Lakes")
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredLake, setHoveredLake] = useState<string | null>(null)

  const filteredLakes = lakes.filter((lake) => {
    const matchesSearch =
      lake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lake.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      activeFilter === "All Lakes" ||
      (activeFilter === "High Risk" && lake.riskLevel === "high")
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Select Lake</h2>
        <p className="text-muted-foreground mt-1">
          Browse and analyze individual glacial lakes
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search lakes or regions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 py-6 rounded-xl bg-muted border-border focus:border-primary"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeFilter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground border border-border"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Lake Cards */}
      <div className="space-y-4">
        {filteredLakes.map((lake) => {
          const risk = riskStyles[lake.riskLevel]
          const isHovered = hoveredLake === lake.id

          return (
            <button
              key={lake.id}
              onClick={() => onSelectLake(lake.id)}
              onMouseEnter={() => setHoveredLake(lake.id)}
              onMouseLeave={() => setHoveredLake(null)}
              className="w-full group relative flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 text-left"
            >
              {/* Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img
                  src={lake.imageUrl}
                  alt={lake.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    isHovered && "scale-110"
                  )}
                  crossOrigin="anonymous"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {lake.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{lake.region}</p>
                  </div>
                  <span className={cn("px-2 py-1 rounded text-xs font-bold", risk.badge)}>
                    {lake.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mountain className="w-4 h-4" />
                    <span>{lake.elevation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Waves className="w-4 h-4" />
                    <span>{lake.area}</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5 text-sm font-medium", risk.icon)}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>{lake.growth}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-all duration-300",
                  isHovered && "translate-x-1 text-primary"
                )}
              />

              {/* Hover glow */}
              {isHovered && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 0% 50%, oklch(0.75 0.15 195 / 0.08), transparent 50%)",
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
