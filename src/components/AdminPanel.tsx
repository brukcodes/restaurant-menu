import { useState } from "react";
import { X, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ItemEditModal } from "./ItemEditModal";
import { MenuData, MenuItem } from "@/types/menu";

interface AdminPanelProps {
  menuData: MenuData;
  onUpdateMenu: (data: MenuData) => void;
  onClose: () => void;
}

export const AdminPanel = ({
  menuData,
  onUpdateMenu,
  onClose,
}: AdminPanelProps) => {
  const [editingData, setEditingData] = useState<MenuData>(
    JSON.parse(JSON.stringify(menuData)),
  );
  const [activeTab, setActiveTab] = useState<
    "items" | "categories" | "restaurant" | "settings"
  >("items");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", title: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleSaveChanges = () => {
    onUpdateMenu(editingData);
    onClose();
  };

  const handleAddItem = (categoryKey: string) => {
    const newItem: MenuItem = {
      id: Date.now(),
      name: "New Dish",
      price: 9.99,
      birrprice: 9.99,
      image: "",
      video: "",
      description: "Delicious new dish",
      available: true,
      spiceLevel: 1,
      calories: 300,
      prepTime: "10 mins",
      ingredients: "Fresh ingredients",
      allergens: "None",
    };

    setEditingData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryKey]: {
          ...prev.categories[categoryKey],
          items: [...prev.categories[categoryKey].items, newItem],
        },
      },
    }));
    setEditingItem(newItem);
  };

  const handleDeleteItem = (categoryKey: string, itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setEditingData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryKey]: {
          ...prev.categories[categoryKey],
          items: prev.categories[categoryKey].items.filter(
            (item) => item.id !== itemId,
          ),
        },
      },
    }));
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    const categoryKey = Object.keys(editingData.categories).find((key) =>
      editingData.categories[key].items.some(
        (item) => item.id === updatedItem.id,
      ),
    );

    if (categoryKey) {
      setEditingData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [categoryKey]: {
            ...prev.categories[categoryKey],
            items: prev.categories[categoryKey].items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            ),
          },
        },
      }));
    }
    setEditingItem(null);
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.title) {
      const categoryKey = newCategory.name.toLowerCase().replace(/\s+/g, "_");
      setEditingData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [categoryKey]: {
            title: newCategory.title,
            items: [],
          },
        },
      }));
      setNewCategory({ name: "", title: "" });
    }
  };

  const handleDeleteCategory = (categoryKey: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category and all its items?",
      )
    )
      return;

    const { [categoryKey]: deleted, ...remainingCategories } =
      editingData.categories;
    setEditingData((prev) => ({
      ...prev,
      categories: remainingCategories,
    }));
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordSuccess("");

    // Get current stored password
    const storedPassword =
      localStorage.getItem("adminPassword") || "chanoly2024";

    if (currentPassword !== storedPassword) {
      setPasswordError("Current password is incorrect");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Save new password
    localStorage.setItem("adminPassword", newPassword);
    setPasswordSuccess("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">
              🛠️ Restaurant Admin Panel
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex border-b border-gray-200 bg-gray-50">
            {[
              { key: "items", label: "Menu Items" },
              { key: "categories", label: "Categories" },
              { key: "restaurant", label: "Restaurant Info" },
              { key: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "items" && (
              <div className="space-y-6">
                {Object.entries(editingData.categories).map(
                  ([categoryKey, category]) => (
                    <div
                      key={categoryKey}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 flex items-center justify-between border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">
                          {category.title}
                        </h3>
                        <Button
                          onClick={() => handleAddItem(categoryKey)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Item
                        </Button>
                      </div>
                      <div className="p-4 space-y-2">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-primary font-semibold">
                                  ${item.price}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setEditingItem(item)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteItem(categoryKey, item.id)
                                }
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Add New Category
                  </h3>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Category name (e.g., desserts)"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="flex-1 bg-white text-gray-900 border-gray-300"
                    />
                    <Input
                      type="text"
                      placeholder="Display title (e.g., Sweet Desserts)"
                      value={newCategory.title}
                      onChange={(e) =>
                        setNewCategory((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="flex-1 bg-white text-gray-900 border-gray-300"
                    />
                    <Button
                      onClick={handleAddCategory}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Existing Categories
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(editingData.categories).map(
                      ([categoryKey, category]) => (
                        <div
                          key={categoryKey}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-semibold text-gray-900">
                              {category.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              ({categoryKey}) • {category.items.length} items
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDeleteCategory(categoryKey)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "restaurant" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Restaurant Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name
                  </label>
                  <Input
                    type="text"
                    value={editingData.restaurant.name}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        restaurant: {
                          ...prev.restaurant,
                          name: e.target.value,
                        },
                      }))
                    }
                    className="bg-gray-50 text-gray-900 border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <Input
                    type="text"
                    value={editingData.restaurant.logo}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        restaurant: {
                          ...prev.restaurant,
                          logo: e.target.value,
                        },
                      }))
                    }
                    className="bg-gray-50 text-gray-900 border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Place assets in public folder (e.g., /logo.png)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Video URL
                  </label>
                  <Input
                    type="text"
                    value={editingData.restaurant.backgroundvideo}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        restaurant: {
                          ...prev.restaurant,
                          backgroundvideo: e.target.value,
                        },
                      }))
                    }
                    className="bg-gray-50 text-gray-900 border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Place assets in public folder (e.g., /background.mp4)
                  </p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Change Admin Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>
                    {passwordError && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                        {passwordSuccess}
                      </div>
                    )}
                    <Button
                      onClick={handlePasswordChange}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {editingItem && (
        <ItemEditModal
          item={editingItem}
          onSave={handleUpdateItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
};
