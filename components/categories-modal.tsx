"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Palette } from "lucide-react"
import { useSeatMapStore } from "@/lib/store"
import type { SeatCategory } from "@/lib/store"

export function CategoriesModal() {
  const {
    showCategoriesModal,
    setShowCategoriesModal,
    seatCategories,
    addSeatCategory,
    updateSeatCategory,
    deleteSeatCategory,
  } = useSeatMapStore()

  const [editingCategory, setEditingCategory] = useState<SeatCategory | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    price: 50,
    description: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      color: "#3B82F6",
      price: 50,
      description: "",
    })
    setEditingCategory(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    if (editingCategory) {
      updateSeatCategory(editingCategory.id, formData)
    } else {
      const newCategory: SeatCategory = {
        id: Date.now().toString(),
        ...formData,
      }
      addSeatCategory(newCategory)
    }

    resetForm()
  }

  const handleEdit = (category: SeatCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      color: category.color,
      price: category.price,
      description: category.description || "",
    })
  }

  const handleDelete = (categoryId: string) => {
    if (seatCategories.length <= 1) {
      alert("You must have at least one seat category")
      return
    }
    deleteSeatCategory(categoryId)
  }

  const predefinedColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
    "#14B8A6",
    "#F43F5E",
  ]

  return (
    <Dialog open={showCategoriesModal} onOpenChange={setShowCategoriesModal}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Manage Seat Categories
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Categories List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Current Categories</h3>
              <Badge variant="outline">{seatCategories.length}</Badge>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {seatCategories.map((category) => (
                  <Card key={category.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-gray-500">${category.price}</p>
                            {category.description && (
                              <p className="text-xs text-gray-400 mt-1">{category.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(category.id)}
                            disabled={seatCategories.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator orientation="vertical" />

          {/* Add/Edit Form */}
          <div className="w-80">
            <h3 className="text-sm font-semibold mb-4">{editingCategory ? "Edit Category" : "Add New Category"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., VIP, Premium, Standard"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <div className="space-y-3">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10"
                  />

                  <div className="grid grid-cols-6 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  {editingCategory ? "Update" : "Add"} Category
                </Button>
                {editingCategory && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Preview</h4>
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: formData.color }}
                />
                <div>
                  <div className="font-medium">{formData.name || "Category Name"}</div>
                  <div className="text-sm text-gray-500">${formData.price}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setShowCategoriesModal(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
