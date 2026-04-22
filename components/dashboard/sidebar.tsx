"use client"

import { useState } from "react"
import {
  Home,
  Globe,
  Map,
  BarChart3,
  BookOpen,
  Settings,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: React.ElementType
  label: string
  id: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Globe, label: "Explore Regions", id: "regions" },
  { icon: Map, label: "Map Viewer", id: "map" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: BookOpen, label: "Story Mode", id: "stories" },
  { icon: Settings, label: "Settings", id: "settings" },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-card border border-border lg:hidden"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "lg:w-20" : "lg:w-64",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
            <Mountain className="w-5 h-5 text-primary" />
            <div className="absolute inset-0 rounded-xl bg-primary/5 blur-sm" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                GlacialMelt
              </h1>
              <p className="text-xs text-muted-foreground">Analysis Platform</p>
            </div>
          )}
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              {(!collapsed || mobileOpen) && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {isActive && (!collapsed || mobileOpen) && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Version & Collapse */}
      <div className="p-4 border-t border-sidebar-border">
        {(!collapsed || mobileOpen) && (
          <div className="mb-4 px-4">
            <p className="text-xs text-muted-foreground">Version</p>
            <p className="text-sm font-mono text-foreground">v1.0.0</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
    </>
  )
}
