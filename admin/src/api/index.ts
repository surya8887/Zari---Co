import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/v1";

// ==========================================
// Category Interfaces
// ==========================================
export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  isPublished: boolean;
  sortOrder: number;
}

// ==========================================
// Product Interfaces
// ==========================================
export interface DbProduct {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number | string; // Decimal from Prisma
  sku: string;
  isPublished: boolean;
}

export interface ClientProduct {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  sku: string;
  description: string;
  details: string;
  careInstructions: string;
  isPublished: boolean;
}

// ==========================================
// Mapping & Serialization Helpers
// ==========================================

// Parse GIA specs and care instructions from single description string
export const mapDbToClientProduct = (db: DbProduct): ClientProduct => {
  const fullDesc = db.description || "";
  const parts = fullDesc.split("<!--GIA-SPECS-->");
  const description = parts[0] || "";
  const remaining = parts[1] || "";
  const subparts = remaining.split("<!--CARE-GUIDES-->");
  const details = subparts[0] || "";
  const careInstructions = subparts[1] || "";

  return {
    id: db.id,
    categoryId: db.categoryId,
    name: db.name,
    price: Number(db.basePrice).toFixed(2),
    sku: db.sku,
    description,
    details,
    careInstructions,
    isPublished: db.isPublished
  };
};

// Merge client form fields into unified description column
export const mapClientToDbPayload = (client: Omit<ClientProduct, "id">) => {
  const description = `${client.description || ""}<!--GIA-SPECS-->${client.details || ""}<!--CARE-GUIDES-->${client.careInstructions || ""}`;
  return {
    name: client.name,
    categoryId: client.categoryId,
    description,
    basePrice: parseFloat(client.price) || 0.0,
    sku: client.sku,
    isPublished: client.isPublished,
    slug: client.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  };
};

// ==========================================
// API Handlers (Fetch-based)
// ==========================================

const fetchJson = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });

    const payload = await res.json();
    if (!res.ok) {
      throw new Error(payload.message || `API error (${res.status})`);
    }

    // Backend payload is wrapped in ApiResponse: { success: boolean, message: string, data: T }
    return payload.data as T;
  } catch (error) {
    console.error(`API Request to ${endpoint} failed:`, error);
    toast.error("Network Synchronisation Failed ✕", {
      description: error instanceof Error ? error.message : "Please check if local backend is active."
    });
    throw error;
  }
};

export const api = {
  // Category CRUD
  async getCategories(): Promise<Category[]> {
    interface GetCategoriesResponse {
      categories: Category[];
      pagination: unknown;
    }
    const data = await fetchJson<GetCategoriesResponse>("/catalog/category?limit=100");
    return data.categories || [];
  },

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    return fetchJson<Category>("/catalog/category", {
      method: "POST",
      body: JSON.stringify(category)
    });
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return fetchJson<Category>(`/catalog/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(category)
    });
  },

  async deleteCategory(id: string): Promise<Category> {
    return fetchJson<Category>(`/catalog/category/${id}`, {
      method: "DELETE"
    });
  },

  // Product CRUD
  async getProducts(): Promise<ClientProduct[]> {
    interface GetProductsResponse {
      products: DbProduct[];
      pagination: unknown;
    }
    const data = await fetchJson<GetProductsResponse>("/catalog/product?limit=100");
    const dbProducts = data.products || [];
    return dbProducts.map(mapDbToClientProduct);
  },

  async createProduct(product: Omit<ClientProduct, "id">): Promise<ClientProduct> {
    const payload = mapClientToDbPayload(product);
    const dbProd = await fetchJson<DbProduct>("/catalog/product", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return mapDbToClientProduct(dbProd);
  },

  async updateProduct(id: string, product: Partial<ClientProduct>): Promise<ClientProduct> {
    // If updating standard parameters, map client payload
    let payload: Partial<DbProduct> = {};
    
    if (product.name || product.price || product.sku || product.categoryId || product.description || product.details || product.careInstructions || product.isPublished !== undefined) {
      const fullProduct: Omit<ClientProduct, "id"> = {
        name: product.name || "",
        price: product.price || "0.0",
        sku: product.sku || "",
        categoryId: product.categoryId || "",
        description: product.description || "",
        details: product.details || "",
        careInstructions: product.careInstructions || "",
        isPublished: product.isPublished !== undefined ? product.isPublished : false
      };
      payload = mapClientToDbPayload(fullProduct);
    }

    const dbProd = await fetchJson<DbProduct>(`/catalog/product/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return mapDbToClientProduct(dbProd);
  },

  async deleteProduct(id: string): Promise<ClientProduct> {
    const dbProd = await fetchJson<DbProduct>(`/catalog/product/${id}`, {
      method: "DELETE"
    });
    return mapDbToClientProduct(dbProd);
  }
};
