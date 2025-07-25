"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"

export function ZoomControls() {
  const { canvas, zoomLevel, setZoomLevel } = useSeatMapStore()

  const zoomIn = () => {
    if (!canvas) return
    const newZoom = Math.min(zoomLevel * 1.2, 5)
    canvas.setZoom(newZoom)
    setZoomLevel(newZoom)
    canvas.renderAll()
  }

  const zoomOut = () => {
    if (!canvas) return
    const newZoom = Math.max(zoomLevel / 1.2, 0.1)
    canvas.setZoom(newZoom)
    setZoomLevel(newZoom)
    canvas.renderAll()
  }

  const resetZoom = () => {
    if (!canvas) return
    canvas.setZoom(1)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    setZoomLevel(1)
    canvas.renderAll()
  }

  const fitToScreen = () => {
    if (!canvas) return

    const objects = canvas.getObjects().filter((obj) => !(obj as any).isGrid)
    if (objects.length === 0) return

    // Calculate bounding box of all objects
    let minX = Number.POSITIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY

    objects.forEach((obj) => {
      const bounds = obj.getBoundingRect()
      minX = Math.min(minX, bounds.left)
      minY = Math.min(minY, bounds.top)
      maxX = Math.max(maxX, bounds.left + bounds.width)
      maxY = Math.max(maxY, bounds.top + bounds.height)
    })

    const objectWidth = maxX - minX
    const objectHeight = maxY - minY
    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()

    // Calculate zoom to fit with padding
    const padding = 50
    const zoomX = (canvasWidth - padding * 2) / objectWidth
    const zoomY = (canvasHeight - padding * 2) / objectHeight
    const zoom = Math.min(zoomX, zoomY, 2) // Max zoom of 2x

    // Center the view
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    const canvasCenterX = canvasWidth / 2
    const canvasCenterY = canvasHeight / 2

    canvas.setZoom(zoom)
    canvas.setViewportTransform([zoom, 0, 0, zoom, canvasCenterX - centerX * zoom, canvasCenterY - centerY * zoom])

    setZoomLevel(zoom)
    canvas.renderAll()
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2">
        <div className="flex flex-col space-y-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn} disabled={zoomLevel >= 5}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <div className="text-xs text-center font-mono py-1 min-w-[3rem]">{Math.round(zoomLevel * 100)}%</div>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut} disabled={zoomLevel <= 0.1}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fitToScreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
