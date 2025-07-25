"use client"

import { useEffect, useRef, useCallback, type RefObject } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import { createSeat, createStage, createText, createCurvedRow, snapToGrid } from "@/lib/fabric-utils"
import type { fabric } from "fabric"

interface CanvasAreaProps {
  canvasRef: RefObject<HTMLCanvasElement>
}

export function CanvasArea({ canvasRef }: CanvasAreaProps) {
  const {
    canvas,
    activeTool,
    seatCategories,
    showGrid,
    snapToGrid: snapEnabled,
    setSnapToGrid,
    gridSize,
    zoomLevel,
    setZoomLevel,
    addToHistory,
    isDrawing,
    setIsDrawing,
  } = useSeatMapStore()

  const containerRef = useRef<HTMLDivElement>(null)

  // Handle canvas interactions based on active tool
  useEffect(() => {
    if (!canvas) return

    const handleMouseDown = (e: fabric.IEvent) => {
      if (activeTool === "select") return

      const pointer = canvas.getPointer(e.e)
      let x = pointer.x
      let y = pointer.y

      // Snap to grid if enabled
      if (snapEnabled) {
        x = snapToGrid(x, gridSize)
        y = snapToGrid(y, gridSize)
      }

      let newObject: fabric.Object | null = null

      try {
        switch (activeTool) {
          case "seat":
            const category = seatCategories[0] // Use first category as default
            if (category) {
              newObject = createSeat(x, y, category)
            }
            break
          case "stage":
            newObject = createStage(x, y)
            break
          case "text":
            newObject = createText(x, y, "New Text")
            break
          case "curved-row":
            const rowCategory = seatCategories[0]
            if (rowCategory) {
              newObject = createCurvedRow(x, y, 100, 0, Math.PI, 8, rowCategory)
            }
            break
        }

        if (newObject) {
          canvas.add(newObject)
          canvas.setActiveObject(newObject)
          canvas.renderAll()

          // Add to history after a short delay to ensure the object is fully added
          setTimeout(() => {
            addToHistory(JSON.stringify(canvas.toJSON()))
          }, 50)
        }
      } catch (error) {
        console.warn("Error creating object:", error)
      }
    }

    canvas.on("mouse:down", handleMouseDown)

    return () => {
      canvas.off("mouse:down", handleMouseDown)
    }
  }, [canvas, activeTool, seatCategories, snapEnabled, gridSize, addToHistory])

  // Handle grid rendering
  useEffect(() => {
    if (!canvas) return

    const drawGrid = () => {
      if (!showGrid) return

      const ctx = canvas.getContext()
      if (!ctx) return

      const canvasWidth = canvas.width || 0
      const canvasHeight = canvas.height || 0
      const zoom = canvas.getZoom()

      ctx.save()
      ctx.strokeStyle = "#E5E7EB"
      ctx.lineWidth = 1 / zoom
      ctx.globalAlpha = 0.5

      // Draw vertical lines
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasHeight)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvasHeight; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasWidth, y)
        ctx.stroke()
      }

      ctx.restore()
    }

    // Remove existing grid event listener
    canvas.off("after:render", drawGrid)

    if (showGrid) {
      canvas.on("after:render", drawGrid)
    }

    // Trigger initial render
    canvas.requestRenderAll()

    return () => {
      canvas.off("after:render", drawGrid)
    }
  }, [canvas, showGrid, gridSize])

  // Zoom functions
  const zoomIn = useCallback(() => {
    if (!canvas) return
    const newZoom = Math.min(zoomLevel * 1.2, 5)
    canvas.setZoom(newZoom)
    setZoomLevel(newZoom)
    canvas.renderAll()
  }, [canvas, zoomLevel, setZoomLevel])

  const zoomOut = useCallback(() => {
    if (!canvas) return
    const newZoom = Math.max(zoomLevel / 1.2, 0.1)
    canvas.setZoom(newZoom)
    setZoomLevel(newZoom)
    canvas.renderAll()
  }, [canvas, zoomLevel, setZoomLevel])

  const resetZoom = useCallback(() => {
    if (!canvas) return
    canvas.setZoom(1)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    setZoomLevel(1)
    canvas.renderAll()
  }, [canvas, setZoomLevel])

  return (
    <>
      {/* Top Toolbar */}
      <div className="h-14 bg-card border-b border-border flex items-center px-4 space-x-4">
        <h1 className="text-lg font-semibold">Seat Map Editor Pro</h1>

        {(activeTool === "seat" || activeTool === "curved-row") && seatCategories.length > 0 && (
          <div className="flex items-center space-x-2">
            <Label>Category:</Label>
            <Select value={seatCategories[0].id} disabled>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seatCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-2">
          <Label>Snap to Grid:</Label>
          <Switch checked={snapEnabled} onCheckedChange={setSnapToGrid} />
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <Move className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Hold Alt + Drag to pan</span>
        </div>
      </div>

      {/* Canvas Container */}
      <div ref={containerRef} className="flex-1 bg-muted/20 p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg">
            <canvas
              ref={canvasRef}
              className="rounded-lg"
              style={{ cursor: activeTool === "select" ? "default" : "crosshair" }}
            />

            {/* Zoom Controls */}
            <Card className="absolute bottom-4 right-4">
              <CardContent className="p-2">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-mono w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <Button variant="ghost" size="icon" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={resetZoom}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tool Instructions */}
            {activeTool !== "select" && (
              <Card className="absolute top-4 left-4 max-w-xs">
                <CardContent className="p-3">
                  <div className="text-sm">
                    {activeTool === "seat" && "Click to place a seat"}
                    {activeTool === "stage" && "Click to place a stage"}
                    {activeTool === "text" && "Click to add text"}
                    {activeTool === "curved-row" && "Click to create a curved row of seats"}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
