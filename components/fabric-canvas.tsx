"use client"

import { useEffect, useRef, useCallback } from "react"
import { fabric } from "fabric"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import {
  createSeat,
  createStage,
  createDoor,
  createTextLabel,
  snapToGrid,
  addGrid,
  getObjectType,
} from "@/lib/fabric-utils"

export function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    canvas,
    setCanvas,
    activeTool,
    selectedObjects,
    setSelectedObjects,
    selectedCount,
    setSelectedCount,
    activeSelection,
    setActiveSelection,
    setInspectorType,
    snapToGrid: snapEnabled,
    gridSize,
    zoom,
    setZoom,
    currentSeatType,
    addToHistory,
  } = useSeatMapStore()

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: "#1f2937",
      selection: true,
      preserveObjectStacking: true,
    })

    // Configure object defaults
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = "#3b82f6"
    fabric.Object.prototype.cornerStyle = "circle"
    fabric.Object.prototype.borderColor = "#3b82f6"
    fabric.Object.prototype.cornerSize = 8
    fabric.Object.prototype.borderScaleFactor = 2

    setCanvas(fabricCanvas)

    // Add initial grid
    addGrid(fabricCanvas, gridSize)

    // Add sample content
    addSampleContent(fabricCanvas)

    // Handle canvas resize
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        fabricCanvas.setDimensions({
          width: Math.min(1200, containerWidth - 40),
          height: Math.min(800, containerHeight - 40),
        })

        addGrid(fabricCanvas, gridSize)
        fabricCanvas.renderAll()
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      fabricCanvas.dispose()
    }
  }, [setCanvas, gridSize])

  // Handle selection changes and update inspector
  useEffect(() => {
    if (!canvas) return

    const handleSelectionCreated = (e: fabric.IEvent) => {
      const selection = canvas.getActiveObject()
      const objects = canvas.getActiveObjects()

      setActiveSelection(selection)
      setSelectedObjects(objects)
      setSelectedCount(objects.length)

      // Determine inspector type
      if (objects.length === 0) {
        setInspectorType("none")
      } else if (objects.length === 1) {
        const objectType = getObjectType(objects[0])
        setInspectorType(objectType as any)
      } else {
        setInspectorType("multiple")
      }
    }

    const handleSelectionUpdated = (e: fabric.IEvent) => {
      const selection = canvas.getActiveObject()
      const objects = canvas.getActiveObjects()

      setActiveSelection(selection)
      setSelectedObjects(objects)
      setSelectedCount(objects.length)

      // Determine inspector type
      if (objects.length === 0) {
        setInspectorType("none")
      } else if (objects.length === 1) {
        const objectType = getObjectType(objects[0])
        setInspectorType(objectType as any)
      } else {
        setInspectorType("multiple")
      }
    }

    const handleSelectionCleared = () => {
      setActiveSelection(null)
      setSelectedObjects([])
      setSelectedCount(0)
      setInspectorType("none")
    }

    // Handle object modifications for real-time updates
    const handleObjectModified = (e: fabric.IEvent) => {
      // Force re-render of inspector by updating selection
      const selection = canvas.getActiveObject()
      if (selection) {
        setActiveSelection(selection)
      }
    }

    canvas.on("selection:created", handleSelectionCreated)
    canvas.on("selection:updated", handleSelectionUpdated)
    canvas.on("selection:cleared", handleSelectionCleared)
    canvas.on("object:modified", handleObjectModified)
    canvas.on("object:scaling", handleObjectModified)
    canvas.on("object:rotating", handleObjectModified)
    canvas.on("object:moving", handleObjectModified)

    return () => {
      canvas.off("selection:created", handleSelectionCreated)
      canvas.off("selection:updated", handleSelectionUpdated)
      canvas.off("selection:cleared", handleSelectionCleared)
      canvas.off("object:modified", handleObjectModified)
      canvas.off("object:scaling", handleObjectModified)
      canvas.off("object:rotating", handleObjectModified)
      canvas.off("object:moving", handleObjectModified)
    }
  }, [canvas, setSelectedObjects, setSelectedCount, setActiveSelection, setInspectorType])

  // Handle mouse wheel zoom
  useEffect(() => {
    if (!canvas) return

    const handleMouseWheel = (opt: fabric.IEvent & { e: WheelEvent }) => {
      const delta = opt.e.deltaY
      let newZoom = canvas.getZoom()
      newZoom *= 0.999 ** delta

      if (newZoom > 5) newZoom = 5
      if (newZoom < 0.1) newZoom = 0.1

      const point = new fabric.Point(opt.e.offsetX, opt.e.offsetY)
      canvas.zoomToPoint(point, newZoom)
      setZoom(newZoom)

      opt.e.preventDefault()
      opt.e.stopPropagation()
    }

    canvas.on("mouse:wheel", handleMouseWheel)

    return () => {
      canvas.off("mouse:wheel", handleMouseWheel)
    }
  }, [canvas, setZoom])

  // Handle object snapping
  useEffect(() => {
    if (!canvas) return

    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!snapEnabled || !e.target) return

      const obj = e.target
      const left = snapToGrid(obj.left!, gridSize)
      const top = snapToGrid(obj.top!, gridSize)

      obj.set({ left, top })
    }

    canvas.on("object:moving", handleObjectMoving)

    return () => {
      canvas.off("object:moving", handleObjectMoving)
    }
  }, [canvas, snapEnabled, gridSize])

  // Handle canvas clicks for drawing tools
  useEffect(() => {
    if (!canvas) return

    const handleMouseDown = (e: fabric.IEvent & { e: MouseEvent }) => {
      if (activeTool === "select") return

      const pointer = canvas.getPointer(e.e)
      let x = pointer.x
      let y = pointer.y

      // Snap to grid if enabled
      if (snapEnabled) {
        x = snapToGrid(x, gridSize)
        y = snapToGrid(y, gridSize)
      }

      let newObject: fabric.Object | null = null

      switch (activeTool) {
        case "draw-seats":
          // Create a single seat
          newObject = createSeat(x, y, currentSeatType, `S${Date.now().toString().slice(-3)}`)
          break
        case "add-objects":
          // For now, create a stage - this could be expanded with a submenu
          newObject = createStage(x, y)
          break
      }

      if (newObject) {
        canvas.add(newObject)
        canvas.setActiveObject(newObject)
        canvas.renderAll()

        // Add to history
        addToHistory(JSON.stringify(canvas.toJSON()))
      }
    }

    canvas.on("mouse:down", handleMouseDown)

    return () => {
      canvas.off("mouse:down", handleMouseDown)
    }
  }, [canvas, activeTool, snapEnabled, gridSize, currentSeatType, addToHistory])

  // Add sample content
  const addSampleContent = (fabricCanvas: fabric.Canvas) => {
    // Add a stage
    const stage = createStage(400, 50)
    fabricCanvas.add(stage)

    // Add some sample seats
    const rows = ["A", "B", "C", "D", "E", "F"]
    rows.forEach((row, rowIndex) => {
      for (let seatIndex = 1; seatIndex <= 10; seatIndex++) {
        const seatType = rowIndex < 2 ? "vip" : seatIndex === 1 || seatIndex === 10 ? "wheelchair" : "standard"
        const seat = createSeat(300 + seatIndex * 35, 200 + rowIndex * 40, seatType as any, `${row}${seatIndex}`)
        fabricCanvas.add(seat)
      }
    })

    // Add doors
    const door1 = createDoor(200, 150)
    const door2 = createDoor(800, 150)
    fabricCanvas.add(door1)
    fabricCanvas.add(door2)

    // Add text label
    const textLabel = createTextLabel(500, 600, "Main Entrance")
    fabricCanvas.add(textLabel)

    fabricCanvas.renderAll()

    // Add initial state to history
    addToHistory(JSON.stringify(fabricCanvas.toJSON()))
  }

  // Canvas control functions
  const zoomIn = useCallback(() => {
    if (!canvas) return
    const newZoom = Math.min(canvas.getZoom() * 1.2, 5)
    canvas.setZoom(newZoom)
    setZoom(newZoom)
    canvas.renderAll()
  }, [canvas, setZoom])

  const zoomOut = useCallback(() => {
    if (!canvas) return
    const newZoom = Math.max(canvas.getZoom() / 1.2, 0.1)
    canvas.setZoom(newZoom)
    setZoom(newZoom)
    canvas.renderAll()
  }, [canvas, setZoom])

  const resetView = useCallback(() => {
    if (!canvas) return
    canvas.setZoom(1)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    setZoom(1)
    canvas.renderAll()
  }, [canvas, setZoom])

  const fitToScreen = useCallback(() => {
    if (!canvas) return

    const objects = canvas.getObjects().filter((obj) => !(obj as any).isGrid)
    if (objects.length === 0) return

    const group = new fabric.Group(objects, { canvas: false })
    const groupWidth = group.width!
    const groupHeight = group.height!

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()

    const scaleX = (canvasWidth * 0.8) / groupWidth
    const scaleY = (canvasHeight * 0.8) / groupHeight
    const scale = Math.min(scaleX, scaleY, 2) // Max zoom of 2x for fit

    canvas.setZoom(scale)
    setZoom(scale)

    const centerX = (canvasWidth - groupWidth * scale) / 2
    const centerY = (canvasHeight - groupHeight * scale) / 2
    canvas.setViewportTransform([scale, 0, 0, scale, centerX, centerY])
    canvas.renderAll()
  }, [canvas, setZoom])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return

      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault()
        const objects = canvas.getObjects().filter((obj) => !(obj as any).isGrid && obj.selectable)
        const selection = new fabric.ActiveSelection(objects, { canvas })
        canvas.setActiveObject(selection)
        canvas.renderAll()
      }

      // Delete: Remove selected objects
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects()
        if (activeObjects.length > 0) {
          activeObjects.forEach((obj) => canvas.remove(obj))
          canvas.discardActiveObject()
          canvas.renderAll()
          addToHistory(JSON.stringify(canvas.toJSON()))
        }
      }

      // Escape: Clear selection
      if (e.key === "Escape") {
        canvas.discardActiveObject()
        canvas.renderAll()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [canvas, addToHistory])

  return (
    <div ref={containerRef} className="flex-1 bg-gray-900 relative overflow-hidden">
      {/* Canvas */}
      <div className="w-full h-full flex items-center justify-center p-5">
        <canvas ref={canvasRef} className="border border-gray-700 shadow-lg rounded-lg" />
      </div>

      {/* Canvas Controls */}
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
        <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={zoomOut} className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={zoomIn} className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetView}
              className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={fitToScreen}
              className="h-8 w-8 p-0 text-gray-300 hover:bg-gray-700"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-300">
          <div>Zoom: {Math.round(zoom * 100)}%</div>
          <div>Objects: {canvas?.getObjects().filter((obj) => !(obj as any).isGrid).length || 0}</div>
          <div>Selected: {selectedCount}</div>
        </div>

        <div className="text-xs text-gray-500 max-w-32">
          <div>Mouse wheel: Zoom</div>
          <div>Click + drag: Pan/Move</div>
          <div>Ctrl+A: Select all</div>
          <div>Del: Delete selected</div>
          <div>Esc: Clear selection</div>
        </div>
      </div>

      {/* Tool Indicator */}
      <div className="absolute top-4 left-4 bg-gray-800 rounded px-3 py-1 text-sm text-gray-300">
        Tool: {activeTool.replace("-", " ")}
        {activeTool === "draw-seats" && <span className="ml-2 text-xs text-gray-400">({currentSeatType})</span>}
      </div>

      {/* Zoom Display */}
      <div className="absolute top-4 right-4 bg-gray-800 rounded px-3 py-1 text-sm text-gray-300">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}
