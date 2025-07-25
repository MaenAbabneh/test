"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { fabric } from "fabric"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Eye, EyeOff } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"

export function SeatMapPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { canvasState, seatCategories } = useSeatMapStore()

  const [previewCanvas, setPreviewCanvas] = useState<fabric.Canvas | null>(null)
  const [isCanvasReady, setIsCanvasReady] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showPrices, setShowPrices] = useState(true)

  // Initialize preview canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const initCanvas = () => {
      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
          width: 1000,
          height: 700,
          backgroundColor: "#f8fafc",
          selection: false,
          interactive: false,
        })

        // Disable all interactions for preview
        fabricCanvas.forEachObject((obj) => {
          obj.selectable = false
          obj.evented = false
        })

        // Enable mouse wheel zoom
        fabricCanvas.on("mouse:wheel", (opt) => {
          const delta = opt.e.deltaY
          let newZoom = fabricCanvas.getZoom()
          newZoom *= 0.999 ** delta
          if (newZoom > 3) newZoom = 3
          if (newZoom < 0.3) newZoom = 0.3
          fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, newZoom)
          setZoom(newZoom)
          opt.e.preventDefault()
          opt.e.stopPropagation()
        })

        // Enable panning
        let isDragging = false
        let lastPosX = 0
        let lastPosY = 0

        fabricCanvas.on("mouse:down", (opt) => {
          const evt = opt.e
          isDragging = true
          fabricCanvas.selection = false
          lastPosX = evt.clientX
          lastPosY = evt.clientY
        })

        fabricCanvas.on("mouse:move", (opt) => {
          if (isDragging) {
            const e = opt.e
            const vpt = fabricCanvas.viewportTransform!
            vpt[4] += e.clientX - lastPosX
            vpt[5] += e.clientY - lastPosY
            fabricCanvas.requestRenderAll()
            lastPosX = e.clientX
            lastPosY = e.clientY
          }
        })

        fabricCanvas.on("mouse:up", () => {
          fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform!)
          isDragging = false
          fabricCanvas.selection = false
        })

        setPreviewCanvas(fabricCanvas)
        setIsCanvasReady(true)

        return fabricCanvas
      } catch (error) {
        console.error("Failed to initialize preview canvas:", error)
        return null
      }
    }

    const timeoutId = setTimeout(() => {
      initCanvas()
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

  const fitToScreen = () => {
    if (!previewCanvas || !isCanvasReady) return
    try {
      const objects = previewCanvas.getObjects().filter((obj) => !(obj as any).isGrid)
      if (objects.length === 0) return

      // Calculate bounding box
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
      const canvasWidth = previewCanvas.getWidth()
      const canvasHeight = previewCanvas.getHeight()

      const padding = 50
      const zoomX = (canvasWidth - padding * 2) / objectWidth
      const zoomY = (canvasHeight - padding * 2) / objectHeight
      const newZoom = Math.min(zoomX, zoomY, 2)

      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2
      const canvasCenterX = canvasWidth / 2
      const canvasCenterY = canvasHeight / 2

      previewCanvas.setZoom(newZoom)
      previewCanvas.setViewportTransform([
        newZoom,
        0,
        0,
        newZoom,
        canvasCenterX - centerX * newZoom,
        canvasCenterY - centerY * newZoom,
      ])

      setZoom(newZoom)
      previewCanvas.renderAll()
    } catch (error) {
      console.warn("Error fitting to screen:", error)
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

  const totalRevenue = useMemo(() => {
    if (!canvasState) return 0
    try {
      const canvasData = JSON.parse(canvasState)
      const seats = canvasData.objects?.filter((obj: any) => obj.seatData) || []
      return seats.reduce((total: number, seat: any) => {
        return total + (seat.seatData?.price || 0)
      }, 0)
    } catch {
      return 0
    }
  }, [canvasState])

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Container */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden">
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200">
              <canvas ref={canvasRef} className="rounded-xl" />

              {/* Zoom Controls - Top Right */}
              <Card className="absolute top-4 right-4 shadow-lg">
                <CardContent className="p-2">
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-50" onClick={zoomIn}>
                      <ZoomIn className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-50" onClick={zoomOut}>
                      <ZoomOut className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-50" onClick={resetZoom}>
                      <RotateCcw className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-50" onClick={fitToScreen}>
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Zoom Level Indicator */}
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-mono">
                {Math.round(zoom * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar - Pricing Panel */}
      <Card className="w-80 m-4 shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Hide Prices Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant={showPrices ? "default" : "outline"}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={() => setShowPrices(!showPrices)}
            >
              {showPrices ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPrices ? "Hide Prices" : "Show Prices"}
            </Button>
          </div>

          {/* Seat Categories with Prices */}
          {showPrices && (
            <div className="space-y-3">
              {seatCategories.map((category, index) => (
                <div key={category.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-800">{category.name}:</span>
                  </div>
                  <span className="font-bold text-gray-900">{categorySeatsMap[index]} JOD</span>
                </div>
              ))}
            </div>
          )}

          {/* Statistics */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-gray-800">Statistics</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Seats:</span>
                <span className="font-medium">{seatStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-green-600">{seatStats.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupied:</span>
                <span className="font-medium text-red-600">{seatStats.occupied}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Occupancy Rate:</span>
                <span className="font-medium">
                  {seatStats.total > 0 ? Math.round((seatStats.occupied / seatStats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Information */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-gray-800">Revenue Potential</h3>

            <div className="space-y-2 text-sm">
              {seatCategories.map((category, index) => (
                <div key={category.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {category.name} ({categorySeatsMap[index]} seats):
                  </span>
                  <span className="font-medium">${(categorySeatsMap[index] * category.price).toLocaleString()}</span>
                </div>
              ))}

              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total Potential:</span>
                <span className="text-green-600">${totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-gray-800">Legend</h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full bg-white" />
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <span className="text-gray-600">Occupied</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
