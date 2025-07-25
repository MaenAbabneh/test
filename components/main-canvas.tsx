"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CanvasState {
  zoom: number
  panX: number
  panY: number
  isDragging: boolean
  dragStart: { x: number; y: number }
}

export function MainCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  })

  const [hoveredSeat, setHoveredSeat] = useState<{ row: string; seat: number; category: string; price: string } | null>(
    null,
  )

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setCanvasState((prev) => {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(5, prev.zoom * zoomFactor))

      // Calculate new pan to zoom towards mouse position
      const zoomRatio = newZoom / prev.zoom
      const newPanX = mouseX - (mouseX - prev.panX) * zoomRatio
      const newPanY = mouseY - (mouseY - prev.panY) * zoomRatio

      return {
        ...prev,
        zoom: newZoom,
        panX: newPanX,
        panY: newPanY,
      }
    })
  }, [])

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setCanvasState((prev) => ({
        ...prev,
        isDragging: true,
        dragStart: { x: e.clientX - prev.panX, y: e.clientY - prev.panY },
      }))
    }
  }, [])

  // Handle mouse move for panning
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (canvasState.isDragging) {
        setCanvasState((prev) => ({
          ...prev,
          panX: e.clientX - prev.dragStart.x,
          panY: e.clientY - prev.dragStart.y,
        }))
      }
    },
    [canvasState.isDragging],
  )

  // Handle mouse up to stop panning
  const handleMouseUp = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      isDragging: false,
    }))
  }, [])

  // Add event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel])

  // Handle global mouse events for panning
  useEffect(() => {
    if (canvasState.isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        setCanvasState((prev) => ({
          ...prev,
          panX: e.clientX - prev.dragStart.x,
          panY: e.clientY - prev.dragStart.y,
        }))
      }

      const handleGlobalMouseUp = () => {
        setCanvasState((prev) => ({
          ...prev,
          isDragging: false,
        }))
      }

      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mouseup", handleGlobalMouseUp)
      }
    }
  }, [canvasState.isDragging])

  const handleSeatHover = (row: string, seat: number) => {
    setHoveredSeat({
      row,
      seat,
      category: "VIP",
      price: "$150",
    })
  }

  const handleSeatLeave = () => {
    setHoveredSeat(null)
  }

  // Reset zoom and pan
  const resetView = () => {
    setCanvasState({
      zoom: 1,
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
    })
  }

  // Zoom to fit
  const zoomToFit = () => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: 0.8,
      panX: 0,
      panY: 0,
    }))
  }

  return (
    <TooltipProvider>
      <main className="flex-1 bg-gray-900 relative overflow-hidden">
        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className={`absolute inset-0 bg-gray-850 ${canvasState.isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ touchAction: "none" }}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * canvasState.zoom}px ${20 * canvasState.zoom}px`,
              backgroundPosition: `${canvasState.panX}px ${canvasState.panY}px`,
            }}
          />

          {/* Main Content Container */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
              transformOrigin: "0 0",
            }}
          >
            <div className="relative">
              {/* Draggable Stage */}
              <div
                className="w-96 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-8 flex items-center justify-center cursor-move hover:shadow-lg transition-shadow select-none"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", "stage")
                }}
                onMouseDown={(e) => e.stopPropagation()} // Prevent canvas panning when dragging stage
              >
                <span className="text-white font-semibold">STAGE</span>
              </div>

              {/* Sample Seat Layout */}
              <div className="space-y-2">
                {Array.from({ length: 8 }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex space-x-2 justify-center">
                    {Array.from({ length: 12 }, (_, seatIndex) => {
                      const row = String.fromCharCode(65 + rowIndex) // A, B, C...
                      const seatNumber = seatIndex + 1
                      const seatId = `${row}${seatNumber}`

                      return (
                        <Tooltip key={seatIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-6 h-6 rounded cursor-pointer transition-all duration-200 border border-gray-500 hover:scale-110 hover:shadow-md select-none ${
                                Math.random() > 0.7
                                  ? "bg-red-500 hover:bg-red-400"
                                  : Math.random() > 0.5
                                    ? "bg-green-500 hover:bg-green-400"
                                    : "bg-gray-600 hover:bg-gray-500"
                              }`}
                              onMouseEnter={() => handleSeatHover(row, seatNumber)}
                              onMouseLeave={handleSeatLeave}
                              onMouseDown={(e) => e.stopPropagation()} // Prevent canvas panning when clicking seats
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 border-gray-600">
                            <div className="text-xs">
                              <div className="font-semibold">Seat: {seatId}</div>
                              <div>Category: VIP</div>
                              <div>Price: $150</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Controls */}
          <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-2 border border-gray-700 space-y-2">
            <button
              onClick={resetView}
              className="block w-full text-xs text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
            >
              Reset View
            </button>
            <button
              onClick={zoomToFit}
              className="block w-full text-xs text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
            >
              Zoom to Fit
            </button>
          </div>

          {/* Canvas Info */}
          <div className="absolute top-4 left-4 bg-gray-800/80 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-300 space-y-1">
              <div>Canvas: 1200 x 800</div>
              <div>Grid: {Math.round(20 * canvasState.zoom)}px</div>
              <div>Zoom: {Math.round(canvasState.zoom * 100)}%</div>
              <div>
                Pan: {Math.round(canvasState.panX)}, {Math.round(canvasState.panY)}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-gray-800/80 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-400 space-y-1">
              <div>🖱️ Mouse wheel: Zoom</div>
              <div>🖱️ Click + drag: Pan</div>
              <div>🎯 Hover seats: Details</div>
            </div>
          </div>
        </div>
      </main>
    </TooltipProvider>
  )
}
