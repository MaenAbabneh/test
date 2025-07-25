import { create } from "zustand"
import type { fabric } from "fabric"

export type Tool = "select" | "draw-seats" | "draw-polygon" | "add-objects"
export type SeatType = "standard" | "vip" | "wheelchair" | "premium"
export type ObjectType = "seat" | "stage" | "door" | "text" | "wall" | "area" | "row"

export interface SeatMapState {
  // Canvas state
  canvas: fabric.Canvas | null
  setCanvas: (canvas: fabric.Canvas | null) => void

  // Tool state
  activeTool: Tool
  setActiveTool: (tool: Tool) => void

  // Selection state
  selectedObjects: fabric.Object[]
  setSelectedObjects: (objects: fabric.Object[]) => void
  selectedCount: number
  setSelectedCount: (count: number) => void
  activeSelection: fabric.ActiveSelection | fabric.Object | null
  setActiveSelection: (selection: fabric.ActiveSelection | fabric.Object | null) => void

  // Inspector state
  inspectorType: "none" | "seat" | "stage" | "door" | "text" | "row" | "multiple"
  setInspectorType: (type: "none" | "seat" | "stage" | "door" | "text" | "row" | "multiple") => void

  // Drawing state
  isDrawing: boolean
  setIsDrawing: (drawing: boolean) => void
  currentSeatType: SeatType
  setCurrentSeatType: (type: SeatType) => void

  // Grid and snapping
  snapToGrid: boolean
  setSnapToGrid: (snap: boolean) => void
  gridSize: number
  setGridSize: (size: number) => void

  // Canvas properties
  zoom: number
  setZoom: (zoom: number) => void

  // Map properties
  mapName: string
  setMapName: (name: string) => void

  // History (for undo/redo)
  history: string[]
  historyIndex: number
  addToHistory: (state: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // Object update methods
  updateSelectedObject: (properties: Partial<any>) => void
  updateSelectedObjects: (properties: Partial<any>) => void
}

export const useSeatMapStore = create<SeatMapState>((set, get) => ({
  // Canvas state
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),

  // Tool state
  activeTool: "select",
  setActiveTool: (tool) => {
    const { canvas } = get()
    if (canvas) {
      // Update canvas behavior based on tool
      switch (tool) {
        case "select":
          canvas.selection = true
          canvas.defaultCursor = "default"
          canvas.hoverCursor = "move"
          canvas.isDrawingMode = false
          break
        case "draw-seats":
          canvas.selection = false
          canvas.defaultCursor = "crosshair"
          canvas.hoverCursor = "crosshair"
          canvas.isDrawingMode = false
          break
        case "draw-polygon":
          canvas.selection = false
          canvas.defaultCursor = "crosshair"
          canvas.hoverCursor = "crosshair"
          canvas.isDrawingMode = false
          break
        case "add-objects":
          canvas.selection = false
          canvas.defaultCursor = "copy"
          canvas.hoverCursor = "copy"
          canvas.isDrawingMode = false
          break
      }
      canvas.renderAll()
    }
    set({ activeTool: tool })
  },

  // Selection state
  selectedObjects: [],
  setSelectedObjects: (objects) => set({ selectedObjects: objects }),
  selectedCount: 0,
  setSelectedCount: (count) => set({ selectedCount: count }),
  activeSelection: null,
  setActiveSelection: (selection) => set({ activeSelection: selection }),

  // Inspector state
  inspectorType: "none",
  setInspectorType: (type) => set({ inspectorType: type }),

  // Drawing state
  isDrawing: false,
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  currentSeatType: "standard",
  setCurrentSeatType: (type) => set({ currentSeatType: type }),

  // Grid and snapping
  snapToGrid: true,
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  gridSize: 20,
  setGridSize: (size) => set({ gridSize: size }),

  // Canvas properties
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),

  // Map properties
  mapName: "Main Theater - Floor Plan",
  setMapName: (name) => set({ mapName: name }),

  // History
  history: [],
  historyIndex: -1,
  addToHistory: (state) => {
    const { history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(state)
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: true,
      canRedo: false,
    })
  },
  undo: () => {
    const { canvas, history, historyIndex } = get()
    if (canvas && historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll()
        set({
          historyIndex: historyIndex - 1,
          canUndo: historyIndex > 1,
          canRedo: true,
        })
      })
    }
  },
  redo: () => {
    const { canvas, history, historyIndex } = get()
    if (canvas && historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll()
        set({
          historyIndex: historyIndex + 1,
          canUndo: true,
          canRedo: historyIndex < history.length - 2,
        })
      })
    }
  },
  canUndo: false,
  canRedo: false,

  // Object update methods
  updateSelectedObject: (properties) => {
    const { canvas, activeSelection } = get()
    if (!canvas || !activeSelection) return

    // Update the object properties
    activeSelection.set(properties)

    // If it's a group, update the group and its objects
    if (activeSelection.type === "group" || activeSelection.type === "activeSelection") {
      const group = activeSelection as fabric.Group
      if (group.getObjects) {
        group.getObjects().forEach((obj: any) => {
          // Update specific properties that should cascade to children
          if (properties.fill && obj.type === "rect") {
            obj.set({ fill: properties.fill })
          }
        })
      }
    }

    activeSelection.setCoords()
    canvas.renderAll()

    // Add to history after a short delay to avoid too many history entries
    setTimeout(() => {
      get().addToHistory(JSON.stringify(canvas.toJSON()))
    }, 500)
  },

  updateSelectedObjects: (properties) => {
    const { canvas, selectedObjects } = get()
    if (!canvas || selectedObjects.length === 0) return

    selectedObjects.forEach((obj) => {
      obj.set(properties)
      obj.setCoords()
    })

    canvas.renderAll()

    // Add to history after a short delay
    setTimeout(() => {
      get().addToHistory(JSON.stringify(canvas.toJSON()))
    }, 500)
  },
}))
