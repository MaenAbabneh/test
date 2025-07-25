import { fabric } from "fabric"
import type { SeatData, StageData, TextData, RowData, SeatCategory } from "./store"

export const SEAT_COLORS = {
  standard: "#3b82f6", // Blue
  vip: "#f59e0b", // Amber
  wheelchair: "#10b981", // Emerald
  premium: "#8b5cf6", // Violet
}

export const SEAT_PRICES = {
  standard: 50,
  vip: 150,
  wheelchair: 50,
  premium: 100,
}

// Enhanced seat creation with better styling
export function createSeat(x: number, y: number, category: SeatCategory): fabric.Circle {
  const seat = new fabric.Circle({
    left: x,
    top: y,
    radius: 15,
    fill: category.color,
    stroke: "#333",
    strokeWidth: 2,
    selectable: true,
    hasControls: true,
    hasBorders: true,
    originX: "center",
    originY: "center",
  })

  // Add seat data
  ;(seat as any).seatData = {
    seatNumber: "",
    categoryId: category.id,
    categoryName: category.name,
    price: category.price,
    isAvailable: true,
  } as SeatData

  return seat
}

// Create curved row of seats
export function createCurvedRow(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  seatCount: number,
  category: SeatCategory,
): fabric.Group {
  const seats: fabric.Circle[] = []
  const angleStep = (endAngle - startAngle) / (seatCount - 1)

  for (let i = 0; i < seatCount; i++) {
    const angle = startAngle + i * angleStep
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    const seat = createSeat(x, y, category)
    ;(seat as any).seatData.seatNumber = `${i + 1}`
    seats.push(seat)
  }

  const group = new fabric.Group(seats, {
    left: centerX,
    top: centerY,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })

  // Add row data
  ;(group as any).rowData = {
    id: Date.now().toString(),
    label: "Curved Row",
    seatCount,
    numberingScheme: "numeric" as const,
    categoryId: category.id,
  } as RowData

  return group
}

// Create stage with enhanced styling
export function createStage(x: number, y: number, width = 200, height = 60): fabric.Rect {
  const stage = new fabric.Rect({
    left: x,
    top: y,
    width,
    height,
    fill: "#8B5CF6",
    stroke: "#6D28D9",
    strokeWidth: 2,
    selectable: true,
    hasControls: true,
    hasBorders: true,
    originX: "center",
    originY: "center",
  })

  // Add stage data
  ;(stage as any).stageData = {
    name: "Stage",
    width,
    height,
  } as StageData

  return stage
}

// Create wall/barrier
export function createWall(points: number[]): fabric.Line {
  const [x1, y1, x2, y2] = points

  const wall = new fabric.Line([x1, y1, x2, y2], {
    stroke: "#64748B",
    strokeWidth: 4,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })
  ;(wall as any).wallData = {
    type: "wall",
    points,
  }

  return wall
}

// Create text label with enhanced styling
export function createText(x: number, y: number, text = "Text"): fabric.Text {
  const textObj = new fabric.Text(text, {
    left: x,
    top: y,
    fontSize: 16,
    fontFamily: "Arial",
    fill: "#333",
    selectable: true,
    hasControls: true,
    hasBorders: true,
    originX: "center",
    originY: "center",
  })

  // Add text data
  ;(textObj as any).textData = {
    content: text,
    fontSize: 16,
    fontFamily: "Arial",
  } as TextData

  return textObj
}

// Create polygon
export function createPolygon(points: fabric.Point[]): fabric.Polygon {
  const polygon = new fabric.Polygon(points, {
    fill: "rgba(59, 130, 246, 0.3)",
    stroke: "#3B82F6",
    strokeWidth: 2,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })
  ;(polygon as any).polygonData = {
    type: "polygon",
    points,
  }

  return polygon
}

// Grid utilities
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

export function addGrid(canvas: fabric.Canvas, gridSize: number) {
  // Remove existing grid
  const objects = canvas.getObjects()
  objects.forEach((obj) => {
    if ((obj as any).isGrid) {
      canvas.remove(obj)
    }
  })

  const canvasWidth = canvas.getWidth()
  const canvasHeight = canvas.getHeight()

  // Create vertical lines
  for (let i = 0; i <= canvasWidth; i += gridSize) {
    const line = new fabric.Line([i, 0, i, canvasHeight], {
      stroke: "#e5e7eb",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
    })
    ;(line as any).isGrid = true
    canvas.add(line)
  }

  // Create horizontal lines
  for (let i = 0; i <= canvasHeight; i += gridSize) {
    const line = new fabric.Line([0, i, canvasWidth, i], {
      stroke: "#e5e7eb",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
    })
    ;(line as any).isGrid = true
    canvas.add(line)
  }

  // Send grid to back
  canvas.sendToBack(...canvas.getObjects().filter((obj) => (obj as any).isGrid))
}

// Object type detection
export function getObjectType(obj: fabric.Object): string {
  if ((obj as any).seatData) return "seat"
  if ((obj as any).stageData) return "stage"
  if ((obj as any).textData) return "text"
  if ((obj as any).rowData) return "row"
  if ((obj as any).wallData) return "wall"
  if ((obj as any).polygonData) return "polygon"
  return obj.type || "object"
}

// Auto-numbering utilities
export function generateSeatNumber(
  scheme: "numeric" | "alphabetic" | "alphanumeric",
  index: number,
  rowLabel?: string,
): string {
  switch (scheme) {
    case "numeric":
      return `${rowLabel || ""}${index + 1}`
    case "alphabetic":
      return `${rowLabel || ""}${String.fromCharCode(65 + (index % 26))}`
    case "alphanumeric":
      const letter = String.fromCharCode(65 + Math.floor(index / 10))
      const number = (index % 10) + 1
      return `${rowLabel || ""}${letter}${number}`
    default:
      return `${rowLabel || ""}${index + 1}`
  }
}

// Color utilities
export function updateObjectColor(obj: fabric.Object, color: string) {
  if (obj.type === "group") {
    const group = obj as fabric.Group
    const objects = group.getObjects()
    objects.forEach((child) => {
      if (child.type === "rect" || child.type === "circle") {
        child.set({ fill: color })
      }
    })
  } else {
    obj.set({ fill: color })
  }
}

// Export utilities
export function exportCanvasAsImage(canvas: fabric.Canvas, format: "png" | "jpeg" = "png"): string {
  return canvas.toDataURL({
    format,
    quality: 1,
    multiplier: 2,
  })
}

export function exportCanvasAsJSON(canvas: fabric.Canvas): string {
  return JSON.stringify(canvas.toJSON())
}

export function importCanvasFromJSON(canvas: fabric.Canvas, json: string): Promise<void> {
  return new Promise((resolve) => {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll()
      resolve()
    })
  })
}

export function getObjectBounds(obj: fabric.Object) {
  return obj.getBoundingRect()
}

export function isPointInObject(point: fabric.Point, obj: fabric.Object): boolean {
  const bounds = obj.getBoundingRect()
  return (
    point.x >= bounds.left &&
    point.x <= bounds.left + bounds.width &&
    point.y >= bounds.top &&
    point.y <= bounds.top + bounds.height
  )
}
