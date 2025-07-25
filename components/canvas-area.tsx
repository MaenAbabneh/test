"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useSeatMapStore } from "@/lib/store"
import { addGrid } from "@/lib/fabric-utils"
import { StatusBar } from "./status-bar"
import { ZoomControls } from "./zoom-controls"

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function CanvasArea({ canvasRef }: CanvasAreaProps) {
  const { canvas, showGrid, gridSize, zoomLevel } = useSeatMapStore()
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle grid visibility
  useEffect(() => {
    if (!canvas) return

    if (showGrid) {
      addGrid(canvas, gridSize)
    } else {
      // Remove grid lines
      const objects = canvas.getObjects()
      objects.forEach((obj) => {
        if ((obj as any).isGrid) {
          canvas.remove(obj)
        }
      })
    }
    canvas.renderAll()
  }, [canvas, showGrid, gridSize])

  // Handle canvas resize
  useEffect(() => {
    if (!canvas || !containerRef.current) return

    const resizeCanvas = () => {
      const container = containerRef.current!
      const rect = container.getBoundingClientRect()

      canvas.setDimensions({
        width: rect.width - 32, // Account for padding
        height: rect.height - 32,
      })
      canvas.renderAll()
    }

    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(containerRef.current)

    // Initial resize
    resizeCanvas()

    return () => {
      resizeObserver.disconnect()
    }
  }, [canvas])

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Container */}
      <div ref={containerRef} className="flex-1 relative p-4 overflow-hidden">
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 relative">
          <canvas ref={canvasRef} className="absolute inset-0 rounded-lg" style={{ cursor: "default" }} />

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4">
            <ZoomControls />
          </div>

          {/* Canvas Info Overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-200">
            Zoom: {Math.round(zoomLevel * 100)}% | Hold Alt + Drag to pan
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}
