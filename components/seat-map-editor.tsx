import {
  Settings,
  Square,
  Circle,
  Move,
  RotateCw,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Grid,
  Save,
  Undo,
  Redo,
  Menu,
  Bell,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RightSidebar } from "./right-sidebar"

function LeftSidebar() {
  return (
    <aside className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
      <div className="text-xs text-gray-400 mb-2">TOOLS</div>

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700">
        <Move className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <Square className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <Circle className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <RotateCw className="h-4 w-4" />
      </Button>

      <Separator className="w-8 bg-gray-600" />

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <Copy className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <Trash2 className="h-4 w-4" />
      </Button>

      <Separator className="w-8 bg-gray-600" />

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <ZoomIn className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <Grid className="h-4 w-4" />
      </Button>
    </aside>
  )
}

export function SeatMapEditor() {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header Bar */}
      <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Seat Map Editor</h1>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            Venue Layout v2.1
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
          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4" />
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
        <LeftSidebar />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-900 relative overflow-hidden">
          {/* Canvas Area */}
          <div className="absolute inset-0 bg-gray-850">
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Sample Seat Layout */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Stage */}
                <div className="w-96 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-8 flex items-center justify-center">
                  <span className="text-white font-semibold">STAGE</span>
                </div>

                {/* Seat Rows */}
                <div className="space-y-2">
                  {Array.from({ length: 8 }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex space-x-2 justify-center">
                      {Array.from({ length: 12 }, (_, seatIndex) => (
                        <div
                          key={seatIndex}
                          className={`w-6 h-6 rounded ${
                            Math.random() > 0.7 ? "bg-red-500" : Math.random() > 0.5 ? "bg-green-500" : "bg-gray-600"
                          } border border-gray-500 cursor-pointer hover:scale-110 transition-transform`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-4 bg-gray-800 rounded-lg p-2 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Zoom: 100%</div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <div className="w-16 h-6 bg-gray-700 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Inspector Panel */}
        <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <RightSidebar />
        </aside>
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
          <span>Grid: 20px</span>
          <span>Snap: On</span>
          <span>Zoom: 100%</span>
        </div>
      </footer>
    </div>
  )
}
