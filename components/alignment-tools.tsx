"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Move,
  ArrowUp,
  ArrowDown,
  RotateCw,
  ShareIcon as Distribute,
} from "lucide-react"
import { useSeatMapStore } from "@/lib/store"

export function AlignmentTools() {
  const { canvas, selectedObjects, selectedCount, addToHistory } = useSeatMapStore()

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

  const rotateObjects = (angle: number) => {
    if (!canvas || selectedCount === 0) return

    const activeObjects = canvas.getActiveObjects()

    activeObjects.forEach((obj) => {
      const currentAngle = obj.angle || 0
      obj.set({ angle: currentAngle + angle })
      obj.setCoords()
    })

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  return (
    <div className="space-y-4">
      {/* Horizontal Alignment */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Horizontal Alignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("left")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("horizontal-center")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("right")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vertical Alignment */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Vertical Alignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("top")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignVerticalJustifyStart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("vertical-center")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignVerticalJustifyCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignObjects("bottom")}
              disabled={selectedCount < 2}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignVerticalJustifyEnd className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Distribution */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => distributeObjects("horizontal")}
              disabled={selectedCount < 3}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <Distribute className="h-4 w-4 mr-1" />
              Horizontal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => distributeObjects("vertical")}
              disabled={selectedCount < 3}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <Distribute className="h-4 w-4 mr-1" />
              Vertical
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Centering */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Center on Canvas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => centerOnCanvas("horizontal")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignCenter className="h-4 w-4 mr-1" />
              Horizontal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => centerOnCanvas("vertical")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <AlignVerticalJustifyCenter className="h-4 w-4 mr-1" />
              Vertical
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => centerOnCanvas("both")}
            disabled={selectedCount === 0}
            className="w-full border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
          >
            <Move className="h-4 w-4 mr-2" />
            Center Both
          </Button>
        </CardContent>
      </Card>

      {/* Layer Order */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Layer Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("front")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              To Front
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("back")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              To Back
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("forward")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLayerOrder("backward")}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              Backward
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rotation */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Rotation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => rotateObjects(-90)}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <RotateCw className="h-4 w-4 mr-1 transform scale-x-[-1]" />
              -90°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => rotateObjects(90)}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              <RotateCw className="h-4 w-4 mr-1" />
              +90°
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => rotateObjects(-45)}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              -45°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => rotateObjects(45)}
              disabled={selectedCount === 0}
              className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
            >
              +45°
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedCount === 0 && (
        <div className="text-center text-gray-500 py-4">
          <p className="text-sm">Select objects to use alignment tools</p>
        </div>
      )}

      {selectedCount === 1 && (
        <div className="text-center text-gray-500 py-4">
          <p className="text-sm">Select 2+ objects for alignment and distribution</p>
        </div>
      )}
    </div>
  )
}
