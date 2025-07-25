"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { LayersPanel } from "./layers-panel"
import { AlignmentTools } from "./alignment-tools"
import { useSeatMapStore } from "@/lib/store"
import { SEAT_COLORS, SEAT_PRICES, updateObjectColor } from "@/lib/fabric-utils"

export function RightSidebar() {
  const {
    selectedCount,
    selectedObjects,
    activeSelection,
    inspectorType,
    updateSelectedObject,
    updateSelectedObjects,
    canvas,
  } = useSeatMapStore()

  return (
    <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-1">Inspector</h2>
        <p className="text-sm text-gray-400">
          {inspectorType === "none" && "No selection"}
          {inspectorType === "seat" && "Seat Properties"}
          {inspectorType === "stage" && "Stage Properties"}
          {inspectorType === "door" && "Door Properties"}
          {inspectorType === "text" && "Text Properties"}
          {inspectorType === "multiple" && `${selectedCount} objects selected`}
        </p>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700 mx-4 mt-4">
          <TabsTrigger value="properties" className="text-xs">
            Properties
          </TabsTrigger>
          <TabsTrigger value="layers" className="text-xs">
            Layers
          </TabsTrigger>
          <TabsTrigger value="align" className="text-xs">
            Align
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="properties" className="mt-0 space-y-4">
              {inspectorType === "none" && <NoSelectionView />}
              {inspectorType === "seat" && <SeatInspector />}
              {inspectorType === "stage" && <StageInspector />}
              {inspectorType === "door" && <DoorInspector />}
              {inspectorType === "text" && <TextInspector />}
              {inspectorType === "multiple" && <MultipleSelectionInspector />}
            </TabsContent>

            <TabsContent value="layers" className="mt-0">
              <LayersPanel />
            </TabsContent>

            <TabsContent value="align" className="mt-0">
              <AlignmentTools />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </aside>
  )
}

function NoSelectionView() {
  return (
    <div className="text-center text-gray-500 py-8">
      <p>Select an object to view and edit its properties</p>
    </div>
  )
}

function SeatInspector() {
  const { activeSelection, updateSelectedObject } = useSeatMapStore()
  const [seatData, setSeatData] = useState<any>({})

  useEffect(() => {
    if (activeSelection) {
      const obj = activeSelection as any
      setSeatData({
        label: obj.label || "",
        seatType: obj.seatType || "standard",
        price: obj.price || 50,
        isAvailable: obj.isAvailable !== false,
        category: obj.category || "standard",
        left: Math.round(obj.left || 0),
        top: Math.round(obj.top || 0),
        width: Math.round((obj.width || 24) * (obj.scaleX || 1)),
        height: Math.round((obj.height || 24) * (obj.scaleY || 1)),
        angle: Math.round(obj.angle || 0),
      })
    }
  }, [activeSelection])

  const handleUpdate = (property: string, value: any) => {
    setSeatData((prev: any) => ({ ...prev, [property]: value }))

    const updates: any = { [property]: value }

    // Special handling for seat type changes
    if (property === "seatType") {
      updates.fill = SEAT_COLORS[value as keyof typeof SEAT_COLORS]
      updates.price = SEAT_PRICES[value as keyof typeof SEAT_PRICES]
      setSeatData((prev: any) => ({
        ...prev,
        seatType: value,
        price: SEAT_PRICES[value as keyof typeof SEAT_PRICES],
      }))
    }

    // Special handling for color changes
    if (property === "fill" && activeSelection) {
      updateObjectColor(activeSelection, value)
      return
    }

    updateSelectedObject(updates)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Seat Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Seat Label</Label>
            <Input
              value={seatData.label || ""}
              onChange={(e) => handleUpdate("label", e.target.value)}
              className="h-8 bg-gray-600 border-gray-500 text-white"
              placeholder="A1"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Seat Type</Label>
            <Select value={seatData.seatType} onValueChange={(value) => handleUpdate("seatType", value)}>
              <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="wheelchair">Wheelchair</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Price ($)</Label>
            <Input
              type="number"
              value={seatData.price || 0}
              onChange={(e) => handleUpdate("price", Number(e.target.value))}
              className="h-8 bg-gray-600 border-gray-500 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-300">Available</Label>
            <Switch
              checked={seatData.isAvailable}
              onCheckedChange={(checked) => handleUpdate("isAvailable", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Position & Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">X Position</Label>
              <Input
                type="number"
                value={seatData.left || 0}
                onChange={(e) => handleUpdate("left", Number(e.target.value))}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Y Position</Label>
              <Input
                type="number"
                value={seatData.top || 0}
                onChange={(e) => handleUpdate("top", Number(e.target.value))}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Width</Label>
              <Input
                type="number"
                value={seatData.width || 24}
                onChange={(e) => {
                  const newWidth = Number(e.target.value)
                  const scaleX = newWidth / 24 // 24 is the original width
                  handleUpdate("scaleX", scaleX)
                }}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Height</Label>
              <Input
                type="number"
                value={seatData.height || 24}
                onChange={(e) => {
                  const newHeight = Number(e.target.value)
                  const scaleY = newHeight / 24 // 24 is the original height
                  handleUpdate("scaleY", scaleY)
                }}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Rotation (°)</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[seatData.angle || 0]}
                onValueChange={([value]) => handleUpdate("angle", value)}
                max={360}
                min={0}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-8">{seatData.angle || 0}°</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StageInspector() {
  const { activeSelection, updateSelectedObject } = useSeatMapStore()
  const [stageData, setStageData] = useState<any>({})

  useEffect(() => {
    if (activeSelection) {
      const obj = activeSelection as any
      setStageData({
        label: obj.label || "STAGE",
        stageType: obj.stageType || "main",
        left: Math.round(obj.left || 0),
        top: Math.round(obj.top || 0),
        width: Math.round((obj.width || 300) * (obj.scaleX || 1)),
        height: Math.round((obj.height || 80) * (obj.scaleY || 1)),
        angle: Math.round(obj.angle || 0),
      })
    }
  }, [activeSelection])

  const handleUpdate = (property: string, value: any) => {
    setStageData((prev: any) => ({ ...prev, [property]: value }))
    updateSelectedObject({ [property]: value })
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Stage Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Stage Label</Label>
            <Input
              value={stageData.label || ""}
              onChange={(e) => handleUpdate("label", e.target.value)}
              className="h-8 bg-gray-600 border-gray-500 text-white"
              placeholder="STAGE"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Stage Type</Label>
            <Select value={stageData.stageType} onValueChange={(value) => handleUpdate("stageType", value)}>
              <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="main">Main Stage</SelectItem>
                <SelectItem value="secondary">Secondary Stage</SelectItem>
                <SelectItem value="platform">Platform</SelectItem>
                <SelectItem value="orchestra">Orchestra Pit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Position & Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">X Position</Label>
              <Input
                type="number"
                value={stageData.left || 0}
                onChange={(e) => handleUpdate("left", Number(e.target.value))}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Y Position</Label>
              <Input
                type="number"
                value={stageData.top || 0}
                onChange={(e) => handleUpdate("top", Number(e.target.value))}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Width</Label>
              <Input
                type="number"
                value={stageData.width || 300}
                onChange={(e) => {
                  const newWidth = Number(e.target.value)
                  const scaleX = newWidth / 300
                  handleUpdate("scaleX", scaleX)
                }}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Height</Label>
              <Input
                type="number"
                value={stageData.height || 80}
                onChange={(e) => {
                  const newHeight = Number(e.target.value)
                  const scaleY = newHeight / 80
                  handleUpdate("scaleY", scaleY)
                }}
                className="h-8 bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DoorInspector() {
  const { activeSelection, updateSelectedObject } = useSeatMapStore()
  const [doorData, setDoorData] = useState<any>({})

  useEffect(() => {
    if (activeSelection) {
      const obj = activeSelection as any
      setDoorData({
        label: obj.label || "EXIT",
        doorType: obj.doorType || "exit",
        isEmergency: obj.isEmergency || false,
        left: Math.round(obj.left || 0),
        top: Math.round(obj.top || 0),
        width: Math.round((obj.width || 60) * (obj.scaleX || 1)),
        height: Math.round((obj.height || 20) * (obj.scaleY || 1)),
      })
    }
  }, [activeSelection])

  const handleUpdate = (property: string, value: any) => {
    setDoorData((prev: any) => ({ ...prev, [property]: value }))
    updateSelectedObject({ [property]: value })
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Door Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Door Label</Label>
            <Input
              value={doorData.label || ""}
              onChange={(e) => handleUpdate("label", e.target.value)}
              className="h-8 bg-gray-600 border-gray-500 text-white"
              placeholder="EXIT"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Door Type</Label>
            <Select value={doorData.doorType} onValueChange={(value) => handleUpdate("doorType", value)}>
              <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="exit">Exit</SelectItem>
                <SelectItem value="entrance">Entrance</SelectItem>
                <SelectItem value="emergency">Emergency Exit</SelectItem>
                <SelectItem value="staff">Staff Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-300">Emergency Exit</Label>
            <Switch
              checked={doorData.isEmergency}
              onCheckedChange={(checked) => handleUpdate("isEmergency", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TextInspector() {
  const { activeSelection, updateSelectedObject } = useSeatMapStore()
  const [textData, setTextData] = useState<any>({})

  useEffect(() => {
    if (activeSelection) {
      const obj = activeSelection as any
      setTextData({
        text: obj.text || "",
        fontSize: obj.fontSize || 16,
        fontFamily: obj.fontFamily || "Arial",
        fill: obj.fill || "#ffffff",
        left: Math.round(obj.left || 0),
        top: Math.round(obj.top || 0),
        angle: Math.round(obj.angle || 0),
      })
    }
  }, [activeSelection])

  const handleUpdate = (property: string, value: any) => {
    setTextData((prev: any) => ({ ...prev, [property]: value }))
    updateSelectedObject({ [property]: value })
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Text Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Text Content</Label>
            <Input
              value={textData.text || ""}
              onChange={(e) => handleUpdate("text", e.target.value)}
              className="h-8 bg-gray-600 border-gray-500 text-white"
              placeholder="Enter text..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Font Size</Label>
            <Input
              type="number"
              value={textData.fontSize || 16}
              onChange={(e) => handleUpdate("fontSize", Number(e.target.value))}
              className="h-8 bg-gray-600 border-gray-500 text-white"
              min="8"
              max="72"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Font Family</Label>
            <Select value={textData.fontFamily} onValueChange={(value) => handleUpdate("fontFamily", value)}>
              <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-300">Text Color</Label>
            <Input
              type="color"
              value={textData.fill || "#ffffff"}
              onChange={(e) => handleUpdate("fill", e.target.value)}
              className="h-8 bg-gray-600 border-gray-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MultipleSelectionInspector() {
  const { selectedObjects, updateSelectedObjects } = useSeatMapStore()

  const handleBulkUpdate = (property: string, value: any) => {
    updateSelectedObjects({ [property]: value })
  }

  const objectTypes = [...new Set(selectedObjects.map((obj: any) => obj.objectType || obj.type || "object"))]

  return (
    <div className="space-y-4">
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Multiple Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Selected:</span>
              <span className="text-white">{selectedObjects.length} objects</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Types:</span>
              <span className="text-white capitalize">{objectTypes.join(", ")}</span>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Bulk Actions</h4>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              onClick={() => handleBulkUpdate("opacity", 0.5)}
            >
              Make Semi-Transparent
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
              onClick={() => handleBulkUpdate("opacity", 1)}
            >
              Make Fully Opaque
            </Button>

            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Bulk Color Change</Label>
              <Input
                type="color"
                onChange={(e) => {
                  selectedObjects.forEach((obj) => {
                    updateObjectColor(obj, e.target.value)
                  })
                }}
                className="h-8 bg-gray-600 border-gray-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-gray-500 py-4">
        <p className="text-sm">Use alignment tools to arrange multiple objects</p>
      </div>
    </div>
  )
}
