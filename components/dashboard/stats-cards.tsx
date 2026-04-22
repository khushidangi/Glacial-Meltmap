"use client"

import { TrendingUp, Waves, Calendar, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  subtext: string
  trend?: {
    value: string
    positive: boolean
  }
  accent?: "cyan" | "orange" | "green"
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  accent = "cyan",
}: StatCardProps) {
  const accentStyles = {
    cyan: "text-primary bg-primary/10 border-primary/20",
    orange: "text-chart-2 bg-chart-2/10 border-chart-2/20",
    green: "text-chart-3 bg-chart-3/10 border-chart-3/20",
  }

  return (
    <div className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          <div className="flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  trend.positive ? "text-chart-3" : "text-chart-2"
                )}
              >
                <TrendingUp
                  className={cn("w-3 h-3", !trend.positive && "rotate-180")}
                />
                {trend.value}
              </span>
            )}
            <span className="text-sm text-muted-foreground">{subtext}</span>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl border",
            accentStyles[accent]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Waves}
        label="Lakes Tracked"
        value="500+"
        subtext="Across all regions"
        trend={{ value: "+12", positive: true }}
        accent="cyan"
      />
      <StatCard
        icon={Calendar}
        label="Years of Data"
        value="10+"
        subtext="Historical records"
        accent="green"
      />
      <StatCard
        icon={AlertTriangle}
        label="High Risk"
        value="47"
        subtext="Lakes require attention"
        trend={{ value: "+5", positive: false }}
        accent="orange"
      />
      <StatCard
        icon={TrendingUp}
        label="Average Growth"
        value="12.4%"
        subtext="Past decade"
        trend={{ value: "+2.1%", positive: true }}
        accent="cyan"
      />
    </div>
  )
}
