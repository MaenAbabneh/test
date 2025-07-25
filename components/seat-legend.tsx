"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SeatType {
  id: string
  name: string
  price: string
  color: string
}

const seatTypes: SeatType[] = [
  {
    id: "vip",
    name: "VIP Seating",
    price: "$150",
    color: "bg-purple-500",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$100",
    color: "bg-blue-500",
  },
  {
    id: "standard",
    name: "Standard",
    price: "$75",
    color: "bg-green-500",
  },
  {
    id: "economy",
    name: "Economy",
    price: "$50",
    color: "bg-yellow-500",
  },
  {
    id: "accessible",
    name: "Accessible",
    price: "$75",
    color: "bg-orange-500",
  },
]

export function SeatLegend() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Seat Legend & Prices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {seatTypes.map((seatType) => (
          <div key={seatType.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded ${seatType.color} flex-shrink-0`}
                aria-label={`${seatType.name} color indicator`}
              />
              <span className="text-sm font-medium">{seatType.name}</span>
            </div>
            <span className="text-sm font-semibold text-primary">{seatType.price}</span>
          </div>
        ))}

        {/* Additional legend items */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-muted-foreground rounded flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-400 rounded flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Unavailable</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
