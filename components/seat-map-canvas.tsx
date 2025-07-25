"use client"

import { useState } from "react"
import { ZoomControls } from "./zoom-controls"

export function SeatMapCanvas() {
  const [zoomLevel, setZoomLevel] = useState(100)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 25))
  }

  return (
    <div className="relative h-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="w-full h-full grid-pattern"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "center center",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        {/* Placeholder content for seat map */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="text-6xl text-muted-foreground/30">🎭</div>
            <div className="text-lg text-muted-foreground">Seat Map Canvas</div>
            <div className="text-sm text-muted-foreground/70">Interactive seat map will be rendered here</div>
          </div>
        </div>

        {/* Sample seats for demonstration */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="text-center mb-4">
            <div className="bg-muted px-4 py-2 rounded text-sm font-medium">STAGE</div>
          </div>

          {/* Sample seat rows */}
          <div className="space-y-3">
            {["A", "B", "C", "D", "E"].map((row, rowIndex) => (
              <div key={row} className="flex items-center space-x-2">
                <div className="w-6 text-xs text-muted-foreground font-medium">{row}</div>
                <div className="flex space-x-1">
                  {Array.from({ length: 12 }, (_, seatIndex) => (
                    <div
                      key={seatIndex}
                      className={`w-6 h-6 rounded-sm border-2 cursor-pointer transition-colors ${
                        Math.random() > 0.7
                          ? "bg-red-500 border-red-600"
                          : Math.random() > 0.5
                            ? "bg-purple-500 border-purple-600"
                            : "border-muted-foreground hover:bg-primary/20"
                      }`}
                      title={`Seat ${row}${seatIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} zoomLevel={zoomLevel} />
    </div>
  )
}
