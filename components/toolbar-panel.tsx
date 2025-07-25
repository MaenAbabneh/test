"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  MousePointer,
  Circle,
  Square,
  Type,
  Grid3X3,
  Save,
  Download,
  Layers,
  Settings,
  Undo,
  Redo,
  Copy,
  Trash2,
  Group,
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignCenterIcon as AlignTop,
  AlignCenterIcon as AlignMiddle,
  AlignCenterIcon as AlignBottom,
  RotateCw,
} from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import { exportCanvasAsImage } from "@/lib/fabric-utils"

export function ToolbarPanel() {
  const {
    activeTool,
    setActiveTool,
    canvas,
    selectedObjects,
    showGrid,
    setShowGrid,
    showLayersPanel,
    setShowLayersPanel,
    setShowCategoriesModal,
    canUndo,
    canRedo,
    undo,
    redo,
    duplicateSelectedObjects,
    deleteSelectedObjects,
    groupSelectedObjects,
    ungroupSelectedObjects,
    alignObjects,
    addToHistory,
  } = useSeatMapStore()

  const handleSave = () => {
    if (canvas) {
      const state = JSON.stringify(canvas.toJSON())
      addToHistory(state)
      // Here you could also save to localStorage or send to server
      console.log("Canvas saved")
    }
  }

  const handleExport = () => {
    if (canvas) {
      const dataURL = exportCanvasAsImage(canvas, "png")
      const link = document.createElement("a")
      link.download = "seat-map.png"
      link.href = dataURL
      link.click()
    }
  }

  const canGroup = selectedObjects.length > 1
  const canUngroup = selectedObjects.length === 1 && selectedObjects[0].type === "group"
  const canAlign = selectedObjects.length > 1

  return (
    <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 space-y-2">
      {/* Selection Tools */}
      <Button
        variant={activeTool === "select" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveTool("select")}
        title="Select Tool (V)"
      >
        <MousePointer className="h-4 w-4" />
      </Button>

      <Separator className="w-8" />

      {/* Drawing Tools */}
      <Button
        variant={activeTool === "seat" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveTool("seat")}
        title="Add Seat (S)"
      >
        <Circle className="h-4 w-4" />
      </Button>

      <Button
        variant={activeTool === "stage" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveTool("stage")}
        title="Add Stage (T)"
      >
        <Square className="h-4 w-4" />
      </Button>

      <Button
        variant={activeTool === "text" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveTool("text")}
        title="Add Text (X)"
      >
        <Type className="h-4 w-4" />
      </Button>

      <Button
        variant={activeTool === "curved-row" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveTool("curved-row")}
        title="Curved Row"
      >
        <RotateCw className="h-4 w-4" />
      </Button>

      <Separator className="w-8" />

      {/* History */}
      <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        <Undo className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
        <Redo className="h-4 w-4" />
      </Button>

      <Separator className="w-8" />

      {/* Object Operations */}
      <Button
        variant="ghost"
        size="icon"
        onClick={duplicateSelectedObjects}
        disabled={selectedObjects.length === 0}
        title="Duplicate (Ctrl+D)"
      >
        <Copy className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={deleteSelectedObjects}
        disabled={selectedObjects.length === 0}
        title="Delete (Del)"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={groupSelectedObjects} disabled={!canGroup} title="Group (Ctrl+G)">
        <Group className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={ungroupSelectedObjects}
        disabled={!canUngroup}
        title="Ungroup (Ctrl+U)"
      >
        <Ungroup className="h-4 w-4" />
      </Button>

      <Separator className="w-8" />

      {/* Alignment Tools */}
      <div className="flex flex-col space-y-1">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignObjects("left")}
            disabled={!canAlign}
            title="Align Left"
            className="w-6 h-6 p-0"
          >
            <AlignLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignObjects("center")}
            disabled={!canAlign}
            title="Align Center"
            className="w-6 h-6 p-0"
          >
            <AlignCenter className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignObjects("right")}
            disabled={!canAlign}
            title="Align Right"
            className="w-6 h-6 p-0"
          >
            <AlignRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignObjects("top")}
            disabled={!canAlign}
            title="Align Top"
            className="w-6 h-6 p-0"
          >
            <AlignTop className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignObjects("middle")}
            disabled={!canAlign}
            title="Align Middle"
            className="w-6 h-6 p-0"
          >
            <AlignMiddle className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignObjects("bottom")}
            disabled={!canAlign}
            title="Align Bottom"
            className="w-6 h-6 p-0"
          >
            <AlignBottom className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Separator className="w-8" />

      {/* View Tools */}
      <Button
        variant={showGrid ? "default" : "ghost"}
        size="icon"
        onClick={() => setShowGrid(!showGrid)}
        title="Toggle Grid (G)"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>

      <Button
        variant={showLayersPanel ? "default" : "ghost"}
        size="icon"
        onClick={() => setShowLayersPanel(!showLayersPanel)}
        title="Toggle Layers Panel"
      >
        <Layers className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => setShowCategoriesModal(true)} title="Seat Categories">
        <Settings className="h-4 w-4" />
      </Button>

      <Separator className="w-8" />

      {/* File Operations */}
      <Button variant="ghost" size="icon" onClick={handleSave} title="Save (Ctrl+S)">
        <Save className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleExport} title="Export as PNG">
        <Download className="h-4 w-4" />
      </Button>

      {/* Selection Count Badge */}
      {selectedObjects.length > 0 && (
        <div className="mt-auto">
          <Badge variant="secondary" className="text-xs">
            {selectedObjects.length}
          </Badge>
        </div>
      )}
    </div>
  )
}
