"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Settings,
  HelpCircle,
  Menu,
  FileText,
  ImageIcon,
  Share,
} from "lucide-react"
import { useSeatMapStore } from "@/lib/store"

export function Header() {
  const { mapName, setMapName, canvas, canUndo, canRedo, undo, redo, selectedCount, activeTool } = useSeatMapStore()

  const handleSave = () => {
    if (!canvas) return
    const json = JSON.stringify(canvas.toJSON())
    localStorage.setItem("seatmap-data", json)
    console.log("Seat map saved to localStorage")
  }

  const handleLoad = () => {
    if (!canvas) return
    const saved = localStorage.getItem("seatmap-data")
    if (saved) {
      canvas.loadFromJSON(saved, () => {
        canvas.renderAll()
        console.log("Seat map loaded from localStorage")
      })
    }
  }

  const handleExportJSON = () => {
    if (!canvas) return
    const json = JSON.stringify(canvas.toJSON(), null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${mapName.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportImage = () => {
    if (!canvas) return
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    })
    const a = document.createElement("a")
    a.href = dataURL
    a.download = `${mapName.replace(/\s+/g, "-").toLowerCase()}.png`
    a.click()
  }

  const getToolDisplayName = (tool: string) => {
    switch (tool) {
      case "select":
        return "Select"
      case "draw-seats":
        return "Draw Seats"
      case "draw-polygon":
        return "Draw Area"
      case "add-objects":
        return "Add Objects"
      default:
        return tool
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="text-white font-semibold">Seat Map Editor</span>
          </div>

          <Separator orientation="vertical" className="h-6 bg-gray-600" />

          <div className="flex items-center space-x-2">
            <Input
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              className="w-64 h-8 bg-gray-700 border-gray-600 text-white"
              placeholder="Map name..."
            />
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 bg-gray-600" />

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Tool:</span>
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {getToolDisplayName(activeTool)}
              </Badge>
            </div>

            {selectedCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Selected:</span>
                <Badge variant="outline" className="border-gray-500 text-gray-300">
                  {selectedCount}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoad}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Upload className="h-4 w-4 mr-1" />
            Load
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem onClick={handleExportJSON} className="text-gray-300 hover:bg-gray-700 hover:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportImage}
                className="text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">
                <Share className="h-4 w-4 mr-2" />
                Share Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 bg-gray-600" />

          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Settings className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
            <HelpCircle className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">
                Keyboard Shortcuts
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">About</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
