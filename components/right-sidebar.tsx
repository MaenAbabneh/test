"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useSeatMapStore } from "@/lib/store"
import { getObjectType } from "@/lib/fabric-utils"
import { Settings, Info, Layers, Eye } from "lucide-react"

export function RightSidebar() {
  const { selectedObjects, seatCategories, updateSelectedObject, layers, canvas } = useSeatMapStore()

  const selectedObject = selectedObjects[0]
  const objectType = selectedObject ? getObjectType(selectedObject) : null

  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedObject) return

    const updates: any = { [property]: value }

    // Handle special cases
    if (property === "categoryId" && (selectedObject as any).seatData) {
      const category = seatCategories.find((cat) => cat.id === value)
      if (category) {
        updates.fill = category.color
        ;(selectedObject as any).seatData.categoryId = value
        ;(selectedObject as any).seatData.categoryName = category.name
        ;(selectedObject as any).seatData.price = category.price
      }
    }

    updateSelectedObject(updates)
  }

  const renderObjectProperties = () => {
    if (!selectedObject) {
      return (
        <div className="p-6 text-center text-gray-500">
          <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an object to edit its properties</p>
        </div>
      )
    }

    const commonProps = (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="left" className="text-xs font-medium">
              X Position
            </Label>
            <Input
              id="left"
              type="number"
              value={Math.round(selectedObject.left || 0)}
              onChange={(e) => handlePropertyChange("left", Number.parseInt(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="top" className="text-xs font-medium">
              Y Position
            </Label>
            <Input
              id="top"
              type="number"
              value={Math.round(selectedObject.top || 0)}
              onChange={(e) => handlePropertyChange("top", Number.parseInt(e.target.value))}
              className="h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="scaleX" className="text-xs font-medium">
              Width Scale
            </Label>
            <Input
              id="scaleX"
              type="number"
              step="0.1"
              value={selectedObject.scaleX || 1}
              onChange={(e) => handlePropertyChange("scaleX", Number.parseFloat(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="scaleY" className="text-xs font-medium">
              Height Scale
            </Label>
            <Input
              id="scaleY"
              type="number"
              step="0.1"
              value={selectedObject.scaleY || 1}
              onChange={(e) => handlePropertyChange("scaleY", Number.parseFloat(e.target.value))}
              className="h-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="angle" className="text-xs font-medium">
            Rotation (degrees)
          </Label>
          <Input
            id="angle"
            type="number"
            value={Math.round(selectedObject.angle || 0)}
            onChange={(e) => handlePropertyChange("angle", Number.parseInt(e.target.value))}
            className="h-8"
          />
        </div>
      </div>
    )

    switch (objectType) {
      case "seat":
        const seatData = (selectedObject as any).seatData
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: selectedObject.fill as string }} />
                Seat Properties
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seatNumber" className="text-xs font-medium">
                    Seat Number
                  </Label>
                  <Input
                    id="seatNumber"
                    value={seatData?.seatNumber || ""}
                    onChange={(e) => {
                      if (seatData) {
                        seatData.seatNumber = e.target.value
                        canvas?.renderAll()
                      }
                    }}
                    className="h-8"
                    placeholder="e.g., A1, 12, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-xs font-medium">
                    Category
                  </Label>
                  <Select
                    value={seatData?.categoryId || ""}
                    onValueChange={(value) => handlePropertyChange("categoryId", value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {seatCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                            {category.name} (${category.price})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Availability</Label>
                  <Badge variant={seatData?.isAvailable ? "default" : "destructive"}>
                    {seatData?.isAvailable ? "Available" : "Occupied"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />
            {commonProps}
          </div>
        )

      case "stage":
        const stageData = (selectedObject as any).stageData
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Stage Properties</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stageName" className="text-xs font-medium">
                    Stage Name
                  </Label>
                  <Input
                    id="stageName"
                    value={stageData?.name || ""}
                    onChange={(e) => {
                      if (stageData) {
                        stageData.name = e.target.value
                        canvas?.renderAll()
                      }
                    }}
                    className="h-8"
                    placeholder="Stage name"
                  />
                </div>

                <div>
                  <Label htmlFor="stageColor" className="text-xs font-medium">
                    Color
                  </Label>
                  <Input
                    id="stageColor"
                    type="color"
                    value={selectedObject.fill as string}
                    onChange={(e) => handlePropertyChange("fill", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            <Separator />
            {commonProps}
          </div>
        )

      case "text":
        const textData = (selectedObject as any).textData
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Text Properties</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="textContent" className="text-xs font-medium">
                    Text Content
                  </Label>
                  <Input
                    id="textContent"
                    value={(selectedObject as any).text || ""}
                    onChange={(e) => handlePropertyChange("text", e.target.value)}
                    className="h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fontSize" className="text-xs font-medium">
                      Font Size
                    </Label>
                    <Input
                      id="fontSize"
                      type="number"
                      value={(selectedObject as any).fontSize || 16}
                      onChange={(e) => handlePropertyChange("fontSize", Number.parseInt(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="textColor" className="text-xs font-medium">
                      Color
                    </Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={selectedObject.fill as string}
                      onChange={(e) => handlePropertyChange("fill", e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />
            {commonProps}
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Object Properties</h3>
              <Badge variant="outline">{objectType}</Badge>
            </div>

            <Separator />
            {commonProps}
          </div>
        )
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 px-4 py-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              Layers
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs">
              <Info className="h-3 w-3 mr-1" />
              Info
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="properties" className="m-0 p-4">
            {renderObjectProperties()}
          </TabsContent>

          <TabsContent value="layers" className="m-0 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Layers</h3>
                <Badge variant="outline">{layers.length}</Badge>
              </div>

              <div className="space-y-2">
                {layers.map((obj, index) => {
                  const type = getObjectType(obj)
                  const isSelected = selectedObjects.includes(obj)

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                        isSelected ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (canvas) {
                          canvas.setActiveObject(obj)
                          canvas.renderAll()
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: (obj.fill as string) || "#ccc" }} />
                        <span className="text-xs font-medium capitalize">{type}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          obj.set({ visible: !obj.visible })
                          canvas?.renderAll()
                        }}
                      >
                        <Eye className={`h-3 w-3 ${obj.visible ? "text-gray-600" : "text-gray-300"}`} />
                      </Button>
                    </div>
                  )
                })}

                {layers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No objects on canvas</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="m-0 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Canvas Info</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Objects:</span>
                    <span>{layers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected:</span>
                    <span>{selectedObjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Zoom:</span>
                    <span>{Math.round((canvas?.getZoom() || 1) * 100)}%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-3">Seat Categories</h3>
                <div className="space-y-2">
                  {seatCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-xs">{category.name}</span>
                      </div>
                      <span className="text-xs font-medium">${category.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
