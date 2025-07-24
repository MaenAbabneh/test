"use client"

import { useState } from "react"
import { RightSidebar } from "./right-sidebar"
import { Button } from "@/components/ui/button"

export function RightSidebarDemo() {
  const [selectionType, setSelectionType] = useState<"none" | "row" | "seat" | "shape">("none")
  const [selectedCount, setSelectedCount] = useState(3)

  return (
    <div className="h-screen bg-gray-900 flex">
      <div className="flex-1 p-8 space-y-4">
        <h1 className="text-2xl font-bold text-white">Right Sidebar Demo</h1>
        <div className="space-x-2">
          <Button onClick={() => setSelectionType("none")} variant={selectionType === "none" ? "default" : "outline"}>
            Default View
          </Button>
          <Button onClick={() => setSelectionType("row")} variant={selectionType === "row" ? "default" : "outline"}>
            Row Selected
          </Button>
          <Button onClick={() => setSelectionType("seat")} variant={selectionType === "seat" ? "default" : "outline"}>
            Seats Selected
          </Button>
          <Button onClick={() => setSelectionType("shape")} variant={selectionType === "shape" ? "default" : "outline"}>
            Shape Selected
          </Button>
        </div>
        <div className="text-gray-400">Click the buttons above to see different sidebar views</div>
      </div>
      <RightSidebar selectionType={selectionType} selectedCount={selectedCount} />
    </div>
  )
}
