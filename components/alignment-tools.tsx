"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalDistributeEndIcon as DistributeHorizontal,
  AlignVerticalDistributeEndIcon as DistributeVertical,
  Move,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { useSeatMapStore } from "@/lib/store"

export function AlignmentTools() {
  const { canvas, selectedCount, selectedObjects, addToHistory } = useSeatMapStore()

  const alignObjects = (alignment: string) => {
    if (!canvas || selectedCount < 2) return

    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length < 2) return

    const first = activeObjects[0]
    const firstBounds = first.getBoundingRect()

    activeObjects.slice(1).forEach((obj) => {
      const objBounds = obj.getBoundingRect()

      switch (alignment) {
        case "left":
          obj.set({ left: first.left })
          break
        case "horizontal-center":
          const centerX = first.left! + (firstBounds.width - objBounds.width) / 2
          obj.set({ left: centerX })
          break
        case "right":
          const rightX = first.left! + firstBounds.width - objBounds.width
          obj.set({ left: rightX })
          break
        case "top":
          obj.set({ top: first.top })
          break
        case "vertical-center":
          const centerY = first.top! + (firstBounds.height - objBounds.height) / 2
          obj.set({ top: centerY })
          break
        case "bottom":
          const bottomY = first.top! + firstBounds.height - objBounds.height
          obj.set({ top: bottomY })
          break
      }

      obj.setCoords()
    })

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const distributeObjects = (direction: "horizontal" | "vertical") => {
    if (!canvas || selectedCount < 3) return

    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length < 3) return

    // Sort objects by position
    const sortedObjects = [...activeObjects].sort((a, b) => {
      if (direction === "horizontal") {
        return a.left! - b.left!
      } else {
        return a.top! - b.top!
      }
    })

    const first = sortedObjects[0]
    const last = sortedObjects[sortedObjects.length - 1]

    if (direction === "horizontal") {
      const totalWidth = last.left! - first.left!
      const spacing = totalWidth / (sortedObjects.length - 1)

      sortedObjects.forEach((obj, index) => {
        if (index > 0 && index < sortedObjects.length - 1) {
          obj.set({ left: first.left! + spacing * index })
          obj.setCoords()
        }
      })
    } else {
      const totalHeight = last.top! - first.top!
      const spacing = totalHeight / (sortedObjects.length - 1)

      sortedObjects.forEach((obj, index) => {
        if (index > 0 && index < sortedObjects.length - 1) {
          obj.set({ top: first.top! + spacing * index })
          obj.setCoords()
        }
      })
    }

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const centerOnCanvas = (direction: "horizontal" | "vertical" | "both") => {
    if (!canvas || selectedCount === 0) return

    const activeObjects = canvas.getActiveObjects()
    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()

    activeObjects.forEach((obj) => {
      const objBounds = obj.getBoundingRect()

      if (direction === "horizontal" || direction === "both") {
        const centerX = (canvasWidth - objBounds.width) / 2
        obj.set({ left: centerX })
      }

      if (direction === "vertical" || direction === "both") {
        const centerY = (canvasHeight - objBounds.height) / 2
        obj.set({ top: centerY })
      }

      obj.setCoords()
    })

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const changeLayerOrder = (direction: "front" | "back" | "forward" | "backward") => {
    if (!canvas || selectedCount === 0) return

    const activeObjects = canvas.getActiveObjects()

    activeObjects.forEach((obj) => {
      switch (direction) {
        case "front":
          canvas.bringToFront(obj)
          break
        case "back":
          canvas.sendToBack(obj)
          break
        case "forward":
          canvas.bringForward(obj)
          break
        case "backward":
          canvas.sendBackwards(obj)
          break
      }
    })

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-200">Alignment & Distribution</CardTitle>
        <p className="text-xs text-gray-400">
          {selectedCount === 0
            ? "Select objects to align"
            : selectedCount === 1
              ? "Select 2+ objects to align"
              : `${selectedCount} objects selected`}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Horizontal Alignment */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-300">Horizontal Alignment</h4>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("left")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("horizontal-center")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("right")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Vertical Alignment */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-300">Vertical Alignment</h4>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("top")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Align Top"
            >
              <AlignVerticalJustifyStart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("vertical-center")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Align Middle"
            >
              <AlignVerticalJustifyCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("bottom")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Align Bottom"
            >
              <AlignVerticalJustifyEnd className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Distribution */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-300">Distribution</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => distributeObjects("horizontal")}
              disabled={selectedCount < 3}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              title="Distribute Horizontally"
            >
              <DistributeHorizontal className="h-4 w-4 mr-1" />
              <span className="text-xs">H-Dist</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => distributeObjects("vertical")}
              disabled={selectedCount < 3}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              title="Distribute Vertically"
            >
              <DistributeVertical className="h-4 w-4 mr-1" />
              <span className="text-xs">V-Dist</span>
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Canvas Centering */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-300">Center on Canvas</h4>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => centerOnCanvas("horizontal")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Center Horizontally"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => centerOnCanvas("both")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Center Both"
            >
              <Move className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => centerOnCanvas("vertical")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent p-2"
              title="Center Vertically"
            >
              <AlignVerticalJustifyCenter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Layer Order */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-300">Layer Order</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("front")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              title="Bring to Front"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-xs">Front</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("back")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              title="Send to Back"
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              <span className="text-xs">Back</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("forward")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              title="Bring Forward"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              <span className="text-xs">Forward</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("backward")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              title="Send Backward"
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              <span className="text-xs">Backward</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
