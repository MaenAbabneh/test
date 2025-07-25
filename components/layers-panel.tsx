"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, EyeOff, Lock, Unlock, Search, X, Circle, Square, Type, Layers } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import { getObjectType } from "@/lib/fabric-utils"

export function LayersPanel() {
  const {
    layers,
    canvas,
    selectedObjects,
    setSelectedObjects,
    showLayersPanel,
    setShowLayersPanel,
    toggleLayerVisibility,
    toggleLayerLock,
  } = useSeatMapStore()

  const [searchTerm, setSearchTerm] = useState("")

  const getObjectIcon = (type: string) => {
    switch (type) {
      case "seat":
        return <Circle className="h-4 w-4" />
      case "stage":
        return <Square className="h-4 w-4" />
      case "text":
        return <Type className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const getObjectName = (obj: any) => {
    const type = getObjectType(obj)

    if (obj.seatData?.seatNumber) {
      return `Seat ${obj.seatData.seatNumber}`
    }
    if (obj.stageData?.name) {
      return obj.stageData.name
    }
    if (obj.textData?.content) {
      return `Text: ${obj.textData.content.substring(0, 20)}...`
    }
    if (obj.text) {
      return `Text: ${obj.text.substring(0, 20)}...`
    }

    return `${type.charAt(0).toUpperCase() + type.slice(1)}`
  }

  const filteredLayers = layers.filter((obj) => {
    const name = getObjectName(obj)
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleObjectClick = (obj: any) => {
    if (!canvas) return

    canvas.setActiveObject(obj)
    canvas.renderAll()
    setSelectedObjects([obj])
  }

  const handleVisibilityToggle = (obj: any) => {
    toggleLayerVisibility(obj)
    canvas?.renderAll()
  }

  const handleLockToggle = (obj: any) => {
    toggleLayerLock(obj)
    canvas?.renderAll()
  }

  if (!showLayersPanel) return null

  return (
    <div className="w-80 bg-card border-r border-border">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Layers
              <Badge variant="secondary" className="ml-2">
                {layers.length}
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowLayersPanel(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search layers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>

          {/* Layers List */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-2">
              {filteredLayers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No layers found</p>
                  {searchTerm && <p className="text-xs mt-1">Try adjusting your search</p>}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredLayers.map((obj, index) => {
                    const objectType = getObjectType(obj)
                    const objectName = getObjectName(obj)
                    const isSelected = selectedObjects.includes(obj)
                    const isVisible = obj.visible !== false
                    const isLocked = !obj.selectable

                    return (
                      <div
                        key={index}
                        className={`
                          flex items-center p-2 rounded-md cursor-pointer transition-colors
                          ${isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}
                        `}
                        onClick={() => handleObjectClick(obj)}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="mr-2 text-muted-foreground">{getObjectIcon(objectType)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{objectName}</div>
                            <div className="text-xs text-muted-foreground">{objectType}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleVisibilityToggle(obj)
                            }}
                            className="h-6 w-6"
                          >
                            {isVisible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLockToggle(obj)
                            }}
                            className="h-6 w-6"
                          >
                            {isLocked ? (
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <Unlock className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
