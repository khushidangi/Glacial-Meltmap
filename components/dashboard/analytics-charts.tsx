"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Droplets, Thermometer, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

const areaData = [
  { year: "2008", historical: 0.89, predicted: null },
  { year: "2010", historical: 0.95, predicted: null },
  { year: "2012", historical: 1.02, predicted: null },
  { year: "2014", historical: 1.08, predicted: null },
  { year: "2016", historical: 1.15, predicted: null },
  { year: "2018", historical: 1.21, predicted: null },
  { year: "2020", historical: 1.25, predicted: null },
  { year: "2022", historical: 1.28, predicted: null },
  { year: "2026", historical: null, predicted: 1.38 },
  { year: "2030", historical: null, predicted: 1.48 },
  { year: "2040", historical: null, predicted: 1.65 },
  { year: "2050", historical: null, predicted: 1.85 },
]

const temperatureData = [
  { month: "Jan", temp: -12 },
  { month: "Feb", temp: -10 },
  { month: "Mar", temp: -5 },
  { month: "Apr", temp: 2 },
  { month: "May", temp: 8 },
  { month: "Jun", temp: 12 },
  { month: "Jul", temp: 14 },
  { month: "Aug", temp: 13 },
  { month: "Sep", temp: 8 },
  { month: "Oct", temp: 2 },
  { month: "Nov", temp: -5 },
  { month: "Dec", temp: -10 },
]

const precipitationData = [
  { month: "Jan", precip: 45 },
  { month: "Feb", precip: 52 },
  { month: "Mar", precip: 68 },
  { month: "Apr", precip: 85 },
  { month: "May", precip: 120 },
  { month: "Jun", precip: 180 },
  { month: "Jul", precip: 250 },
  { month: "Aug", precip: 230 },
  { month: "Sep", precip: 150 },
  { month: "Oct", precip: 80 },
  { month: "Nov", precip: 55 },
  { month: "Dec", precip: 48 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState<"1Y" | "5Y" | "10Y" | "ALL">("ALL")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground mt-1">
            Climate data trends and lake evolution metrics
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-xl bg-muted">
          {(["1Y", "5Y", "10Y", "ALL"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Lake Area Evolution</h3>
            <p className="text-sm text-muted-foreground">Historical data and AI predictions</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Predicted</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
              <XAxis dataKey="year" stroke="oklch(0.6 0 0)" fontSize={12} />
              <YAxis stroke="oklch(0.6 0 0)" fontSize={12} tickFormatter={(v) => `${v} km²`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="historical"
                stroke="oklch(0.75 0.15 195)"
                strokeWidth={2}
                fill="url(#historicalGradient)"
                name="Historical"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="oklch(0.65 0.2 25)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#predictedGradient)"
                name="Predicted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Thermometer className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Temperature</h3>
                <p className="text-sm text-muted-foreground">Monthly average °C</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-chart-2">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+1.2°C</span>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                <XAxis dataKey="month" stroke="oklch(0.6 0 0)" fontSize={10} />
                <YAxis stroke="oklch(0.6 0 0)" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="oklch(0.65 0.2 25)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.65 0.2 25)", strokeWidth: 0, r: 3 }}
                  name="Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Precipitation Chart */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Precipitation</h3>
                <p className="text-sm text-muted-foreground">Monthly average mm</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-chart-3">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+15%</span>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={precipitationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                <XAxis dataKey="month" stroke="oklch(0.6 0 0)" fontSize={10} />
                <YAxis stroke="oklch(0.6 0 0)" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="precip"
                  fill="oklch(0.75 0.15 195)"
                  radius={[4, 4, 0, 0]}
                  name="Precipitation"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Avg. Expansion Rate" value="3.2%" trend="+0.4%" positive />
        <QuickStat label="Ice Volume Lost" value="45km³" trend="-12%" positive={false} />
        <QuickStat label="New Lakes Formed" value="23" trend="+5" positive />
        <QuickStat label="At-Risk Communities" value="156" trend="+12" positive={false} />
      </div>
    </div>
  )
}

function QuickStat({
  label,
  value,
  trend,
  positive,
}: {
  label: string
  value: string
  trend: string
  positive: boolean
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <span
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            positive ? "text-chart-3" : "text-chart-2"
          )}
        >
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trend}
        </span>
      </div>
    </div>
  )
}
