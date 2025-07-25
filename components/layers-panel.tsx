"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, EyeOff, Lock, Unlock, Search, Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import { getObjectType } from "@/lib/fabric-utils"
import { fabric } from "fabric"

export function LayersPanel() {
  const {
    layers,
    canvas,
    selectedObjects,
    setSelectedObjects,
    toggleLayerVisibility,
    toggleLayerLock,
    deleteSelectedObjects,
    duplicateSelectedObjects,
  } = useSeatMapStore()

  const [searchTerm, setSearchTerm] = useState("")

  const filteredLayers = layers.filter((obj) => {
    const type = getObjectType(obj)
    const name = (obj as any).name || type
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleLayerSelect = (obj: fabric.Object, multiSelect = false) => {
    if (!canvas) return

    if (multiSelect) {
      const isSelected = selectedObjects.includes(obj)
      if (isSelected) {
        const newSelection = selectedObjects.filter((o) => o !== obj)
        if (newSelection.length > 0) {
          canvas.setActiveObject(newSelection[0])
          if (newSelection.length > 1) {
            const selection = new fabric.ActiveSelection(newSelection, { canvas })
            canvas.setActiveObject(selection)
          }
        } else {
          canvas.discardActiveObject()
        }
        setSelectedObjects(newSelection)
      } else {
        const newSelection = [...selectedObjects, obj]
        if (newSelection.length === 1) {
          canvas.setActiveObject(obj)
        } else {
          const selection = new fabric.ActiveSelection(newSelection, { canvas })
          canvas.setActiveObject(selection)
        }
        setSelectedObjects(newSelection)
      }
    } else {
      canvas.setActiveObject(obj)
      setSelectedObjects([obj])
    }

    canvas.renderAll()
  }

  const moveLayer = (obj: fabric.Object, direction: "up" | "down") => {
    if (!canvas) return

    if (direction === "up") {
      canvas.bringForward(obj)
    } else {
      canvas.sendBackwards(obj)
    }
    canvas.renderAll()
  }

  return (
    <Card className="w-64 h-full rounded-none border-0 border-r">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          Layers
          <Badge variant="outline" className="text-xs">
            {layers.length}
          </Badge>
        </CardTitle>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input
            placeholder="Search layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-3 space-y-1">
            {filteredLayers.map((obj, index) => {
              const type = getObjectType(obj)
              const isSelected = selectedObjects.includes(obj)
              const isVisible = obj.visible !== false
              const isLocked = !obj.selectable

              return (
                <div
                  key={index}
                  className={`group flex items-center p-2 rounded-md border cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={(e) => handleLayerSelect(obj, e.ctrlKey || e.metaKey)}
                >
                  {/* Layer Icon/Color */}
                  <div
                    className="w-4 h-4 rounded border border-gray-300 flex-shrink-0 mr-2"
                    style={{
                      backgroundColor: (obj.fill as string) || "#e5e7eb",
                    }}
                  />

                  {/* Layer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate capitalize">{type}</div>
                    <div className="text-xs text-gray-500 truncate">{(obj as any).name || `${type} ${index + 1}`}</div>
                  </div>

                  {/* Layer Controls */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveLayer(obj, "up")
                      }}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveLayer(obj, "down")
                      }}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLayerVisibility(obj)
                      }}
                    >
                      {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLayerLock(obj)
                      }}
                    >
                      {isLocked ? <Lock className="h-3 w-3 text-red-500" /> : <Unlock className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              )
            })}

            {filteredLayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-xs">{searchTerm ? "No matching layers" : "No layers yet"}</div>
              </div>
            )}
          </div>
        </ScrollArea>

        {selectedObjects.length > 0 && (
          <>
            <Separator />
            <div className="p-3 space-y-2">
              <div className="text-xs font-medium text-gray-700">
                Selected: {selectedObjects.length} object{selectedObjects.length !== 1 ? "s" : ""}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs bg-transparent"
                  onClick={duplicateSelectedObjects}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs bg-transparent"
                  onClick={deleteSelectedObjects}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
