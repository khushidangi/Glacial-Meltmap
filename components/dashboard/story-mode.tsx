"use client"

import { useState } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface Story {
  id: string
  title: string
  subtitle: string
  description: string
  location: string
  totalSteps: number
  imageUrl: string
}

const stories: Story[] = [
  {
    id: "1",
    title: "Glacier Retreat and Lake Expansion",
    subtitle: "Scientific Visualization",
    description:
      "Witness the dramatic transformation of the Imja Glacier over the last two decades and the rapid formation of its terminal lake.",
    location: "IMJA GLACIER, NEPAL (27° N)",
    totalSteps: 8,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "The Andes Glacial Timeline",
    subtitle: "Historical Analysis",
    description:
      "Explore how South American glaciers have retreated over 30 years, creating new lakes and changing local ecosystems.",
    location: "CORDILLERA BLANCA, PERU",
    totalSteps: 6,
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
  },
]

export function StoryMode() {
  const [activeStory, setActiveStory] = useState(stories[0])
  const [currentStep, setCurrentStep] = useState(3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceNarration, setVoiceNarration] = useState(true)
  const [cameraOrbit, setCameraOrbit] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Story Mode</h2>
        <p className="text-muted-foreground mt-1">
          Immersive visual narratives of glacial evolution
        </p>
      </div>

      {/* Story Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className={cn(
              "group relative rounded-2xl overflow-hidden text-left transition-all duration-300",
              activeStory.id === story.id
                ? "ring-2 ring-primary"
                : "hover:ring-1 hover:ring-border"
            )}
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

              {/* Info Badge */}
              <button className="absolute top-4 right-4 p-2 rounded-full bg-card/60 backdrop-blur-sm border border-border hover:bg-card transition-colors">
                <Info className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {story.subtitle}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground leading-tight">
                {story.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {story.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Active Story Player */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">CHAPTER PROGRESS</span>
            <span className="text-foreground font-medium">
              Step <span className="text-primary">{currentStep}</span> of {activeStory.totalSteps}
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / activeStory.totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground font-mono">{activeStory.location}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 py-4">
          <Button variant="ghost" size="icon" className="rounded-full w-12 h-12">
            <SkipBack className="w-5 h-5" />
          </Button>
          <div className="text-xs text-muted-foreground">PREVIOUS</div>

          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </Button>

          <div className="text-xs text-muted-foreground">NEXT SCENE</div>
          <Button variant="ghost" size="icon" className="rounded-full w-12 h-12">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-center text-sm text-primary font-medium">PLAY SCENE</p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Voice Narration</span>
            </div>
            <Switch checked={voiceNarration} onCheckedChange={setVoiceNarration} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">360° Camera Orbit</span>
            </div>
            <Switch checked={cameraOrbit} onCheckedChange={setCameraOrbit} />
          </div>
        </div>
      </div>
    </div>
  )
}
