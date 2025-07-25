"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RightSidebarProps {
  selectionType: "none" | "row" | "seat" | "shape"
  selectedCount: number
}

export function RightSidebar({ selectionType, selectedCount }: RightSidebarProps) {
  const [numberOfRows, setNumberOfRows] = useState("5")
  const [seatsPerRow, setSeatsPerRow] = useState("10")
  const [rowNaming, setRowNaming] = useState("letters")
  const [seatNaming, setSeatNaming] = useState("numbers")

  const handleGenerateRows = () => {
    console.log("Generating rows:", {
      numberOfRows,
      seatsPerRow,
      rowNaming,
      seatNaming,
    })
    // Implementation for generating rows would go here
  }

  return (
    <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col p-4 space-y-4 overflow-y-auto">
      {/* Default View - Bulk Row Creation */}
      {selectionType === "none" && (
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-200">Bulk Row Creation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfRows" className="text-xs text-gray-300">
                Number of Rows
              </Label>
              <Input
                id="numberOfRows"
                value={numberOfRows}
                onChange={(e) => setNumberOfRows(e.target.value)}
                className="h-8 bg-gray-600 border-gray-500 text-white"
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seatsPerRow" className="text-xs text-gray-300">
                Seats per Row
              </Label>
              <Input
                id="seatsPerRow"
                value={seatsPerRow}
                onChange={(e) => setSeatsPerRow(e.target.value)}
                className="h-8 bg-gray-600 border-gray-500 text-white"
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Row Naming</Label>
              <Select value={rowNaming} onValueChange={setRowNaming}>
                <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="letters">A, B, C...</SelectItem>
                  <SelectItem value="numbers">1, 2, 3...</SelectItem>
                  <SelectItem value="roman">I, II, III...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Seat Naming</Label>
              <Select value={seatNaming} onValueChange={setSeatNaming}>
                <SelectTrigger className="h-8 bg-gray-600 border-gray-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="numbers">1, 2, 3...</SelectItem>
                  <SelectItem value="letters">A, B, C...</SelectItem>
                  <SelectItem value="even-odd">2, 4, 6... / 1, 3, 5...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerateRows} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Generate Rows
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Canvas Information Card */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Canvas Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Total Objects:</span>
              <span className="text-gray-200">97</span>
            </div>
            <div className="flex justify-between">
              <span>Seats:</span>
              <span className="text-gray-200">96</span>
            </div>
            <div className="flex justify-between">
              <span>Stages:</span>
              <span className="text-gray-200">1</span>
            </div>
            <div className="flex justify-between">
              <span>Canvas Size:</span>
              <span className="text-gray-200">1200×800</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
          >
            Center View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
          >
            Fit to Screen
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
          >
            Clear Selection
          </Button>
        </CardContent>
      </Card>
    </aside>
  )
}
