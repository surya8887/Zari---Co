import { create } from "zustand";
import { api, type Category, type ClientProduct as Product, type ProductImage } from "@/api";
import { toast } from "sonner";

export interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  read: boolean;
  time: string;
}

export interface MessageItem {
  id: number;
  sender: string;
  avatar: string;
  text: string;
  read: boolean;
  time: string;
}

// Export the types so they're accessible throughout the app
export type { Category, Product, ProductImage };

interface AppStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: NotificationItem[];
  markNotificationsRead: () => void;
  messages: MessageItem[];
  markMessagesRead: () => void;
  
  // Categories Database & Actions
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, fields: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Product Catalog & Actions
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "images">) => Promise<Product | undefined>;
  updateProduct: (id: string, fields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Image Upload Management Actions
  uploadProductImages: (productId: string, files: File[]) => Promise<void>;
  deleteProductImage: (productId: string, imageId: string) => Promise<void>;
  setPrimaryImage: (productId: string, imageId: string) => Promise<void>;

  // Custom collections heritage story
  collectionStory: string;
  updateCollectionStory: (story: string) => void;
  
  // Inventory shipping parameters
  shippingNotes: string;
  updateShippingNotes: (notes: string) => void;
  
  // Database store initialization
  initStore: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
  
  currentPage: "dashboard",
  setCurrentPage: (page) => set({ currentPage: page }),
  
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  notifications: [
    {
      id: 1,
      title: "New Custom Order Ring Approval Required",
      desc: "A bespoke 18k Halo Diamond Ring requires design review.",
      read: false,
      time: "5m ago"
    },
    {
      id: 2,
      title: "Critical Low Stock Alert",
      desc: "Serenity Bracelet stock falls below threshold (2 items remaining).",
      read: false,
      time: "1h ago"
    },
    {
      id: 3,
      title: "High-Value Transaction Captured",
      desc: "Order #10982 ($1,850) successfully captured from Liam Chen.",
      read: true,
      time: "2h ago"
    }
  ],
  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  messages: [
    {
      id: 1,
      sender: "Emily R.",
      avatar: "ER",
      text: "Is the Elysian Diamond Ring available in size 6.5? I need to purchase it today.",
      read: false,
      time: "10m ago"
    },
    {
      id: 2,
      sender: "Marcus K.",
      avatar: "MK",
      text: "I would love to order custom engraving for the 18k Gold Hoop Earrings. Can we organize that?",
      read: true,
      time: "3h ago"
    },
    {
      id: 3,
      sender: "Liam Chen",
      avatar: "LC",
      text: "Please expedite shipping for the Serenity Bracelet order Honor #10982. Thank you!",
      read: true,
      time: "1d ago"
    }
  ],
  markMessagesRead: () => set((state) => ({
    messages: state.messages.map(m => ({ ...m, read: true }))
  })),

  categories: [],

  // Asynchronous API synchronization actions for Category
  addCategory: async (category) => {
    try {
      const created = await api.createCategory(category);
      set((state) => ({
        categories: [...state.categories, created]
      }));
      toast.success("Category Created Live ✦", {
        description: `Successfully added ${created.name} to database.`
      });
    } catch (error) {
      console.error("Failed to create category on backend:", error);
    }
  },

  updateCategory: async (id, fields) => {
    try {
      const updated = await api.updateCategory(id, fields);
      set((state) => ({
        categories: state.categories.map((c) => c.id === id ? { ...c, ...updated } : c)
      }));
      toast.success("Category Sync Successful ✦", {
        description: "Updates persistently written to database."
      });
    } catch (error) {
      console.error("Failed to update category on backend:", error);
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        // Relational safety: Fallback products referencing the deleted category to rings
        products: state.products.map((p) => p.categoryId === id ? { ...p, categoryId: "cat-rings" } : p)
      }));
      toast.success("Category Deleted Live ✦", {
        description: "Prisma relations successfully un-mapped."
      });
    } catch (error) {
      console.error("Failed to delete category on backend:", error);
    }
  },

  products: [],

  // Asynchronous API synchronization actions for Product
  addProduct: async (product) => {
    try {
      const created = await api.createProduct(product);
      set((state) => ({
        products: [...state.products, created]
      }));
      toast.success("Product Created Live ✦", {
        description: `Successfully added ${created.name} to catalog database.`
      });
      return created;
    } catch (error) {
      console.error("Failed to create product on backend:", error);
      return undefined;
    }
  },

  updateProduct: async (id, fields) => {
    try {
      const updated = await api.updateProduct(id, fields);
      set((state) => ({
        products: state.products.map((p) => p.id === id ? { ...p, ...updated } : p)
      }));
      toast.success("Product Sync Successful ✦", {
        description: "Updates persistently written to catalogue database."
      });
    } catch (error) {
      console.error("Failed to update product on backend:", error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      }));
      toast.success("Product Deleted Live ✦", {
        description: "Item successfully soft-deleted in database."
      });
    } catch (error) {
      console.error("Failed to delete product on backend:", error);
    }
  },

  // Image Upload Management Actions
  uploadProductImages: async (productId, files) => {
    try {
      const newImages = await api.uploadProductImages(productId, files);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId
            ? { ...p, images: [...p.images, ...newImages] }
            : p
        )
      }));
    } catch (error) {
      console.error("Failed to upload product images in store:", error);
    }
  },

  deleteProductImage: async (productId, imageId) => {
    try {
      await api.deleteProductImage(imageId);
      set((state) => ({
        products: state.products.map((p) => {
          if (p.id !== productId) return p;
          const updatedImages = p.images.filter((img) => img.id !== imageId);
          // Auto-promote first remaining sibling cover if we unlinked the primary thumbnail
          const deletedImg = p.images.find((img) => img.id === imageId);
          if (deletedImg?.isPrimary && updatedImages.length > 0) {
            updatedImages[0].isPrimary = true;
          }
          return { ...p, images: updatedImages };
        })
      }));
      toast.success("Image Deleted Successfully ✦", {
        description: "Physical file unlinked and database references drop."
      });
    } catch (error) {
      console.error("Failed to delete product image in store:", error);
    }
  },

  setPrimaryImage: async (productId, imageId) => {
    try {
      await api.setPrimaryImage(imageId);
      set((state) => ({
        products: state.products.map((p) => {
          if (p.id !== productId) return p;
          return {
            ...p,
            images: p.images.map((img) => ({
              ...img,
              isPrimary: img.id === imageId
            }))
          };
        })
      }));
      toast.success("Primary Cover Updated ✦", {
        description: "New catalog thumbnail designated."
      });
    } catch (error) {
      console.error("Failed to set primary image in store:", error);
    }
  },

  collectionStory: "<h3>Heritage of Aurélia Jewels</h3><p>Founded in Paris and re-imagined for global connoisseurs, <strong>Aurélia Jewels</strong> creates hand-crafted masterpieces. Every piece of jewelry tells a unique story of ancient volcanic formations, GIA-inspected luxury, and micro-precision craftsmanship.</p><p>We believe in pure structural beauty, sustainable recycled gold castings, and creating heirloom memories that transition elegantly across generations.</p>",
  updateCollectionStory: (story) => set({ collectionStory: story }),

  shippingNotes: "<h3>Premium Boutique Delivery System</h3><p>Every Aurélia Jewels dispatch features secure signature-required transit, fully insured under a global cargo policy. Packaging includes our leather jewelry case, GIA certification sheets, and clean gold polishing cloths.</p><h4>Returns Policy</h4><p>We provide a complimentary <strong>30-day window</strong> for exchanges and returns. Returned items must remain completely unworn with security seals and certificates intact.</p>",
  updateShippingNotes: (notes) => set({ shippingNotes: notes }),

  // Initialize and synchronise store with live backend PostgreSQL database
  initStore: async () => {
    try {
      const [categories, products] = await Promise.all([
        api.getCategories(),
        api.getProducts()
      ]);
      
      set({
        categories: categories || [],
        products: products || []
      });
      console.log("Database store synchronized successfully ✦");
    } catch (error) {
      console.warn("Could not sync with backend database. Fallback empty catalogs mounted.", error);
    }
  }
}));
