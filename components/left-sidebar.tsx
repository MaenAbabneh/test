"use client"

import { useState } from "react"
import {
  MousePointer2,
  Armchair,
  Shapes,
  Plus,
  Minus,
  RotateCw,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Grid,
  Move,
  Square,
  Triangle,
  DoorOpen,
  Type,
  Theater,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export function LeftSidebar() {
  const [selectedTool, setSelectedTool] = useState("select")

  return (
    <TooltipProvider>
      <aside className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
        <div className="text-xs text-gray-400 mb-4 font-medium">TOOLS</div>

        <ToggleGroup
          type="single"
          value={selectedTool}
          onValueChange={(value) => value && setSelectedTool(value)}
          orientation="vertical"
          className="flex flex-col space-y-1"
        >
          {/* Select Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="select"
                className="w-10 h-10 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-gray-700"
              >
                <MousePointer2 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Select Tool</p>
            </TooltipContent>
          </Tooltip>

          {/* Draw Seats Tool */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <ToggleGroupItem
                    value="draw-seats"
                    className="w-10 h-10 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-gray-700"
                  >
                    <Armchair className="h-4 w-4" />
                  </ToggleGroupItem>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Draw Seats</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem className="flex items-center space-x-2">
                <Minus className="h-4 w-4" />
                <span>Draw Straight Row</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2">
                <Move className="h-4 w-4 rotate-45" />
                <span>Draw Curved Row</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2">
                <Armchair className="h-4 w-4" />
                <span>Place Single Seat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Draw Shapes Tool */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <ToggleGroupItem
                    value="draw-shapes"
                    className="w-10 h-10 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-gray-700"
                  >
                    <Shapes className="h-4 w-4" />
                  </ToggleGroupItem>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Draw Shapes</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem className="flex items-center space-x-2">
                <Square className="h-4 w-4" />
                <span>Draw Area (Rectangle)</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2">
                <Triangle className="h-4 w-4" />
                <span>Draw Wall (Polygon)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Objects Tool */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <ToggleGroupItem
                    value="add-objects"
                    className="w-10 h-10 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </ToggleGroupItem>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Add Objects</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem className="flex items-center space-x-2">
                <Theater className="h-4 w-4" />
                <span>Stage</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2">
                <DoorOpen className="h-4 w-4" />
                <span>Door</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <span>Text Label</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToggleGroup>

        <Separator className="w-8 bg-gray-600 my-4" />

        {/* Additional Tools */}
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-gray-700">
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Rotate</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-gray-700">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-gray-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="w-8 bg-gray-600 my-4" />

        {/* View Tools */}
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-gray-700">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-gray-700">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 hover:bg-gray-700">
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Grid</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
