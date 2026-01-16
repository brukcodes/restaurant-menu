import { useState, useEffect } from "react";
import { Settings, X, Search, Flame } from "lucide-react";
import { AdminPanel } from "../components/AdminPanel";
import { PasswordPrompt } from "../components/PasswordPrompt";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import defaultData from "../data/menudata";
import "./menu.css";

const STORAGE_KEY = "restaurantMenuData_v2";

const Menu = () => {
  const [menuData, setMenuData] = useState(defaultData);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMenuData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved menu data");
      }
    }
  }, []);

  const handleUpdateMenu = (newData) => {
    setMenuData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const handleAdminClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordPrompt(false);
    setShowAdminPanel(true);
  };

  const filteredCategories = () => {
    if (activeCategory === "all") {
      return Object.entries(menuData.categories);
    }
    return Object.entries(menuData.categories).filter(
      ([key]) => key === activeCategory,
    );
  };

  const searchFilteredItems = (items) => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const getSpiceIcons = (level) => {
    return Array(level)
      .fill(0)
      .map((_, i) => <Flame key={i} className="w-4 h-4 text-red-500 inline" />);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative h-[70vh] sm:h-screen w-full flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          src={menuData.restaurant.backgroundvideo}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center space-y-4 sm:space-y-6 px-4">
          <img
            src={menuData.restaurant.logo}
            alt="Logo"
            className="w-75 h-75 sm:w-82 sm:h-82 mx-auto rounded-full shadow-2xl animate-float"
          />

          <img
            src={menuData.restaurant.name}
            alt="Welcome"
            className="w-48 sm:w-64 mx-auto animate-float"
          />
        </div>
      </section>

      {/* Navigation - Mobile First */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/95 border-b border-border shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 px-4 py-3 min-w-max">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap text-sm touch-manipulation active:scale-95 ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              All
            </button>
            {Object.entries(menuData.categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap text-sm touch-manipulation active:scale-95 ${
                  activeCategory === key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Search Bar - Mobile Optimized */}
      <div className="container mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-4 text-base rounded-2xl shadow-sm touch-manipulation"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 touch-manipulation active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Grid - Mobile First */}
      <div className="container mx-auto px-4 pb-24 sm:pb-20">
        {filteredCategories().map(([categoryKey, category]) => {
          const items = searchFilteredItems(category.items);
          if (items.length === 0) return null;

          return (
            <section key={categoryKey} className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 px-1">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-card rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all shadow-sm touch-manipulation"
                  >
                    <div className="relative h-44 sm:h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold text-base sm:text-lg">
                            Unavailable
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="font-bold text-base sm:text-lg leading-tight">
                          {item.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className="text-primary font-bold text-base sm:text-lg block whitespace-nowrap">
                            {item.birrprice} Birr
                          </span>
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            ${item.price}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">
                          {item.prepTime}
                        </span>
                        <span className="flex gap-0.5">
                          {getSpiceIcons(item.spiceLevel)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Item Detail Modal - Mobile Optimized */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
          <div className="min-h-full flex items-end sm:items-center justify-center">
            <div className="bg-card w-full sm:rounded-3xl sm:max-w-2xl sm:my-8 overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300">
              <div className="relative">
                {selectedItem.video ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-56 sm:h-80 object-cover"
                    src={selectedItem.video}
                  />
                ) : (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-56 sm:h-80 object-cover"
                  />
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full active:scale-90 transition-transform touch-manipulation"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] sm:max-h-none overflow-y-auto">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                      {selectedItem.name}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      {getSpiceIcons(selectedItem.spiceLevel)}
                      {selectedItem.spiceLevel > 0 && (
                        <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                          Spice Level {selectedItem.spiceLevel}/3
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl sm:text-3xl font-bold text-primary whitespace-nowrap">
                      {selectedItem.birrprice} Birr
                    </div>
                    <div className="text-lg sm:text-xl text-muted-foreground">
                      ${selectedItem.price}
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 py-4 border-y border-border">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Prep Time
                    </div>
                    <div className="font-semibold text-sm sm:text-base">
                      {selectedItem.prepTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Calories
                    </div>
                    <div className="font-semibold text-sm sm:text-base">
                      {selectedItem.calories} cal
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-sm sm:text-base">
                    Ingredients
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {selectedItem.ingredients}
                  </p>
                </div>

                <div className="pb-2">
                  <h3 className="font-bold mb-2 text-sm sm:text-base">
                    Allergens
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {selectedItem.allergens}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Toggle Button - Mobile Optimized */}
      <button
        onClick={handleAdminClick}
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-full shadow-xl active:scale-95 transition-transform z-40 flex items-center justify-center touch-manipulation"
      >
        <Settings className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>

      {/* Password Prompt */}
      {showPasswordPrompt && (
        <PasswordPrompt
          onSuccess={handlePasswordSuccess}
          onCancel={() => setShowPasswordPrompt(false)}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          menuData={menuData}
          onUpdateMenu={handleUpdateMenu}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
      {/* Developer Section - Toggleable */}
      <div className="fixed bottom-6 left-6 z-40">
        {showDeveloperInfo ? (
          <div className="backdrop-blur-lg bg-background/85 border border-border shadow-lg rounded-xl px-4 py-3 text-xs sm:text-sm leading-tight space-y-1 animate-in fade-in duration-200">
            <div className="font-semibold">
              {menuData.restaurant.companyName || "OAKSAS"}
            </div>
            <div className="text-muted-foreground">
              {menuData.restaurant.companyEmail || "woldeamanelgetnet.com"}
            </div>
            <div className="text-muted-foreground">
              {menuData.restaurant.companyEmail || "bruckgetnet.com"}
            </div>

            <button
              onClick={() => setShowDeveloperInfo(false)}
              className="text-primary underline text-xs mt-1 hover:opacity-80 active:scale-95 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeveloperInfo(true)}
            className="backdrop-blur-lg bg-background/80 border border-border shadow-md rounded-full px-4 py-2 text-xs sm:text-sm font-medium active:scale-95 transition"
          >
            About
          </button>
        )}
      </div>
    </div>
  );
};

export default Menu;
