"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Palette, DollarSign } from "lucide-react"
import { useSeatMapStore, type SeatCategory } from "@/lib/store"

export function CategoriesModal() {
  const {
    seatCategories,
    addSeatCategory,
    updateSeatCategory,
    deleteSeatCategory,
    showCategoriesModal,
    setShowCategoriesModal,
  } = useSeatMapStore()

  const [editingCategory, setEditingCategory] = useState<SeatCategory | null>(null)
  const [isCreating, setIsCreating] = useState(false)
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
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
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

  const handleSave = () => {
    if (!formData.name.trim()) return

    if (isCreating) {
      const newCategory: SeatCategory = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        color: formData.color,
        price: formData.price,
        description: formData.description.trim(),
      }
      addSeatCategory(newCategory)
    } else if (editingCategory) {
      updateSeatCategory(editingCategory.id, {
        name: formData.name.trim(),
        color: formData.color,
        price: formData.price,
        description: formData.description.trim(),
      })
    }

    resetForm()
  }

  const handleDelete = (categoryId: string) => {
    if (seatCategories.length <= 1) {
      alert("Cannot delete the last category")
      return
    }

    if (confirm("Are you sure you want to delete this category?")) {
      deleteSeatCategory(categoryId)
    }
  }

  const handleClose = () => {
    resetForm()
    setShowCategoriesModal(false)
  }

  if (!showCategoriesModal) return null

  return (
    <Dialog open={showCategoriesModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Seat Categories
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Categories ({seatCategories.length})</h3>
              <Button size="sm" onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {seatCategories.map((category) => (
                  <Card key={category.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {category.price}
                            </Badge>
                          </div>
                          {category.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="h-6 w-6">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          disabled={seatCategories.length <= 1}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Edit Form */}
          <div>
            <h3 className="text-sm font-medium mb-4">
              {isCreating ? "Create Category" : editingCategory ? "Edit Category" : "Select a category to edit"}
            </h3>

            {(isCreating || editingCategory) && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category"
                    rows={3}
                  />
                </div>

                {/* Preview */}
                <div>
                  <Label>Preview</Label>
                  <Card className="p-3 mt-1">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: formData.color }}
                      />
                      <div>
                        <div className="font-medium text-sm">{formData.name || "Category Name"}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formData.price}
                        </Badge>
                      </div>
                    </div>
                    {formData.description && (
                      <p className="text-xs text-muted-foreground mt-2">{formData.description}</p>
                    )}
                  </Card>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={!formData.name.trim()}>
                    {isCreating ? "Create" : "Save"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
