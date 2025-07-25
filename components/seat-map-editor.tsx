"use client"
import { LeftSidebar } from "./left-sidebar"
import { RightSidebar } from "./right-sidebar"
import { FabricCanvas } from "./fabric-canvas"
import { useSeatMapStore } from "@/lib/store"
import { Header } from "./header"
import { StatusBar } from "./status-bar"

export function SeatMapEditor() {
  const {
    mapName,
    setMapName,
    selectedCount,
    activeTool,
    snapToGrid,
    setSnapToGrid,
    canUndo,
    canRedo,
    undo,
    redo,
    canvas,
  } = useSeatMapStore()

  const handleSave = () => {
    if (canvas) {
      const json = JSON.stringify(canvas.toJSON())
      console.log("Saving canvas state:", json)
      // Here you would typically send to your backend
    }
  }

  const handleExport = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      })

      const link = document.createElement("a")
      link.download = `${mapName.replace(/\s+/g, "-").toLowerCase()}.png`
      link.href = dataURL
      link.click()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <FabricCanvas />
        <RightSidebar />
      </div>
      <StatusBar />
    </div>
  )
}
