import { fabric } from "fabric"

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

export function createSeat(x: number, y: number, seatType: keyof typeof SEAT_COLORS, label: string) {
  const seatColor = SEAT_COLORS[seatType]
  const seatPrice = SEAT_PRICES[seatType]

  // Create seat rectangle
  const seat = new fabric.Rect({
    left: 0,
    top: 0,
    width: 24,
    height: 24,
    fill: seatColor,
    stroke: "#ffffff",
    strokeWidth: 1,
    rx: 4,
    ry: 4,
  })

  // Create seat label
  const seatLabel = new fabric.Text(label, {
    left: 12,
    top: 12,
    fontSize: 8,
    fill: "white",
    textAlign: "center",
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  })

  // Group seat and label
  const seatGroup = new fabric.Group([seat, seatLabel], {
    left: x,
    top: y,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })

  // Add custom properties
  ;(seatGroup as any).objectType = "seat"
  ;(seatGroup as any).seatType = seatType
  ;(seatGroup as any).label = label
  ;(seatGroup as any).price = seatPrice
  ;(seatGroup as any).isAvailable = true
  ;(seatGroup as any).category = seatType
  ;(seatGroup as any).id = `seat-${label}-${Date.now()}`

  return seatGroup
}

export function createStage(x: number, y: number, width = 300, height = 80) {
  // Create stage rectangle
  const stage = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height,
    fill: "#7c3aed",
    stroke: "#a855f7",
    strokeWidth: 2,
    rx: 8,
    ry: 8,
  })

  // Create stage label
  const stageLabel = new fabric.Text("STAGE", {
    left: width / 2,
    top: height / 2,
    fontSize: 18,
    fill: "white",
    fontWeight: "bold",
    textAlign: "center",
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  })

  // Group stage and label
  const stageGroup = new fabric.Group([stage, stageLabel], {
    left: x,
    top: y,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })

  // Add custom properties
  ;(stageGroup as any).objectType = "stage"
  ;(stageGroup as any).label = "STAGE"
  ;(stageGroup as any).stageType = "main"
  ;(stageGroup as any).id = `stage-${Date.now()}`

  return stageGroup
}

export function createDoor(x: number, y: number, width = 60, height = 20) {
  // Create door rectangle
  const door = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height,
    fill: "#ef4444",
    stroke: "#dc2626",
    strokeWidth: 2,
    rx: 4,
    ry: 4,
  })

  // Create door label
  const doorLabel = new fabric.Text("EXIT", {
    left: width / 2,
    top: height / 2,
    fontSize: 10,
    fill: "white",
    fontWeight: "bold",
    textAlign: "center",
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  })

  // Group door and label
  const doorGroup = new fabric.Group([door, doorLabel], {
    left: x,
    top: y,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })

  // Add custom properties
  ;(doorGroup as any).objectType = "door"
  ;(doorGroup as any).label = "EXIT"
  ;(doorGroup as any).doorType = "exit"
  ;(doorGroup as any).isEmergency = false
  ;(doorGroup as any).id = `door-${Date.now()}`

  return doorGroup
}

export function createTextLabel(x: number, y: number, text = "Text") {
  const textObject = new fabric.Text(text, {
    left: x,
    top: y,
    fontSize: 16,
    fill: "#ffffff",
    fontFamily: "Arial",
    selectable: true,
    hasControls: true,
    hasBorders: true,
  })

  // Add custom properties
  ;(textObject as any).objectType = "text"
  ;(textObject as any).id = `text-${Date.now()}`

  return textObject
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

export function addGrid(canvas: fabric.Canvas, gridSize: number) {
  // Remove existing grid lines
  const existingGrid = canvas.getObjects().filter((obj: any) => obj.isGrid)
  existingGrid.forEach((obj) => canvas.remove(obj))

  const width = canvas.getWidth()
  const height = canvas.getHeight()

  // Vertical lines
  for (let i = 0; i <= width / gridSize; i++) {
    const line = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
      stroke: "rgba(75, 85, 99, 0.3)",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    })
    ;(line as any).isGrid = true
    canvas.add(line)
    canvas.sendToBack(line)
  }

  // Horizontal lines
  for (let i = 0; i <= height / gridSize; i++) {
    const line = new fabric.Line([0, i * gridSize, width, i * gridSize], {
      stroke: "rgba(75, 85, 99, 0.3)",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    })
    ;(line as any).isGrid = true
    canvas.add(line)
    canvas.sendToBack(line)
  }
}

export function getObjectType(obj: fabric.Object): string {
  return (obj as any).objectType || obj.type || "object"
}

export function updateObjectColor(obj: fabric.Object, color: string) {
  if (obj.type === "group") {
    const group = obj as fabric.Group
    const objects = group.getObjects()
    objects.forEach((child) => {
      if (child.type === "rect") {
        child.set({ fill: color })
      }
    })
  } else {
    obj.set({ fill: color })
  }
}
