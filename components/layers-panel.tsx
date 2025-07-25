"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, Square, Circle, Type, DoorOpen, Users, Search } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import { getObjectType } from "@/lib/fabric-utils"
import { fabric } from "fabric"

interface LayerObject {
  id: string
  name: string
  type: string
  visible: boolean
  locked: boolean
  selected: boolean
  object: fabric.Object
}

const getObjectIcon = (type: string) => {
  switch (type) {
    case "seat":
      return <Square className="h-3 w-3" />
    case "stage":
      return <Circle className="h-3 w-3" />
    case "door":
      return <DoorOpen className="h-3 w-3" />
    case "text":
      return <Type className="h-3 w-3" />
    case "group":
      return <Users className="h-3 w-3" />
    default:
      return <Square className="h-3 w-3" />
  }
}

const getObjectName = (obj: fabric.Object): string => {
  const customObj = obj as any
  if (customObj.label) return customObj.label
  if (customObj.text) return customObj.text.substring(0, 20) + (customObj.text.length > 20 ? "..." : "")
  const type = getObjectType(obj)
  return `${type.charAt(0).toUpperCase() + type.slice(1)} ${Date.now().toString().slice(-4)}`
}

export function LayersPanel() {
  const { canvas, selectedObjects, setSelectedObjects, setSelectedCount, addToHistory } = useSeatMapStore()
  const [layers, setLayers] = useState<LayerObject[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Update layers when canvas changes
  useEffect(() => {
    if (!canvas) return

    const updateLayers = () => {
      const objects = canvas.getObjects().filter((obj) => !(obj as any).isGrid)
      const layerObjects: LayerObject[] = objects.map((obj, index) => ({
        id: (obj as any).id || `object-${index}`,
        name: getObjectName(obj),
        type: getObjectType(obj),
        visible: obj.visible !== false,
        locked: !obj.selectable,
        selected: selectedObjects.includes(obj),
        object: obj,
      }))
      setLayers(layerObjects.reverse()) // Reverse to show top objects first
    }

    updateLayers()

    // Listen for canvas changes
    const handleObjectAdded = () => updateLayers()
    const handleObjectRemoved = () => updateLayers()
    const handleSelectionCreated = () => updateLayers()
    const handleSelectionUpdated = () => updateLayers()
    const handleSelectionCleared = () => updateLayers()

    canvas.on("object:added", handleObjectAdded)
    canvas.on("object:removed", handleObjectRemoved)
    canvas.on("selection:created", handleSelectionCreated)
    canvas.on("selection:updated", handleSelectionUpdated)
    canvas.on("selection:cleared", handleSelectionCleared)

    return () => {
      canvas.off("object:added", handleObjectAdded)
      canvas.off("object:removed", handleObjectRemoved)
      canvas.off("selection:created", handleSelectionCreated)
      canvas.off("selection:updated", handleSelectionUpdated)
      canvas.off("selection:cleared", handleSelectionCleared)
    }
  }, [canvas, selectedObjects])

  const selectLayer = (layer: LayerObject, multiSelect = false) => {
    if (!canvas) return

    if (multiSelect) {
      const currentSelection = canvas.getActiveObjects()
      if (currentSelection.includes(layer.object)) {
        // Remove from selection
        const newSelection = currentSelection.filter((obj) => obj !== layer.object)
        if (newSelection.length === 0) {
          canvas.discardActiveObject()
        } else if (newSelection.length === 1) {
          canvas.setActiveObject(newSelection[0])
        } else {
          const activeSelection = new fabric.ActiveSelection(newSelection, { canvas })
          canvas.setActiveObject(activeSelection)
        }
      } else {
        // Add to selection
        const newSelection = [...currentSelection, layer.object]
        if (newSelection.length === 1) {
          canvas.setActiveObject(newSelection[0])
        } else {
          const activeSelection = new fabric.ActiveSelection(newSelection, { canvas })
          canvas.setActiveObject(activeSelection)
        }
      }
    } else {
      canvas.setActiveObject(layer.object)
    }

    canvas.renderAll()
  }

  const toggleVisibility = (layer: LayerObject) => {
    if (!canvas) return

    layer.object.set({ visible: !layer.visible })
    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const toggleLock = (layer: LayerObject) => {
    if (!canvas) return

    layer.object.set({ selectable: layer.locked, evented: layer.locked })
    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const duplicateLayer = (layer: LayerObject) => {
    if (!canvas) return

    layer.object.clone((cloned: fabric.Object) => {
      cloned.set({
        left: cloned.left! + 20,
        top: cloned.top! + 20,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
      addToHistory(JSON.stringify(canvas.toJSON()))
    })
  }

  const deleteLayer = (layer: LayerObject) => {
    if (!canvas) return

    canvas.remove(layer.object)
    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  }

  const filteredLayers = layers.filter(
    (layer) =>
      layer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layer.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedLayers = filteredLayers.reduce(
    (acc, layer) => {
      if (!acc[layer.type]) {
        acc[layer.type] = []
      }
      acc[layer.type].push(layer)
      return acc
    },
    {} as Record<string, LayerObject[]>,
  )

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-200">Layers</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input
            placeholder="Search layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-7 pl-7 bg-gray-600 border-gray-500 text-white text-xs"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64">
          <div className="p-3 space-y-3">
            {Object.keys(groupedLayers).length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p className="text-xs">No objects found</p>
              </div>
            ) : (
              Object.entries(groupedLayers).map(([type, layerGroup]) => (
                <div key={type} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getObjectIcon(type)}
                    <h4 className="text-xs font-medium text-gray-300 capitalize">
                      {type}s ({layerGroup.length})
                    </h4>
                  </div>
                  <div className="space-y-1 ml-4">
                    {layerGroup.map((layer) => (
                      <div
                        key={layer.id}
                        className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                          layer.selected ? "bg-blue-600/20 border border-blue-500/50" : "hover:bg-gray-600/50"
                        }`}
                        onClick={(e) => selectLayer(layer, e.ctrlKey || e.metaKey)}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-gray-200 truncate">{layer.name}</span>
                          {layer.type === "seat" && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {(layer.object as any).seatType || "std"}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleVisibility(layer)
                                  }}
                                >
                                  {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{layer.visible ? "Hide" : "Show"}</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleLock(layer)
                                  }}
                                >
                                  {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{layer.locked ? "Unlock" : "Lock"}</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    duplicateLayer(layer)
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Duplicate</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteLayer(layer)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-gray-600">
          <div className="text-xs text-gray-400 space-y-1">
            <div>Total Objects: {layers.length}</div>
            <div>Selected: {selectedObjects.length}</div>
            <div className="text-xs text-gray-500 mt-2">
              <div>Click: Select</div>
              <div>Ctrl+Click: Multi-select</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
