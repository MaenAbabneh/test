"use client"

import { useState } from "react"
import { Search, Edit, Trash2, Plus, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Mock data for seat categories
const seatCategories = [
  { id: 1, name: "VIP", color: "#FFD700", price: "$150" },
  { id: 2, name: "Premium", color: "#FF6B6B", price: "$100" },
  { id: 3, name: "Standard", color: "#4ECDC4", price: "$75" },
  { id: 4, name: "Economy", color: "#95E1D3", price: "$50" },
]

// Selection types
type SelectionType = "none" | "row" | "seat" | "shape"

interface RightSidebarProps {
  selectionType?: SelectionType
  selectedCount?: number
}

export function RightSidebar({ selectionType = "none", selectedCount = 0 }: RightSidebarProps) {
  const [venueName, setVenueName] = useState("Main Theater")

  const renderContent = () => {
    switch (selectionType) {
      case "row":
        return <RowSelectionView />
      case "seat":
        return <SeatSelectionView selectedCount={selectedCount} />
      case "shape":
        return <ShapeSelectionView />
      default:
        return <DefaultView venueName={venueName} setVenueName={setVenueName} />
    }
  }

  return (
    <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-200">INSPECTOR</h2>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">{renderContent()}</div>
    </aside>
  )
}

// Default View Component
function DefaultView({
  venueName,
  setVenueName,
}: {
  venueName: string
  setVenueName: (name: string) => void
}) {
  return (
    <>
      {/* Seat Categories Card */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Seat Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {seatCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded border border-gray-500" style={{ backgroundColor: category.color }} />
                  <div>
                    <div className="text-sm text-gray-200">{category.name}</div>
                    <div className="text-xs text-gray-400">{category.price}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Category
          </Button>
        </CardContent>
      </Card>

      {/* Map Settings Card */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-200">Map Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Venue Name</Label>
            <Input
              className="bg-gray-600 border-gray-500 text-gray-200"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Row Selection View Component
function RowSelectionView() {
  const [rowLabel, setRowLabel] = useState("A")
  const [numberingScheme, setNumberingScheme] = useState("1-2-3")
  const [pricingCategory, setPricingCategory] = useState("standard")

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-200">Row Inspector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Row Label / Number</Label>
          <Input
            className="bg-gray-600 border-gray-500 text-gray-200"
            value={rowLabel}
            onChange={(e) => setRowLabel(e.target.value)}
            placeholder="e.g., A or 1"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Numbering Scheme</Label>
          <Select value={numberingScheme} onValueChange={setNumberingScheme}>
            <SelectTrigger className="bg-gray-600 border-gray-500 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2-3">1, 2, 3...</SelectItem>
              <SelectItem value="2-4-6">2, 4, 6...</SelectItem>
              <SelectItem value="odd">1, 3, 5...</SelectItem>
              <SelectItem value="even">2, 4, 6...</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Pricing Category</Label>
          <Select value={pricingCategory} onValueChange={setPricingCategory}>
            <SelectTrigger className="bg-gray-600 border-gray-500 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vip">VIP - $150</SelectItem>
              <SelectItem value="premium">Premium - $100</SelectItem>
              <SelectItem value="standard">Standard - $75</SelectItem>
              <SelectItem value="economy">Economy - $50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-gray-600" />

        <div className="flex space-x-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
            Apply Changes
          </Button>
          <Button variant="outline" className="flex-1 border-gray-500 bg-transparent" size="sm">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Seat Selection View Component
function SeatSelectionView({ selectedCount }: { selectedCount: number }) {
  const [priceOverride, setPriceOverride] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("standard")

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-200">Seat Inspector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-300">
          {selectedCount} seat{selectedCount !== 1 ? "s" : ""} selected
        </div>

        <Separator className="bg-gray-600" />

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Price Override</Label>
          <Input
            className="bg-gray-600 border-gray-500 text-gray-200"
            value={priceOverride}
            onChange={(e) => setPriceOverride(e.target.value)}
            placeholder="e.g., $85"
          />
          <div className="text-xs text-gray-500">Leave empty to use category default</div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-600 border-gray-500 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {seatCategories.map((category) => (
                <SelectItem key={category.id} value={category.name.toLowerCase()}>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded border border-gray-400"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>
                      {category.name} - {category.price}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-gray-600" />

        <div className="flex space-x-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
            Apply Changes
          </Button>
          <Button variant="outline" className="flex-1 border-gray-500 bg-transparent" size="sm">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Shape Selection View Component
function ShapeSelectionView() {
  const [width, setWidth] = useState("400")
  const [height, setHeight] = useState("100")
  const [fillColor, setFillColor] = useState("#6366F1")

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-200">Object Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-300">Stage selected</div>

        <Separator className="bg-gray-600" />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Width</Label>
            <Input
              className="bg-gray-600 border-gray-500 text-gray-200"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Height</Label>
            <Input
              className="bg-gray-600 border-gray-500 text-gray-200"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Fill Color</Label>
          <div className="flex space-x-2">
            <div
              className="w-10 h-10 rounded border border-gray-500 cursor-pointer"
              style={{ backgroundColor: fillColor }}
            />
            <Input
              className="flex-1 bg-gray-600 border-gray-500 text-gray-200"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              placeholder="#6366F1"
            />
            <Button variant="outline" size="sm" className="border-gray-500 bg-transparent">
              <Palette className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-600" />

        <div className="flex space-x-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
            Apply Changes
          </Button>
          <Button variant="outline" className="flex-1 border-gray-500 bg-transparent" size="sm">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
