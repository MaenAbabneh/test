"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MousePointer2, Square, Circle, Shapes, Grid, Copy, Trash2, Group, Ungroup, Plus } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import type { Tool, SeatType } from "@/lib/store"
import { createSeat } from "@/lib/fabric-utils"
import { fabric } from "fabric"

const tools: Array<{ id: Tool; label: string; icon: React.ReactNode; description: string }> = [
  {
    id: "select",
    label: "Select",
    icon: <MousePointer2 className="h-4 w-4" />,
    description: "Select and move objects",
  },
  {
    id: "draw-seats",
    label: "Draw Seats",
    icon: <Square className="h-4 w-4" />,
    description: "Click to place seats",
  },
  {
    id: "draw-polygon",
    label: "Draw Area",
    icon: <Circle className="h-4 w-4" />,
    description: "Draw custom areas",
  },
  {
    id: "add-objects",
    label: "Add Objects",
    icon: <Shapes className="h-4 w-4" />,
    description: "Add stages, doors, etc.",
  },
]

const seatTypes: Array<{ id: SeatType; label: string; color: string; price: number }> = [
  { id: "standard", label: "Standard", color: "#3b82f6", price: 50 },
  { id: "vip", label: "VIP", color: "#f59e0b", price: 150 },
  { id: "wheelchair", label: "Wheelchair", color: "#10b981", price: 50 },
  { id: "premium", label: "Premium", color: "#8b5cf6", price: 100 },
]

export function LeftSidebar() {
  const {
    activeTool,
    setActiveTool,
    currentSeatType,
    setCurrentSeatType,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    setGridSize,
    selectedCount,
    canvas,
    selectedObjects,
    addToHistory,
  } = useSeatMapStore()

  // Bulk row generation state
  const [bulkRowSettings, setBulkRowSettings] = useState({
    numRows: 5,
    seatsPerRow: 10,
    rowSpacing: 40,
    seatSpacing: 35,
    startingRow: "A",
    seatType: "standard" as SeatType,
    startX: 300,
    startY: 200,
  })

  const generateBulkRows = () => {
    if (!canvas) return

    const { numRows, seatsPerRow, rowSpacing, seatSpacing, startingRow, seatType, startX, startY } = bulkRowSettings

    const newObjects: fabric.Object[] = []

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      // Generate row letter (A, B, C, etc.)
      const rowLetter = String.fromCharCode(startingRow.charCodeAt(0) + rowIndex)

      for (let seatIndex = 1; seatIndex <= seatsPerRow; seatIndex++) {
        const seatLabel = `${rowLetter}${seatIndex}`
        const x = startX + (seatIndex - 1) * seatSpacing
        const y = startY + rowIndex * rowSpacing

        const seat = createSeat(x, y, seatType, seatLabel)
        newObjects.push(seat)
        canvas.add(seat)
      }
    }

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))

    // Show success message
    console.log(`Generated ${numRows} rows with ${seatsPerRow} seats each (${numRows * seatsPerRow} total seats)`)
  }

  const groupSelectedObjects = () => {
    if (!canvas || selectedCount < 2) return

    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length < 2) return

    // Create a new group from selected objects
    const group = new fabric.Group(activeObjects, {
      canvas: canvas,
    })

    // Remove individual objects and add the group
    activeObjects.forEach((obj) => canvas.remove(obj))
    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.renderAll()

    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const ungroupSelectedObjects = () => {
    if (!canvas || selectedCount !== 1) return

    const activeObject = canvas.getActiveObject()
    if (!activeObject || activeObject.type !== "group") return

    const group = activeObject as fabric.Group
    const objects = group.getObjects()

    // Remove the group
    canvas.remove(group)

    // Add individual objects back
    objects.forEach((obj) => {
      // Reset object coordinates relative to canvas
      const objLeft = group.left! + obj.left!
      const objTop = group.top! + obj.top!
      obj.set({
        left: objLeft,
        top: objTop,
      })
      canvas.add(obj)
    })

    // Select all ungrouped objects
    const selection = new fabric.ActiveSelection(objects, { canvas })
    canvas.setActiveObject(selection)
    canvas.renderAll()

    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const duplicateSelectedObjects = () => {
    if (!canvas || selectedCount === 0) return

    const activeObjects = canvas.getActiveObjects()
    const newObjects: fabric.Object[] = []

    activeObjects.forEach((obj) => {
      obj.clone((cloned: fabric.Object) => {
        cloned.set({
          left: cloned.left! + 20,
          top: cloned.top! + 20,
        })
        canvas.add(cloned)
        newObjects.push(cloned)
      })
    })

    // Select the duplicated objects after a short delay
    setTimeout(() => {
      if (newObjects.length === 1) {
        canvas.setActiveObject(newObjects[0])
      } else if (newObjects.length > 1) {
        const selection = new fabric.ActiveSelection(newObjects, { canvas })
        canvas.setActiveObject(selection)
      }
      canvas.renderAll()
      addToHistory(JSON.stringify(canvas.toJSON()))
    }, 100)
  }

  const deleteSelectedObjects = () => {
    if (!canvas || selectedCount === 0) return

    const activeObjects = canvas.getActiveObjects()
    activeObjects.forEach((obj) => canvas.remove(obj))
    canvas.discardActiveObject()
    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  return (
    <aside className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-1">Tools</h2>
        <p className="text-sm text-gray-400">Design your seat map</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Tool Selection */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-200">Drawing Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  className={`w-full justify-start h-10 ${
                    activeTool === tool.id
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                  onClick={() => setActiveTool(tool.id)}
                >
                  {tool.icon}
                  <span className="ml-2">{tool.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Seat Type Selection */}
          {activeTool === "draw-seats" && (
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-200">Seat Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {seatTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentSeatType === type.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    onClick={() => setCurrentSeatType(type.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: type.color }} />
                      <span className="text-sm text-gray-200">{type.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ${type.price}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Bulk Row Generation */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-200">Bulk Row Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Rows</Label>
                  <Input
                    type="number"
                    min="1"
                    max="26"
                    value={bulkRowSettings.numRows}
                    onChange={(e) =>
                      setBulkRowSettings((prev) => ({
                        ...prev,
                        numRows: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    className="h-8 bg-gray-600 border-gray-500 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Seats/Row</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={bulkRowSettings.seatsPerRow}
                    onChange={(e) =>
                      setBulkRowSettings((prev) => ({
                        ...prev,
                        seatsPerRow: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    className="h-8 bg-gray-600 border-gray-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Row Spacing</Label>
                  <Input
                    type="number"
                    min="20"
                    max="100"
                    value={bulkRowSettings.rowSpacing}
                    onChange={(e) =>
                      setBulkRowSettings((prev) => ({
                        ...prev,
                        rowSpacing: Number.parseInt(e.target.value) || 40,
                      }))
                    }
                    className="h-8 bg-gray-600 border-gray-500 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Seat Spacing</Label>
                  <Input
                    type="number"
                    min="20"
                    max="100"
                    value={bulkRowSettings.seatSpacing}
                    onChange={(e) =>
                      setBulkRowSettings((prev) => ({
                        ...prev,
                        seatSpacing: Number.parseInt(e.target.value) || 35,
                      }))
                    }
                    className="h-8 bg-gray-600 border-gray-500 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Starting Row</Label>
                <Select
                  value={bulkRowSettings.startingRow}
                  onValueChange={(value) => setBulkRowSettings((prev) => ({ ...prev, startingRow: value }))}
                >
                  <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
                      <SelectItem key={letter} value={letter}>
                        Row {letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300">Seat Type</Label>
                <Select
                  value={bulkRowSettings.seatType}
                  onValueChange={(value) => setBulkRowSettings((prev) => ({ ...prev, seatType: value as SeatType }))}
                >
                  <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {seatTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }} />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Start X</Label>
                  <Input
                    type="number"
                    value={bulkRowSettings.startX}
                    onChange={(e) =>
                      setBulkRowSettings((prev) => ({
                        ...prev,
                        startX: Number.parseInt(e.target.value) || 300,
                      }))
                    }
                    className="h-8 bg-gray-600 border-gray-500 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Start Y</Label>
                  <Input
                    type="number"
                    value={bulkRowSettings.startY}
                    onChange={(e) =>
                      setBulkRowSettings((prev) => ({
                        ...prev,
                        startY: Number.parseInt(e.target.value) || 200,
                      }))
                    }
                    className="h-8 bg-gray-600 border-gray-500 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={generateBulkRows}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!canvas}
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate {bulkRowSettings.numRows * bulkRowSettings.seatsPerRow} Seats
              </Button>
            </CardContent>
          </Card>

          {/* Object Actions */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-200">Object Actions</CardTitle>
              <p className="text-xs text-gray-400">
                {selectedCount === 0 ? "No objects selected" : `${selectedCount} object(s) selected`}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={groupSelectedObjects}
                  disabled={selectedCount < 2}
                  className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
                >
                  <Group className="h-4 w-4 mr-1" />
                  Group
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={ungroupSelectedObjects}
                  disabled={selectedCount !== 1 || !selectedObjects[0] || selectedObjects[0].type !== "group"}
                  className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
                >
                  <Ungroup className="h-4 w-4 mr-1" />
                  Ungroup
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={duplicateSelectedObjects}
                disabled={selectedCount === 0}
                className="w-full border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={deleteSelectedObjects}
                disabled={selectedCount === 0}
                className="w-full border-red-500 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardContent>
          </Card>

          {/* Grid Settings */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-200">Grid & Snapping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-300">Snap to Grid</Label>
                <Button
                  variant={snapToGrid ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={
                    snapToGrid
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Grid Size</Label>
                <Select value={gridSize.toString()} onValueChange={(value) => setGridSize(Number.parseInt(value))}>
                  <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="10">10px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                    <SelectItem value="25">25px</SelectItem>
                    <SelectItem value="50">50px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  )
}
