"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSeatMapStore } from "@/lib/store"

export function StatusBar() {
  const { selectedObjects, layers, zoomLevel, activeTool, canvas } = useSeatMapStore()

  const getCanvasSize = () => {
    if (!canvas) return { width: 0, height: 0 }
    return {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
    }
  }

  const canvasSize = getCanvasSize()

  return (
    <div className="h-8 bg-gray-50 border-t border-gray-200 px-4 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span>Tool:</span>
          <Badge variant="secondary" className="text-xs capitalize">
            {activeTool}
          </Badge>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div>
          Objects: <span className="font-medium">{layers.length}</span>
        </div>

        {selectedObjects.length > 0 && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div>
              Selected: <span className="font-medium">{selectedObjects.length}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div>
          Canvas:{" "}
          <span className="font-medium">
            {canvasSize.width} × {canvasSize.height}
          </span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div>
          Zoom: <span className="font-medium">{Math.round(zoomLevel * 100)}%</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div className="text-gray-500">Hold Alt + Drag to pan • Mouse wheel to zoom</div>
      </div>
    </div>
  )
}
