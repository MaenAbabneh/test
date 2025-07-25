"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Eye, Download, Upload } from "lucide-react"
import { SeatMapEditor } from "@/components/seat-map-editor"
import { SeatMapPreview } from "@/components/seat-map-preview"
import { Header } from "@/components/header"
import { useSeatMapStore } from "@/lib/store"

export default function Home() {
  const [activeTab, setActiveTab] = useState("editor")
  const { mapName, canvasState, saveCanvasData } = useSeatMapStore()

  const handleSaveMap = () => {
    const data = saveCanvasData()
    if (data) {
      localStorage.setItem("seat-map-data", data)
      localStorage.setItem("seat-map-name", mapName)
      console.log("Seat map saved successfully")
    }
  }

  const handleLoadMap = () => {
    const data = localStorage.getItem("seat-map-data")
    const name = localStorage.getItem("seat-map-name")

    if (data) {
      useSeatMapStore.getState().loadCanvasData(data)
      if (name) {
        useSeatMapStore.getState().setMapName(name)
      }
      console.log("Seat map loaded successfully")
    }
  }

  const handleExportJSON = () => {
    const data = saveCanvasData()
    if (data) {
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${mapName.replace(/\s+/g, "-").toLowerCase()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border px-4 py-2">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="editor" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleSaveMap}>
              <Download className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleLoadMap}>
              <Upload className="h-4 w-4 mr-1" />
              Load
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="h-4 w-4 mr-1" />
              Export JSON
            </Button>
            {canvasState && (
              <Badge variant="secondary" className="ml-auto">
                Canvas Ready
              </Badge>
            )}
          </div>
        </div>

        <TabsContent value="editor" className="flex-1 m-0">
          <SeatMapEditor />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0">
          <SeatMapPreview />
        </TabsContent>
      </Tabs>
    </div>
  )
}
