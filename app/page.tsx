"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RightSidebar } from "@/components/right-sidebar"
import { Eye, Edit } from "lucide-react"
import { SeatMapEditor } from "@/components/seat-map-editor"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [currentView, setCurrentView] = useState<"editor" | "preview">("editor")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <h1 className="text-lg font-semibold">Seat Map Dashboard</h1>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex items-center space-x-2">
              <Button
                variant={currentView === "editor" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("editor")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editor
              </Button>
              <Button
                variant={currentView === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("preview")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Main Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          {currentView === "editor" ? (
            <SeatMapEditor />
          ) : (
            <Card className="w-full max-w-4xl mx-4">
              <CardHeader>
                <CardTitle>Seat Map Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-white border border-border rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">🎭</div>
                    <p className="text-lg font-medium">Canvas Preview</p>
                    <p className="text-sm">View your completed seat map</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
      <Toaster />
    </div>
  )
}
