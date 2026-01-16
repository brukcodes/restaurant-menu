export interface MenuItem {
  id: number;
  name: string;
  price: number;
  birrprice: number;
  video: string;
  image: string;
  description: string;
  available: boolean;
  spiceLevel: number;
  calories: number;
  prepTime: string;
  ingredients: string;
  allergens: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface Restaurant {
  name: string;
  logo: string;
  backgroundvideo: string;
}

export interface MenuData {
  restaurant: Restaurant;
  categories: Record<string, MenuCategory>;
}
