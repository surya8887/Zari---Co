import { 
  type Category, 
  type ClientProduct as Product, 
  type ProductImage,
  type InventoryItem,
  type InventoryPayload,
  type InventoryUpdatePayload
} from "@/api";

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

export type { Category, Product, ProductImage, InventoryItem };

export interface UISlice {
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
}

export interface CategorySlice {
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, fields: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export interface ProductSlice {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "images">) => Promise<Product | undefined>;
  updateProduct: (id: string, fields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadProductImages: (productId: string, files: File[]) => Promise<void>;
  deleteProductImage: (productId: string, imageId: string) => Promise<void>;
  setPrimaryImage: (productId: string, imageId: string) => Promise<void>;
}

export interface SettingsSlice {
  collectionStory: string;
  updateCollectionStory: (story: string) => void;
  shippingNotes: string;
  updateShippingNotes: (notes: string) => void;
}

export interface InventorySlice {
  inventory: InventoryItem[];
  inventoryPagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  isLoadingInventory: boolean;
  fetchInventory: (params?: {
    page?: number;
    limit?: number;
    productId?: string;
    variantId?: string;
    lowStockOnly?: boolean;
  }) => Promise<void>;
  initializeStock: (payload: InventoryPayload) => Promise<void>;
  adjustStock: (id: string, payload: InventoryUpdatePayload) => Promise<void>;
  deleteStock: (id: string) => Promise<void>;
}

export interface AppStore extends UISlice, CategorySlice, ProductSlice, SettingsSlice, InventorySlice {
  initStore: () => Promise<void>;
}
