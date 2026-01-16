import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MediaUpload } from "./MediaUpload";
import { MenuItem } from "@/types/menu";

interface ItemEditModalProps {
  item: MenuItem;
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}

export const ItemEditModal = ({
  item,
  onSave,
  onClose,
}: ItemEditModalProps) => {
  const [editedItem, setEditedItem] = useState<MenuItem>({ ...item });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(editedItem);
  };

  const updateField = <K extends keyof MenuItem>(
    field: K,
    value: MenuItem[K],
  ) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[4000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-900">Edit Menu Item</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <Input
                type="text"
                value={editedItem.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                className="bg-gray-50 text-gray-900 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={editedItem.price}
                onChange={(e) =>
                  updateField("price", parseFloat(e.target.value))
                }
                required
                className="bg-gray-50 text-gray-900 border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spice Level (0-3)
              </label>
              <Input
                type="number"
                min="0"
                max="3"
                value={editedItem.spiceLevel}
                onChange={(e) =>
                  updateField("spiceLevel", parseInt(e.target.value))
                }
                className="bg-gray-50 text-gray-900 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories
              </label>
              <Input
                type="number"
                value={editedItem.calories}
                onChange={(e) =>
                  updateField("calories", parseInt(e.target.value))
                }
                className="bg-gray-50 text-gray-900 border-gray-300"
              />
            </div>
          </div>

          <MediaUpload
            type="image"
            value={editedItem.image}
            onChange={(value) => updateField("image", value)}
            label="Menu Image (for menu cards)"
          />

          <MediaUpload
            type="video"
            value={editedItem.video}
            onChange={(value) => updateField("video", value)}
            label="Detail Video (for detail view)"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={editedItem.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className="bg-gray-50 text-gray-900 border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time
              </label>
              <Input
                type="text"
                value={editedItem.prepTime}
                onChange={(e) => updateField("prepTime", e.target.value)}
                placeholder="e.g., 15 mins"
                className="bg-gray-50 text-gray-900 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergens
              </label>
              <Input
                type="text"
                value={editedItem.allergens}
                onChange={(e) => updateField("allergens", e.target.value)}
                placeholder="e.g., Gluten, Eggs"
                className="bg-gray-50 text-gray-900 border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <Input
              type="text"
              value={editedItem.ingredients}
              onChange={(e) => updateField("ingredients", e.target.value)}
              className="bg-gray-50 text-gray-900 border-gray-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={editedItem.available}
              onChange={(e) => updateField("available", e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label
              htmlFor="available"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Available for order
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Save Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
