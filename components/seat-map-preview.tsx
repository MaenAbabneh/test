"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { fabric } from "fabric"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"

export function SeatMapPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { canvasState, seatCategories, zoom, setZoom } = useSeatMapStore()

  const [previewCanvas, setPreviewCanvas] = useState<fabric.Canvas | null>(null)
  const [isCanvasReady, setIsCanvasReady] = useState(false)

  // Initialize preview canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const initCanvas = () => {
      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
          width: 800,
          height: 500,
          backgroundColor: "#ffffff",
          selection: false, // Disable selection in preview
          interactive: false, // Make it read-only
        })

        // Disable all interactions
        fabricCanvas.forEachObject((obj) => {
          obj.selectable = false
          obj.evented = false
        })

        setPreviewCanvas(fabricCanvas)
        setIsCanvasReady(true)

        return fabricCanvas
      } catch (error) {
        console.error("Failed to initialize preview canvas:", error)
        return null
      }
    }

    // Use timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const fabricCanvas = initCanvas()

      return () => {
        if (fabricCanvas) {
          try {
            fabricCanvas.dispose()
          } catch (error) {
            console.warn("Error disposing preview canvas:", error)
          }
        }
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  // Load canvas state when it changes
  useEffect(() => {
    if (!previewCanvas || !canvasState || !isCanvasReady) return

    try {
      previewCanvas.loadFromJSON(canvasState, () => {
        // Disable interactions for all loaded objects
        previewCanvas.forEachObject((obj) => {
          obj.selectable = false
          obj.evented = false
        })
        previewCanvas.renderAll()
      })
    } catch (error) {
      console.warn("Error loading canvas state in preview:", error)
    }
  }, [previewCanvas, canvasState, isCanvasReady])

  // Zoom functions for preview
  const zoomIn = () => {
    if (!previewCanvas || !isCanvasReady) return
    try {
      const newZoom = Math.min(zoom * 1.2, 3)
      previewCanvas.setZoom(newZoom)
      setZoom(newZoom)
      previewCanvas.renderAll()
    } catch (error) {
      console.warn("Error zooming in preview:", error)
    }
  }

  const zoomOut = () => {
    if (!previewCanvas || !isCanvasReady) return
    try {
      const newZoom = Math.max(zoom / 1.2, 0.3)
      previewCanvas.setZoom(newZoom)
      setZoom(newZoom)
      previewCanvas.renderAll()
    } catch (error) {
      console.warn("Error zooming out preview:", error)
    }
  }

  const resetZoom = () => {
    if (!previewCanvas || !isCanvasReady) return
    try {
      previewCanvas.setZoom(1)
      previewCanvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      setZoom(1)
      previewCanvas.renderAll()
    } catch (error) {
      console.warn("Error resetting zoom in preview:", error)
    }
  }

  // Calculate seat statistics
  const seatStats = useMemo(() => {
    if (!canvasState) return { total: 0, available: 0, occupied: 0 }

    try {
      const canvasData = JSON.parse(canvasState)
      const seats = canvasData.objects?.filter((obj: any) => obj.seatData) || []

      return {
        total: seats.length,
        available: seats.filter((seat: any) => seat.seatData?.isAvailable !== false).length,
        occupied: seats.filter((seat: any) => seat.seatData?.isAvailable === false).length,
      }
    } catch {
      return { total: 0, available: 0, occupied: 0 }
    }
  }, [canvasState])

  const categorySeatsMap = useMemo(() => {
    if (!canvasState) return seatCategories.map(() => 0)
    try {
      const canvasData = JSON.parse(canvasState)
      const seats = canvasData.objects?.filter((obj: any) => obj.seatData) || []
      return seatCategories.map(
        (category) => seats.filter((seat: any) => seat.seatData?.categoryId === category.id).length,
      )
    } catch {
      return seatCategories.map(() => 0)
    }
  }, [canvasState, seatCategories])

  return (
    <div className="h-screen flex bg-background">
      {/* Main Preview Area - 75% */}
      <div className="flex-1 w-3/4 flex flex-col">
        {/* Header */}
        <div className="h-14 bg-card border-b border-border flex items-center px-4">
          <h1 className="text-lg font-semibold">Seat Map Preview</h1>
          <div className="ml-auto text-sm text-muted-foreground">Real-time preview • Updates automatically</div>
        </div>

        {/* Canvas Container */}
        <div ref={containerRef} className="flex-1 bg-muted/20 p-4 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-lg">
              <canvas ref={canvasRef} className="rounded-lg" />

              {/* Zoom Controls */}
              <Card className="absolute bottom-4 right-4">
                <CardContent className="p-2">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={zoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="icon" onClick={zoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={resetZoom}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - 25% */}
      <div className="w-1/4 min-w-[300px] bg-card border-l border-border p-4 space-y-4">
        {/* Seat Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seat Legend & Prices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {seatCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <span className="text-sm font-semibold text-primary">${category.price}</span>
              </div>
            ))}

            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-muted-foreground rounded-full flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Seats:</span>
              <span className="font-medium">{seatStats.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available:</span>
              <span className="font-medium text-green-600">{seatStats.available}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Occupied:</span>
              <span className="font-medium text-red-600">{seatStats.occupied}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="text-muted-foreground">Occupancy Rate:</span>
              <span className="font-medium">
                {seatStats.total > 0 ? Math.round((seatStats.occupied / seatStats.total) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Potential</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {seatCategories.map((category, index) => (
              <div key={category.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {category.name} ({categorySeatsMap[index]} seats):
                </span>
                <span className="font-medium">${(categorySeatsMap[index] * category.price).toLocaleString()}</span>
              </div>
            ))}

            <div className="flex justify-between text-sm pt-2 border-t border-border font-semibold">
              <span>Total Potential:</span>
              <span className="text-primary">
                ${useMemo(() => {
                  if (!canvasState) return 0
                  try {
                    const canvasData = JSON.parse(canvasState)
                    const seats = canvasData.objects?.filter((obj: any) => obj.seatData) || []
                    return seats
                      .reduce((total: number, seat: any) => {
                        return total + (seat.seatData?.price || 0)
                      }, 0)
                      .toLocaleString()
                  } catch {
                    return 0
                  }
                }, [canvasState])}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
