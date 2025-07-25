"use client"

import { create } from "zustand"
import { fabric } from "fabric"

export interface SeatCategory {
  id: string
  name: string
  color: string
  price: number
  description?: string
}

export interface SeatData {
  seatNumber: string
  categoryId: string
  categoryName: string
  price: number
  isAvailable: boolean
  rowId?: string
}

export interface StageData {
  name: string
  width: number
  height: number
}

export interface TextData {
  content: string
  fontSize: number
  fontFamily: string
}

export interface RowData {
  id: string
  label: string
  seatCount: number
  numberingScheme: "numeric" | "alphabetic" | "alphanumeric"
  categoryId: string
}

export type ToolType = "select" | "seat" | "stage" | "text" | "curved-row" | "polygon" | "wall"

interface SeatMapState {
  // Canvas
  canvas: fabric.Canvas | null
  setCanvas: (canvas: fabric.Canvas | null) => void
  canvasState: string | null
  setCanvasState: (state: string) => void

  // Map metadata
  mapName: string
  setMapName: (name: string) => void

  // Tools
  activeTool: ToolType
  setActiveTool: (tool: ToolType) => void

  // Selection
  selectedObjects: fabric.Object[]
  setSelectedObjects: (objects: fabric.Object[]) => void
  selectedCount: number
  activeSelection: fabric.Object | null
  setActiveSelection: (selection: fabric.Object | null) => void

  // Categories
  seatCategories: SeatCategory[]
  addSeatCategory: (category: SeatCategory) => void
  updateSeatCategory: (id: string, updates: Partial<SeatCategory>) => void
  deleteSeatCategory: (id: string) => void

  // UI State
  showGrid: boolean
  setShowGrid: (show: boolean) => void
  showLayersPanel: boolean
  setShowLayersPanel: (show: boolean) => void
  showCategoriesModal: boolean
  setShowCategoriesModal: (show: boolean) => void

  // History
  history: string[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
  addToHistory: (state: string) => void
  undo: () => void
  redo: () => void

  // Zoom and Pan
  zoomLevel: number
  setZoomLevel: (zoom: number) => void
  zoom: number
  setZoom: (zoom: number) => void
  panX: number
  panY: number
  setPan: (x: number, y: number) => void

  // Snap settings
  snapToGrid: boolean
  setSnapToGrid: (snap: boolean) => void
  gridSize: number
  setGridSize: (size: number) => void

  // Object operations
  duplicateSelectedObjects: () => void
  deleteSelectedObjects: () => void
  groupSelectedObjects: () => void
  ungroupSelectedObjects: () => void
  alignObjects: (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => void
  updateSelectedObject: (properties: any) => void

  // Layers
  layers: fabric.Object[]
  setLayers: (layers: fabric.Object[]) => void
  toggleLayerVisibility: (object: fabric.Object) => void
  toggleLayerLock: (object: fabric.Object) => void

  // Drawing state
  isDrawing: boolean
  setIsDrawing: (drawing: boolean) => void
  currentPath: fabric.Path | null
  setCurrentPath: (path: fabric.Path | null) => void

  // Save/Load
  saveCanvasData: () => string
  loadCanvasData: (data: string) => void
}

export const useSeatMapStore = create<SeatMapState>((set, get) => ({
  // Canvas
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  canvasState: null,
  setCanvasState: (state) => set({ canvasState: state }),

  // Map metadata
  mapName: "Untitled Seat Map",
  setMapName: (name) => set({ mapName: name }),

  // Tools
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Selection
  selectedObjects: [],
  setSelectedObjects: (objects) =>
    set({
      selectedObjects: objects,
      selectedCount: objects.length,
    }),
  selectedCount: 0,
  activeSelection: null,
  setActiveSelection: (selection) => set({ activeSelection: selection }),

  // Categories
  seatCategories: [
    { id: "vip", name: "VIP Class", color: "#F59E0B", price: 35, description: "Premium seating with best view" },
    { id: "class-a", name: "Class A", color: "#06B6D4", price: 25, description: "Great seats with good view" },
    { id: "class-b", name: "Class B", color: "#EC4899", price: 15, description: "Standard seating" },
  ],

  addSeatCategory: (category) =>
    set((state) => ({
      seatCategories: [...state.seatCategories, category],
    })),

  updateSeatCategory: (id, updates) =>
    set((state) => ({
      seatCategories: state.seatCategories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
    })),

  deleteSeatCategory: (id) =>
    set((state) => ({
      seatCategories: state.seatCategories.filter((cat) => cat.id !== id),
    })),

  // UI State
  showGrid: true,
  setShowGrid: (show) => set({ showGrid: show }),
  showLayersPanel: false,
  setShowLayersPanel: (show) => set({ showLayersPanel: show }),
  showCategoriesModal: false,
  setShowCategoriesModal: (show) => set({ showCategoriesModal: show }),

  // History
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  addToHistory: (state) =>
    set((current) => {
      const newHistory = current.history.slice(0, current.historyIndex + 1)
      newHistory.push(state)
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      }
    }),

  undo: () => {
    const { canvas, history, historyIndex } = get()
    if (canvas && historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll()
        set({
          historyIndex: historyIndex - 1,
          canUndo: historyIndex - 1 > 0,
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
          canRedo: historyIndex + 1 < history.length - 1,
        })
      })
    }
  },

  // Zoom and Pan
  zoomLevel: 1,
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
  panX: 0,
  panY: 0,
  setPan: (x, y) => set({ panX: x, panY: y }),

  // Snap settings
  snapToGrid: true,
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  gridSize: 20,
  setGridSize: (size) => set({ gridSize: size }),

  // Object operations
  duplicateSelectedObjects: () => {
    const { canvas, selectedObjects, addToHistory } = get()
    if (!canvas || selectedObjects.length === 0) return

    selectedObjects.forEach((obj) => {
      obj.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
        })
        canvas.add(cloned)
      })
    })

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  },

  deleteSelectedObjects: () => {
    const { canvas, selectedObjects, addToHistory } = get()
    if (!canvas || selectedObjects.length === 0) return

    selectedObjects.forEach((obj) => {
      canvas.remove(obj)
    })

    set({ selectedObjects: [], selectedCount: 0 })
    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  },

  groupSelectedObjects: () => {
    const { canvas, selectedObjects, addToHistory } = get()
    if (!canvas || selectedObjects.length < 2) return

    const group = new fabric.Group(selectedObjects, {
      left: 0,
      top: 0,
    })

    selectedObjects.forEach((obj) => canvas.remove(obj))
    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  },

  ungroupSelectedObjects: () => {
    const { canvas, selectedObjects, addToHistory } = get()
    if (!canvas || selectedObjects.length !== 1) return

    const group = selectedObjects[0] as fabric.Group
    if (group.type !== "group") return

    const objects = group.getObjects()
    group.destroy()
    canvas.remove(group)

    objects.forEach((obj) => {
      canvas.add(obj)
    })

    canvas.renderAll()
    addToHistory(JSON.stringify(canvas.toJSON()))
  },

  alignObjects: (alignment) => {
    const { canvas, selectedObjects } = get()
    if (!canvas || selectedObjects.length < 2) return

    let minLeft = Number.POSITIVE_INFINITY
    let maxRight = Number.NEGATIVE_INFINITY
    let minTop = Number.POSITIVE_INFINITY
    let maxBottom = Number.NEGATIVE_INFINITY

    selectedObjects.forEach((obj) => {
      const bounds = obj.getBoundingRect()
      minLeft = Math.min(minLeft, bounds.left)
      maxRight = Math.max(maxRight, bounds.left + bounds.width)
      minTop = Math.min(minTop, bounds.top)
      maxBottom = Math.max(maxBottom, bounds.top + bounds.height)
    })

    selectedObjects.forEach((obj) => {
      const bounds = obj.getBoundingRect()

      switch (alignment) {
        case "left":
          obj.set({ left: minLeft })
          break
        case "center":
          obj.set({ left: minLeft + (maxRight - minLeft) / 2 - bounds.width / 2 })
          break
        case "right":
          obj.set({ left: maxRight - bounds.width })
          break
        case "top":
          obj.set({ top: minTop })
          break
        case "middle":
          obj.set({ top: minTop + (maxBottom - minTop) / 2 - bounds.height / 2 })
          break
        case "bottom":
          obj.set({ top: maxBottom - bounds.height })
          break
      }

      obj.setCoords()
    })

    canvas.renderAll()
  },

  updateSelectedObject: (properties) => {
    const { canvas, selectedObjects } = get()
    if (!canvas || selectedObjects.length !== 1) return

    const obj = selectedObjects[0]
    obj.set(properties)
    obj.setCoords()
    canvas.renderAll()
  },

  // Layers
  layers: [],
  setLayers: (layers) => set({ layers }),

  toggleLayerVisibility: (object) => {
    const { canvas } = get()
    if (!canvas) return

    object.set({ visible: !object.visible })
    canvas.renderAll()
  },

  toggleLayerLock: (object) => {
    object.set({
      selectable: !object.selectable,
      evented: !object.evented,
    })
  },

  // Drawing state
  isDrawing: false,
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  currentPath: null,
  setCurrentPath: (path) => set({ currentPath: path }),

  // Save/Load
  saveCanvasData: () => {
    const { canvas } = get()
    if (!canvas) return ""
    return JSON.stringify(canvas.toJSON())
  },

  loadCanvasData: (data) => {
    const { canvas } = get()
    if (!canvas || !data) return

    try {
      canvas.loadFromJSON(data, () => {
        canvas.renderAll()
      })
    } catch (error) {
      console.error("Failed to load canvas data:", error)
    }
  },
}))
