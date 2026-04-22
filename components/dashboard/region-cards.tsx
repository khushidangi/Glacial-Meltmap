"use client"

import { useState } from "react"
import { Mountain, ChevronRight, Waves, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface Region {
  id: string
  name: string
  subtitle: string
  description: string
  lakeCount: string
  dataYears: string
  riskLevel: "high" | "moderate" | "low"
  imageUrl: string
}

const regions: Region[] = [
  {
    id: "himalayas",
    name: "Himalayas",
    subtitle: "Hindu Kush Karakoram Region",
    description: "The largest concentration of glacial lakes. Rapid expansion observed.",
    lakeCount: "500+",
    dataYears: "2008-2026",
    riskLevel: "high",
    imageUrl: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=600&h=400&fit=crop",
  },
  {
    id: "andes",
    name: "Andes",
    subtitle: "South American Range",
    description: "Significant glacial retreat with steady lake growth.",
    lakeCount: "300+",
    dataYears: "2010-2026",
    riskLevel: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
  },
  {
    id: "alps",
    name: "Alps",
    subtitle: "European Alpine Region",
    description: "Well-monitored region with established baseline data.",
    lakeCount: "150+",
    dataYears: "2005-2026",
    riskLevel: "low",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
  },
]

const riskStyles = {
  high: {
    badge: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    label: "HIGH GROWTH",
  },
  moderate: {
    badge: "bg-chart-4/20 text-chart-4 border-chart-4/30",
    label: "MODERATE",
  },
  low: {
    badge: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    label: "STABLE",
  },
}

interface RegionCardsProps {
  onSelectRegion?: (regionId: string) => void
}

export function RegionCards({ onSelectRegion }: RegionCardsProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Explore Regions</h2>
          <p className="text-muted-foreground mt-1">
            Choose a mountain region to explore glacial lake data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => {
          const isHovered = hoveredRegion === region.id
          const risk = riskStyles[region.riskLevel]

          return (
            <button
              key={region.id}
              onClick={() => onSelectRegion?.(region.id)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-500 text-left"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={region.imageUrl}
                  alt={region.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-700",
                    isHovered && "scale-110"
                  )}
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                {/* Risk Badge */}
                <div
                  className={cn(
                    "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm",
                    risk.badge
                  )}
                >
                  {risk.label}
                </div>

                {/* Dataset Years */}
                <div className="absolute top-4 left-4 text-xs font-mono text-primary/80 bg-card/60 backdrop-blur-sm px-2 py-1 rounded">
                  DATASET: {region.dataYears}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {region.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{region.subtitle}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {region.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold">{region.lakeCount}</span> Lakes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-chart-2" />
                    <span className="text-sm text-muted-foreground">
                      View Map
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div
                  className={cn(
                    "flex items-center gap-2 pt-4 text-primary font-medium transition-all duration-300",
                    isHovered ? "translate-x-2" : ""
                  )}
                >
                  <span>Select Region</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Hover glow */}
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none transition-opacity duration-500",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, oklch(0.75 0.15 195 / 0.1), transparent 70%)",
                }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
