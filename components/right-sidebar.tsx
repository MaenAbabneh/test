"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useSeatMapStore } from "@/lib/store"
import { getObjectType } from "@/lib/fabric-utils"
import { Settings, Palette, Move, RotateCw } from "lucide-react"

export function RightSidebar() {
  const { selectedObjects, seatCategories, updateSelectedObject, canvas, addToHistory } = useSeatMapStore()

  const updateObjectProperty = (property: string, value: any) => {
    if (!canvas || selectedObjects.length === 0) return

    selectedObjects.forEach((obj) => {
      obj.set(property, value)
      obj.setCoords()
    })

    canvas.renderAll()

    // Add to history after a short delay
    setTimeout(() => {
      addToHistory(JSON.stringify(canvas.toJSON()))
    }, 100)
  }

  if (selectedObjects.length === 0) {
    return (
      <div className="w-80 bg-card border-l border-border">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Inspector
          </h3>
          <div className="text-center text-muted-foreground py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                <Move className="h-8 w-8" />
              </div>
            </div>
            <p className="text-sm">Select an object to edit its properties</p>
            <p className="text-xs text-muted-foreground mt-2">
              Click on any object in the canvas to see its properties here
            </p>
          </div>
        </div>
      </div>
    )
  }

  const selectedObject = selectedObjects[0]
  const objectType = getObjectType(selectedObject)
  const isMultipleSelection = selectedObjects.length > 1

  return (
    <div className="w-80 bg-card border-l border-border">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Inspector
          </h3>
          {isMultipleSelection && <Badge variant="secondary">{selectedObjects.length} selected</Badge>}
        </div>

        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            {/* Object Type Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  {objectType.charAt(0).toUpperCase() + objectType.slice(1)}
                  {isMultipleSelection && ` (${selectedObjects.length})`}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Position Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Move className="h-4 w-4 mr-2" />
                  Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">X</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.left || 0)}
                      onChange={(e) => updateObjectProperty("left", Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Y</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.top || 0)}
                      onChange={(e) => updateObjectProperty("top", Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Width</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.width || 0)}
                      onChange={(e) => updateObjectProperty("width", Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.height || 0)}
                      onChange={(e) => updateObjectProperty("height", Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rotation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Transform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Rotation (degrees)</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.angle || 0)}
                    onChange={(e) => updateObjectProperty("angle", Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Scale X</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedObject.scaleX || 1}
                      onChange={(e) => updateObjectProperty("scaleX", Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Scale Y</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedObject.scaleY || 1}
                      onChange={(e) => updateObjectProperty("scaleY", Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Object-specific properties */}
            {objectType === "seat" && (
              <SeatProperties seatData={(selectedObject as any).seatData} onUpdate={updateObjectProperty} />
            )}

            {objectType === "stage" && (
              <StageProperties stageData={(selectedObject as any).stageData} onUpdate={updateObjectProperty} />
            )}

            {objectType === "text" && (
              <TextProperties
                textData={(selectedObject as any).textData}
                object={selectedObject}
                onUpdate={updateObjectProperty}
              />
            )}
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            {/* Appearance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Fill Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      value={(selectedObject.fill as string) || "#000000"}
                      onChange={(e) => updateObjectProperty("fill", e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={(selectedObject.fill as string) || "#000000"}
                      onChange={(e) => updateObjectProperty("fill", e.target.value)}
                      placeholder="#000000"
                      className="h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Stroke Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      value={(selectedObject.stroke as string) || "#000000"}
                      onChange={(e) => updateObjectProperty("stroke", e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={(selectedObject.stroke as string) || "#000000"}
                      onChange={(e) => updateObjectProperty("stroke", e.target.value)}
                      placeholder="#000000"
                      className="h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Stroke Width</Label>
                  <Input
                    type="number"
                    value={selectedObject.strokeWidth || 0}
                    onChange={(e) => updateObjectProperty("strokeWidth", Number(e.target.value))}
                    className="h-8"
                  />
                </div>

                <div>
                  <Label className="text-xs">Opacity</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedObject.opacity || 1}
                    onChange={(e) => updateObjectProperty("opacity", Number(e.target.value))}
                    className="h-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seat Category Selection */}
            {objectType === "seat" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Seat Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={seatCategories.find((cat) => cat.color === selectedObject.fill)?.id || ""}
                    onValueChange={(categoryId) => {
                      const category = seatCategories.find((cat) => cat.id === categoryId)
                      if (category) {
                        updateObjectProperty("fill", category.color)
                        // Update seat data
                        if ((selectedObject as any).seatData) {
                          ;(selectedObject as any).seatData.categoryId = category.id
                          ;(selectedObject as any).seatData.categoryName = category.name
                          ;(selectedObject as any).seatData.price = category.price
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {seatCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            <span>{category.name}</span>
                            <span className="text-muted-foreground">${category.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SeatProperties({ seatData, onUpdate }: { seatData: any; onUpdate: (prop: string, value: any) => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Seat Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Seat Number</Label>
          <Input
            value={seatData?.seatNumber || ""}
            onChange={(e) => {
              if (seatData) seatData.seatNumber = e.target.value
            }}
            placeholder="A1"
            className="h-8"
          />
        </div>
        <div>
          <Label className="text-xs">Price ($)</Label>
          <Input
            type="number"
            value={seatData?.price || 0}
            onChange={(e) => {
              if (seatData) seatData.price = Number(e.target.value)
            }}
            className="h-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={seatData?.isAvailable !== false}
            onCheckedChange={(checked) => {
              if (seatData) seatData.isAvailable = checked
            }}
          />
          <Label className="text-xs">Available</Label>
        </div>
      </CardContent>
    </Card>
  )
}

function StageProperties({ stageData, onUpdate }: { stageData: any; onUpdate: (prop: string, value: any) => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Stage Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Stage Name</Label>
          <Input
            value={stageData?.name || ""}
            onChange={(e) => {
              if (stageData) stageData.name = e.target.value
            }}
            placeholder="Main Stage"
            className="h-8"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function TextProperties({
  textData,
  object,
  onUpdate,
}: {
  textData: any
  object: any
  onUpdate: (prop: string, value: any) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Text Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Text Content</Label>
          <Input
            value={object.text || ""}
            onChange={(e) => onUpdate("text", e.target.value)}
            placeholder="Enter text..."
            className="h-8"
          />
        </div>
        <div>
          <Label className="text-xs">Font Size</Label>
          <Input
            type="number"
            value={object.fontSize || 16}
            onChange={(e) => onUpdate("fontSize", Number(e.target.value))}
            className="h-8"
          />
        </div>
        <div>
          <Label className="text-xs">Font Family</Label>
          <Select value={object.fontFamily || "Arial"} onValueChange={(value) => onUpdate("fontFamily", value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
