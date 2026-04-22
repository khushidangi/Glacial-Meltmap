"use client"

import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onExplore: () => void
  onWatchStories: () => void
}

export function HeroSection({ onExplore, onWatchStories }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow Effects */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "oklch(0.75 0.15 195 / 0.1)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl"
        style={{ background: "oklch(0.7 0.18 50 / 0.08)" }}
      />

      <div className="relative px-8 py-12 md:px-12 md:py-16">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Live Climate Data
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Glacial Lake
            <br />
            <span className="text-primary">Evolution Tracker</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
            Visualize and analyze the historical and predicted evolution of glacial
            lakes across the world&apos;s major mountain ranges using advanced AI and
            satellite imagery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              onClick={onExplore}
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              onClick={onWatchStories}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-xl border-border hover:bg-muted group"
            >
              <Play className="w-5 h-5 mr-2 text-primary" />
              Watch Stories
            </Button>
          </div>
        </div>

        {/* Decorative Mountain SVG */}
        <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none hidden lg:block">
          <svg
            viewBox="0 0 400 300"
            className="absolute right-0 bottom-0 w-full h-full opacity-20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 300L100 150L150 200L250 80L350 180L400 100V300H0Z"
              fill="url(#mountainGradient)"
            />
            <defs>
              <linearGradient
                id="mountainGradient"
                x1="200"
                y1="80"
                x2="200"
                y2="300"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="oklch(0.75 0.15 195 / 0.4)" />
                <stop offset="1" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
