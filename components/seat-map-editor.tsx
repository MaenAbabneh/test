"use client"

import { useEffect, useRef, useState } from "react"
import { fabric } from "fabric"
import { useSeatMapStore } from "@/lib/store"
import { ToolbarPanel } from "./toolbar-panel"
import { CanvasArea } from "./canvas-area"
import { RightSidebar } from "./right-sidebar"
import { LayersPanel } from "./layers-panel"
import { CategoriesModal } from "./categories-modal"

export function SeatMapEditor() {
  const {
    canvas,
    setCanvas,
    selectedObjects,
    setSelectedObjects,
    addToHistory,
    setLayers,
    showLayersPanel,
    showCategoriesModal,
    zoomLevel,
    setZoomLevel,
  } = useSeatMapStore()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCanvasReady, setIsCanvasReady] = useState(false)

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const initCanvas = () => {
      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
          width: 1200,
          height: 800,
          backgroundColor: "#ffffff",
          selection: true,
          preserveObjectStacking: true,
        })

        // Configure object defaults
        fabric.Object.prototype.transparentCorners = false
        fabric.Object.prototype.cornerColor = "#2563eb"
        fabric.Object.prototype.cornerStyle = "circle"
        fabric.Object.prototype.borderColor = "#2563eb"
        fabric.Object.prototype.cornerSize = 8
        fabric.Object.prototype.borderScaleFactor = 2

        // Enable mouse wheel zoom
        fabricCanvas.on("mouse:wheel", (opt) => {
          const delta = opt.e.deltaY
          let zoom = fabricCanvas.getZoom()
          zoom *= 0.999 ** delta
          if (zoom > 20) zoom = 20
          if (zoom < 0.01) zoom = 0.01
          fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
          setZoomLevel(zoom)
          opt.e.preventDefault()
          opt.e.stopPropagation()
        })

        // Enable panning with Alt key
        let isDragging = false
        let lastPosX = 0
        let lastPosY = 0

        fabricCanvas.on("mouse:down", (opt) => {
          const evt = opt.e
          if (evt.altKey === true) {
            isDragging = true
            fabricCanvas.selection = false
            lastPosX = evt.clientX
            lastPosY = evt.clientY
          }
        })

        fabricCanvas.on("mouse:move", (opt) => {
          if (isDragging) {
            const e = opt.e
            const vpt = fabricCanvas.viewportTransform!
            vpt[4] += e.clientX - lastPosX
            vpt[5] += e.clientY - lastPosY
            fabricCanvas.requestRenderAll()
            lastPosX = e.clientX
            lastPosY = e.clientY
          }
        })

        fabricCanvas.on("mouse:up", () => {
          if (isDragging) {
            fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform!)
            isDragging = false
            fabricCanvas.selection = true
          }
        })

        setCanvas(fabricCanvas)
        setIsCanvasReady(true)

        // Initialize with empty history
        addToHistory(JSON.stringify(fabricCanvas.toJSON()))

        return fabricCanvas
      } catch (error) {
        console.error("Failed to initialize canvas:", error)
        return null
      }
    }

    const timeoutId = setTimeout(() => {
      initCanvas()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (canvas) {
        try {
          canvas.dispose()
        } catch (error) {
          console.warn("Error disposing canvas:", error)
        }
      }
    }
  }, [setCanvas, addToHistory, setZoomLevel])

  // Handle selection changes and update layers
  useEffect(() => {
    if (!canvas || !isCanvasReady) return

    const updateLayers = () => {
      const objects = canvas.getObjects().filter((obj) => !(obj as any).isGrid)
      setLayers(objects)
    }

    const handleSelectionCreated = (e: fabric.IEvent) => {
      const activeObjects = canvas.getActiveObjects()
      setSelectedObjects(activeObjects)
    }

    const handleSelectionUpdated = (e: fabric.IEvent) => {
      const activeObjects = canvas.getActiveObjects()
      setSelectedObjects(activeObjects)
    }

    const handleSelectionCleared = () => {
      setSelectedObjects([])
    }

    const handleObjectModified = () => {
      updateLayers()
      setTimeout(() => {
        addToHistory(JSON.stringify(canvas.toJSON()))
      }, 100)
    }

    const handleObjectAdded = () => {
      updateLayers()
    }

    const handleObjectRemoved = () => {
      updateLayers()
    }

    canvas.on("selection:created", handleSelectionCreated)
    canvas.on("selection:updated", handleSelectionUpdated)
    canvas.on("selection:cleared", handleSelectionCleared)
    canvas.on("object:modified", handleObjectModified)
    canvas.on("object:added", handleObjectAdded)
    canvas.on("object:removed", handleObjectRemoved)

    // Initial layers update
    updateLayers()

    return () => {
      try {
        canvas.off("selection:created", handleSelectionCreated)
        canvas.off("selection:updated", handleSelectionUpdated)
        canvas.off("selection:cleared", handleSelectionCleared)
        canvas.off("object:modified", handleObjectModified)
        canvas.off("object:added", handleObjectAdded)
        canvas.off("object:removed", handleObjectRemoved)
      } catch (error) {
        console.warn("Error removing canvas event listeners:", error)
      }
    }
  }, [canvas, isCanvasReady, setSelectedObjects, addToHistory, setLayers])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              useSeatMapStore.getState().redo()
            } else {
              useSeatMapStore.getState().undo()
            }
            break
          case "d":
            e.preventDefault()
            useSeatMapStore.getState().duplicateSelectedObjects()
            break
          case "g":
            e.preventDefault()
            useSeatMapStore.getState().groupSelectedObjects()
            break
          case "u":
            e.preventDefault()
            useSeatMapStore.getState().ungroupSelectedObjects()
            break
          case "s":
            e.preventDefault()
            if (canvas) {
              addToHistory(JSON.stringify(canvas.toJSON()))
            }
            break
        }
      } else {
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault()
            useSeatMapStore.getState().deleteSelectedObjects()
            break
          case "v":
            useSeatMapStore.getState().setActiveTool("select")
            break
          case "s":
            useSeatMapStore.getState().setActiveTool("seat")
            break
          case "t":
            useSeatMapStore.getState().setActiveTool("stage")
            break
          case "x":
            useSeatMapStore.getState().setActiveTool("text")
            break
          case "g":
            useSeatMapStore.getState().setShowGrid(!useSeatMapStore.getState().showGrid)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [canvas, addToHistory])

  return (
    <div className="h-screen flex bg-background">
      {/* Left Toolbar */}
      <ToolbarPanel />

      {/* Layers Panel (conditional) */}
      {showLayersPanel && <LayersPanel />}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        <CanvasArea canvasRef={canvasRef} />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Modals */}
      {showCategoriesModal && <CategoriesModal />}
    </div>
  )
}
