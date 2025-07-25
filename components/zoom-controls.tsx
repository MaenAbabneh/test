"use client"

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  zoomLevel?: number
}

export function ZoomControls({ onZoomIn, onZoomOut, zoomLevel = 100 }: ZoomControlsProps) {
  return (
    <Card className="absolute bottom-4 right-4 shadow-lg">
      <CardContent className="p-2">
        <div className="flex flex-col space-y-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomIn}
            className="h-8 w-8 bg-transparent"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-xs text-center text-muted-foreground px-1">{zoomLevel}%</div>
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomOut}
            className="h-8 w-8 bg-transparent"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
