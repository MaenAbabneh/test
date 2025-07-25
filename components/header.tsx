"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Save, Download, Upload, Undo2, Redo2, Settings, Share, FileText } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"

export function Header() {
  const { mapName, setMapName, canUndo, canRedo, undo, redo, canvas } = useSeatMapStore()

  const handleExport = () => {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    })

    const link = document.createElement("a")
    link.download = `${mapName.replace(/\s+/g, "_")}.png`
    link.href = dataURL
    link.click()
  }

  const handleSave = () => {
    if (!canvas) return

    const json = JSON.stringify(canvas.toJSON())
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.download = `${mapName.replace(/\s+/g, "_")}.json`
    link.href = url
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4">
      {/* Logo/Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-white">Seat Map Editor</h1>
      </div>

      <Separator orientation="vertical" className="h-6 bg-gray-600" />

      {/* Map Name */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Map:</span>
        <Input
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          className="h-8 w-64 bg-gray-700 border-gray-600 text-white text-sm"
          placeholder="Enter map name..."
        />
      </div>

      <Separator orientation="vertical" className="h-6 bg-gray-600" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={!canUndo}
          onClick={undo}
          className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700 disabled:opacity-30"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canRedo}
          onClick={redo}
          className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700 disabled:opacity-30"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-gray-600" />

      {/* File Operations */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={handleSave} className="h-8 px-3 text-gray-300 hover:bg-gray-700">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExport} className="h-8 px-3 text-gray-300 hover:bg-gray-700">
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-300 hover:bg-gray-700">
          <Upload className="h-4 w-4 mr-1" />
          Import
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-300 hover:bg-gray-700">
          <Share className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
