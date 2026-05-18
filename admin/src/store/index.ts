import { create } from "zustand";
import { 
  type AppStore, 
  type Category, 
  type Product, 
  type ProductImage, 
  type NotificationItem, 
  type MessageItem 
} from "./types";
import { createUISlice } from "./slices/uiSlice";
import { createCategorySlice } from "./slices/categorySlice";
import { createProductSlice } from "./slices/productSlice";
import { createSettingsSlice } from "./slices/settingsSlice";
import { createInventorySlice } from "./slices/inventorySlice";
import { api } from "@/api";

// Re-export all model types so previous files can import them transparently
export type { Category, Product, ProductImage, NotificationItem, MessageItem };

export const useAppStore = create<AppStore>((set, get, store) => ({
  ...createUISlice(set, get, store),
  ...createCategorySlice(set, get, store),
  ...createProductSlice(set, get, store),
  ...createSettingsSlice(set, get, store),
  ...createInventorySlice(set, get, store),

  // Initialize and synchronise store with live backend PostgreSQL database
  initStore: async () => {
    try {
      const [categories, products, inventoryData] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getInventory({ limit: 100 })
      ]);
      
      set({
        categories: categories || [],
        products: products || [],
        inventory: inventoryData?.inventory || []
      });
      console.log("Database store synchronized successfully ✦");
    } catch (error) {
      console.warn("Could not sync with backend database. Fallback empty catalogs mounted.", error);
    }
  }
}));
