"use client"
import { MousePointer, Square, Plus, ChevronDown, Minus, RotateCw, DoorOpen, Theater } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LeftSidebarProps {
  selectedTool: string
  setSelectedTool: (tool: string) => void
}

export function LeftSidebar({ selectedTool, setSelectedTool }: LeftSidebarProps) {
  return (
    <TooltipProvider>
      <aside className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
        <div className="text-xs text-gray-400 mb-2">TOOLS</div>

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
                className="w-10 h-10 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
              >
                <MousePointer className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Select Tool</p>
            </TooltipContent>
          </Tooltip>

          {/* Draw Seats Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToggleGroupItem
                    value="draw-seats"
                    className="w-10 h-10 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white relative"
                  >
                    <Square className="h-4 w-4" />
                    <ChevronDown className="h-2 w-2 absolute bottom-0 right-0" />
                  </ToggleGroupItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    <Minus className="h-3 w-3 mr-2" />
                    Draw Straight Row
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    <RotateCw className="h-3 w-3 mr-2" />
                    Draw Curved Row
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    <Square className="h-3 w-3 mr-2" />
                    Place Single Seat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Draw Seats</p>
            </TooltipContent>
          </Tooltip>

          {/* Add Objects Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToggleGroupItem
                    value="add-objects"
                    className="w-10 h-10 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white relative"
                  >
                    <Plus className="h-4 w-4" />
                    <ChevronDown className="h-2 w-2 absolute bottom-0 right-0" />
                  </ToggleGroupItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    <Theater className="h-3 w-3 mr-2" />
                    Stage
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-200 hover:bg-gray-700">
                    <DoorOpen className="h-3 w-3 mr-2" />
                    Door
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add Objects</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <Separator className="w-8 bg-gray-600" />

        {/* Additional Tools */}
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Rotate</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
