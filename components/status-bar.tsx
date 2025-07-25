"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSeatMapStore } from "@/lib/store"

export function StatusBar() {
  const { canvas, zoom, selectedCount, snapToGrid, gridSize } = useSeatMapStore()

  const getObjectCounts = () => {
    if (!canvas) return { total: 0, seats: 0, stages: 0, doors: 0, text: 0 }

    const objects = canvas.getObjects().filter((obj) => !(obj as any).isGrid)
    const counts = {
      total: objects.length,
      seats: 0,
      stages: 0,
      doors: 0,
      text: 0,
    }

    objects.forEach((obj: any) => {
      switch (obj.objectType || obj.type) {
        case "seat":
          counts.seats++
          break
        case "stage":
          counts.stages++
          break
        case "door":
          counts.doors++
          break
        case "text":
          counts.text++
          break
      }
    })

    return counts
  }

  const counts = getObjectCounts()

  return (
    <footer className="bg-gray-800 border-t border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        {/* Left Section - Object Counts */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Objects:</span>
            <Badge variant="outline" className="border-gray-500 text-gray-300">
              {counts.total}
            </Badge>
          </div>

          {counts.seats > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Seats:</span>
                <Badge variant="outline" className="border-blue-500 text-blue-300">
                  {counts.seats}
                </Badge>
              </div>
            </>
          )}

          {counts.stages > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Stages:</span>
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  {counts.stages}
                </Badge>
              </div>
            </>
          )}

          {counts.doors > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Doors:</span>
                <Badge variant="outline" className="border-red-500 text-red-300">
                  {counts.doors}
                </Badge>
              </div>
            </>
          )}

          {selectedCount > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Selected:</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-300">
                  {selectedCount}
                </Badge>
              </div>
            </>
          )}
        </div>

        {/* Right Section - Canvas Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Zoom:</span>
            <span className="text-gray-300">{Math.round(zoom * 100)}%</span>
          </div>

          <Separator orientation="vertical" className="h-4 bg-gray-600" />

          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Grid:</span>
            <Badge
              variant={snapToGrid ? "default" : "outline"}
              className={snapToGrid ? "bg-green-600 text-white" : "border-gray-500 text-gray-400"}
            >
              {snapToGrid ? `${gridSize}px` : "Off"}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-4 bg-gray-600" />

          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Canvas:</span>
            <span className="text-gray-300">
              {canvas ? `${canvas.getWidth()} × ${canvas.getHeight()}` : "Not loaded"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
