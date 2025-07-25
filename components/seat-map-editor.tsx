"use client"

import { useState } from "react"
import { Settings, Save, Undo, Redo, Menu, Bell, User, ZoomIn, ZoomOut, Grid, RotateCcw, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LeftSidebar } from "./left-sidebar"
import { RightSidebar } from "./right-sidebar"
import { MainCanvas } from "./main-canvas"

export function SeatMapEditor() {
  const [mapName, setMapName] = useState("Main Theater Layout")
  const [selectedTool, setSelectedTool] = useState("select")
  const [selectionType, setSelectionType] = useState<"none" | "row" | "seat" | "shape">("none")
  const [selectedCount, setSelectedCount] = useState(0)
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(500, prev + 25))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(10, prev - 25))
  }

  const handleResetZoom = () => {
    setZoom(100)
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header Bar */}
      <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
          <Input
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            className="bg-transparent border-none text-lg font-semibold text-white focus:bg-gray-700 focus:border-gray-600 w-64"
          />
          <Badge variant="secondary" className="bg-blue-600 text-white">
            v2.1
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-gray-600" />
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Tools */}
        <LeftSidebar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

        {/* Main Content Area */}
        <MainCanvas />

        {/* Right Sidebar - Inspector Panel */}
        <RightSidebar selectionType={selectionType} selectedCount={selectedCount} />
      </div>

      {/* Status Bar */}
      <footer className="h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <Separator orientation="vertical" className="h-4 bg-gray-600" />
          <span>Total Seats: 96</span>
          <span>Available: 72</span>
          <span>Reserved: 18</span>
          <span>Sold: 6</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleZoomOut}>
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleResetZoom}>
            {zoom}%
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleZoomIn}>
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Separator orientation="vertical" className="h-4 bg-gray-600" />
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Grid className="h-3 w-3" />
          </Button>
          <span>Grid: 20px</span>
          <span>Snap: On</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Maximize className="h-3 w-3" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
