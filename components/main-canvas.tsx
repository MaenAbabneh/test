"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut, Maximize } from "lucide-react"

interface CanvasState {
  zoom: number
  panX: number
  panY: number
}

export function MainCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 })

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()

      if (!canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.min(Math.max(canvasState.zoom * zoomFactor, 0.1), 5)

      // Zoom towards mouse position
      const zoomRatio = newZoom / canvasState.zoom
      const newPanX = mouseX - (mouseX - canvasState.panX) * zoomRatio
      const newPanY = mouseY - (mouseY - canvasState.panY) * zoomRatio

      setCanvasState({
        zoom: newZoom,
        panX: newPanX,
        panY: newPanY,
      })
    },
    [canvasState],
  )

  // Handle mouse down for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== canvasRef.current) return

      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setLastPan({ x: canvasState.panX, y: canvasState.panY })
    },
    [canvasState.panX, canvasState.panY],
  )

  // Handle mouse move for panning
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      setCanvasState((prev) => ({
        ...prev,
        panX: lastPan.x + deltaX,
        panY: lastPan.y + deltaY,
      }))
    },
    [isDragging, dragStart, lastPan],
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Add wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false })
      return () => canvas.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel])

  // Reset canvas view
  const resetView = () => {
    setCanvasState({ zoom: 1, panX: 0, panY: 0 })
  }

  // Zoom functions
  const zoomIn = () => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 5),
    }))
  }

  const zoomOut = () => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.1),
    }))
  }

  const fitToScreen = () => {
    // Implementation would calculate optimal zoom and pan to fit all content
    setCanvasState({ zoom: 0.8, panX: 0, panY: 0 })
  }

  // Generate sample seats
  const generateSeats = () => {
    const seats = []
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (let seatIndex = 1; seatIndex <= 12; seatIndex++) {
        const x = 200 + seatIndex * 35
        const y = 200 + rowIndex * 40
        const seatId = `${rows[rowIndex]}${seatIndex}`

        seats.push(
          <Tooltip key={seatId}>
            <TooltipTrigger asChild>
              <div
                className="absolute w-6 h-6 bg-blue-500 rounded border border-blue-400 cursor-pointer hover:bg-blue-400 hover:scale-110 transition-all duration-200"
                style={{
                  left: x,
                  top: y,
                }}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Seat: {seatId}</p>
              <p>Category: VIP</p>
              <p>Price: $150</p>
            </TooltipContent>
          </Tooltip>,
        )
      }
    }

    return seats
  }

  const gridSize = 20 * canvasState.zoom
  const gridOffsetX = canvasState.panX % gridSize
  const gridOffsetY = canvasState.panY % gridSize

  return (
    <main className="flex-1 bg-gray-900 relative overflow-hidden">
      {/* Tooltip Provider */}
      <TooltipProvider>
        {/* Canvas Container */}
        <div
          ref={canvasRef}
          className={`w-full h-full relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(75, 85, 99, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(75, 85, 99, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundPosition: `${gridOffsetX}px ${gridOffsetY}px`,
          }}
        >
          {/* Canvas Content */}
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
            }}
          >
            {/* Stage */}
            <div
              className="absolute bg-gradient-to-b from-purple-600 to-purple-800 rounded-lg shadow-lg cursor-move hover:shadow-xl transition-shadow duration-200 flex items-center justify-center"
              style={{
                left: 250,
                top: 50,
                width: 300,
                height: 80,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="text-white font-semibold text-lg">STAGE</span>
            </div>

            {/* Sample Seats */}
            {generateSeats()}
          </div>
        </div>

        {/* Canvas Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetView}
                className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={fitToScreen}
                className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-300">
            <div>Zoom: {Math.round(canvasState.zoom * 100)}%</div>
            <div>Grid: {Math.round(gridSize)}px</div>
          </div>

          <div className="text-xs text-gray-500">
            <div>Mouse wheel: Zoom</div>
            <div>Click + drag: Pan</div>
          </div>
        </div>

        {/* Zoom Display */}
        <div className="absolute top-4 right-4 bg-gray-800 rounded px-3 py-1 text-sm text-gray-300">
          {Math.round(canvasState.zoom * 100)}%
        </div>
      </TooltipProvider>
    </main>
  )
}
