"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useSeatMapStore } from "@/lib/store"

export function StatusBar() {
  const { selectedCount, activeTool, snapToGrid, setSnapToGrid, zoom, canvas } = useSeatMapStore()

  const objectCount = canvas?.getObjects().filter((obj) => !(obj as any).isGrid).length || 0

  return (
    <footer className="h-8 bg-gray-800 border-t border-gray-700 flex items-center px-4 gap-4 text-xs text-gray-400">
      {/* Selection Info */}
      <div className="flex items-center gap-2">
        <span>Selected: {selectedCount}</span>
        <Separator orientation="vertical" className="h-4 bg-gray-600" />
        <span>Objects: {objectCount}</span>
      </div>

      <Separator orientation="vertical" className="h-4 bg-gray-600" />

      {/* Tool Status */}
      <div className="flex items-center gap-2">
        <span>Tool: {activeTool.replace("-", " ")}</span>
      </div>

      <Separator orientation="vertical" className="h-4 bg-gray-600" />

      {/* Snap to Grid Toggle */}
      <div className="flex items-center gap-2">
        <Label htmlFor="snap-toggle" className="text-xs text-gray-400">
          Snap to Grid
        </Label>
        <Switch id="snap-toggle" checked={snapToGrid} onCheckedChange={setSnapToGrid} className="scale-75" />
      </div>

      <Separator orientation="vertical" className="h-4 bg-gray-600" />

      {/* Zoom Level */}
      <div className="flex items-center gap-2">
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Canvas Info */}
      <div className="flex items-center gap-4">
        <span>Canvas: 1200×800</span>
        <span>Grid: 20px</span>
      </div>
    </footer>
  )
}
