"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MousePointer2,
  Circle,
  Square,
  Type,
  Layers,
  RotateCcw,
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
  Grid3X3,
  Palette,
} from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import { createSeat, createStage, createText, createCurvedRow } from "@/lib/fabric-utils"
import type { fabric } from "fabric"

export function ToolbarPanel() {
  const {
    activeTool,
    setActiveTool,
    canvas,
    selectedObjects,
    duplicateSelectedObjects,
    deleteSelectedObjects,
    groupSelectedObjects,
    ungroupSelectedObjects,
    alignObjects,
    showGrid,
    setShowGrid,
    showLayersPanel,
    setShowLayersPanel,
    setShowCategoriesModal,
    seatCategories,
  } = useSeatMapStore()

  const handleToolClick = (tool: string) => {
    setActiveTool(tool as any)

    if (!canvas) return

    // Reset canvas cursor and selection mode
    canvas.defaultCursor = "default"
    canvas.hoverCursor = "move"
    canvas.selection = tool === "select"

    // Handle tool-specific setup
    switch (tool) {
      case "select":
        canvas.isDrawingMode = false
        break
      case "seat":
        canvas.isDrawingMode = false
        canvas.defaultCursor = "crosshair"
        break
      case "stage":
        canvas.isDrawingMode = false
        canvas.defaultCursor = "crosshair"
        break
      case "text":
        canvas.isDrawingMode = false
        canvas.defaultCursor = "text"
        break
      case "curved-row":
        canvas.isDrawingMode = false
        canvas.defaultCursor = "crosshair"
        break
    }
  }

  const handleCanvasClick = (e: fabric.IEvent) => {
    if (!canvas || activeTool === "select") return

    const pointer = canvas.getPointer(e.e)
    const defaultCategory = seatCategories[0]

    switch (activeTool) {
      case "seat":
        const seat = createSeat(pointer.x, pointer.y, defaultCategory)
        canvas.add(seat)
        break
      case "stage":
        const stage = createStage(pointer.x, pointer.y)
        canvas.add(stage)
        break
      case "text":
        const text = createText(pointer.x, pointer.y, "Text")
        canvas.add(text)
        break
      case "curved-row":
        const curvedRow = createCurvedRow(pointer.x, pointer.y, 100, 0, Math.PI, 8, defaultCategory)
        canvas.add(curvedRow)
        break
    }

    canvas.renderAll()
  }

  // Set up canvas click handler
  React.useEffect(() => {
    if (!canvas) return

    canvas.on("mouse:down", handleCanvasClick)
    return () => canvas.off("mouse:down", handleCanvasClick)
  }, [canvas, activeTool, seatCategories])

  const tools = [
    { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
    { id: "seat", icon: Circle, label: "Add Seat", shortcut: "S" },
    { id: "stage", icon: Square, label: "Add Stage", shortcut: "T" },
    { id: "text", icon: Type, label: "Add Text", shortcut: "X" },
    { id: "curved-row", icon: RotateCcw, label: "Curved Row", shortcut: "C" },
  ]

  const alignmentTools = [
    { id: "left", icon: AlignLeft, label: "Align Left" },
    { id: "center", icon: AlignCenter, label: "Align Center" },
    { id: "right", icon: AlignRight, label: "Align Right" },
    { id: "top", icon: AlignTop, label: "Align Top" },
    { id: "middle", icon: AlignMiddle, label: "Align Middle" },
    { id: "bottom", icon: AlignBottom, label: "Align Bottom" },
  ]

  return (
    <TooltipProvider>
      <div className="w-16 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
        {/* Tools */}
        <div className="space-y-1">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === tool.id ? "default" : "ghost"}
                    size="icon"
                    className={`w-12 h-12 ${
                      activeTool === tool.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => handleToolClick(tool.id)}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {tool.label} ({tool.shortcut})
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <Separator className="w-8 bg-gray-700" />

        {/* Object Operations */}
        <div className="space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={duplicateSelectedObjects}
                disabled={selectedObjects.length === 0}
              >
                <Copy className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Duplicate (Ctrl+D)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={deleteSelectedObjects}
                disabled={selectedObjects.length === 0}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Delete (Del)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={groupSelectedObjects}
                disabled={selectedObjects.length < 2}
              >
                <Group className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Group (Ctrl+G)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={ungroupSelectedObjects}
                disabled={selectedObjects.length !== 1 || selectedObjects[0]?.type !== "group"}
              >
                <Ungroup className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Ungroup (Ctrl+U)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="w-8 bg-gray-700" />

        {/* Alignment Tools */}
        <div className="grid grid-cols-2 gap-1">
          {alignmentTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-5 h-5 text-gray-400 hover:text-white hover:bg-gray-800"
                    onClick={() => alignObjects(tool.id as any)}
                    disabled={selectedObjects.length < 2}
                  >
                    <Icon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <Separator className="w-8 bg-gray-700" />

        {/* View Controls */}
        <div className="space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? "default" : "ghost"}
                size="icon"
                className={`w-12 h-12 ${
                  showGrid ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Grid (G)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showLayersPanel ? "default" : "ghost"}
                size="icon"
                className={`w-12 h-12 ${
                  showLayersPanel ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setShowLayersPanel(!showLayersPanel)}
              >
                <Layers className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Layers</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => setShowCategoriesModal(true)}
              >
                <Palette className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Seat Categories</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Active Tool Indicator */}
        {activeTool !== "select" && (
          <div className="mt-auto">
            <Badge variant="secondary" className="text-xs">
              {tools.find((t) => t.id === activeTool)?.label}
            </Badge>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
