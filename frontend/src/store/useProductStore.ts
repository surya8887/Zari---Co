import { create } from 'zustand';
import api from '@/api/axios';

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'Rings' | 'Earrings' | 'Pendants' | 'Bangles' | 'Gifts' | 'Necklaces' | 'Bracelets' | 'Chains';
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  metalType: string; // Detailed description (e.g., "18K Yellow Gold")
  diamondWeight: string; // e.g. "0.5 Carat"
  certification: string; // e.g. "GIA Certified"
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  variants?: ProductVariant[];
  sku: string;

  // New E-Commerce filter metadata
  productType: 'Earrings' | 'Rings' | 'Necklaces' | 'Bracelets' | 'Bangles' | 'Pendants' | 'Chains';
  metal: 'Gold' | 'Diamond' | 'Silver' | 'Platinum' | 'Rose Gold';
  gender: 'Women' | 'Men' | 'Kids' | 'Unisex';
  offers: ('Discount' | 'New Arrival' | 'Best Seller' | 'Ready to Ship')[];
  occasion: ('Wedding' | 'Daily Wear' | 'Party Wear' | 'Gifting' | 'Engagement' | 'Anniversary')[];
  style: 'Classic' | 'Modern' | 'Traditional' | 'Minimal' | 'Luxury';
  design: 'Solitaire' | 'Floral' | 'Geometric' | 'Heart' | 'Pearl' | 'Gemstone';
}


interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: { id: string; name: string; slug: string; parentId?: string | null }[];
  selectedProduct: Product | null;
  isLoading: boolean;
  filters: {
    category: string;
    searchQuery: string;
    sort: 'price-asc' | 'price-desc' | 'rating' | 'newest';
    priceRange: [number, number];
    productTypes: string[];
    metals: string[];
    genders: string[];
    offers: string[];
    occasions: string[];
    styles: string[];
    designs: string[];
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSort: (sort: 'price-asc' | 'price-desc' | 'rating' | 'newest') => void;
  setPriceRange: (range: [number, number]) => void;
  setPage: (page: number) => void;
  toggleFilter: (key: keyof Omit<ProductState['filters'], 'category' | 'searchQuery' | 'sort' | 'priceRange'>, value: string) => void;
  setBulkFilters: (filters: Partial<ProductState['filters']>) => void;
  getProductBySlug: (slug: string) => Product | null;
  getProductById: (id: string) => Product | null;
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  resetFilters: () => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => {
  const applyFilters = (products: Product[], filters: ProductState['filters'], pagination: ProductState['pagination']) => {
    let result = [...products];

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    // Category / Top Level category filter
    const nonCategories = ['Collections', 'Try At Home', 'Bespoke', '10+1 Plan'];
    const activeCategoryLower = filters.category?.toLowerCase() || '';
    const isNonCategory = nonCategories.some(
      (nc) => nc.toLowerCase() === activeCategoryLower
    );
    if (filters.category && activeCategoryLower !== 'all' && !isNonCategory) {
      const selectedCategoryObj = get().categories.find(
        (c) => c.name.toLowerCase() === activeCategoryLower
      );
      if (selectedCategoryObj) {
        // Find all subcategories where parentId matches selectedCategoryObj.id
        const subCategoryNames = get().categories
          .filter((c) => (c.parentId || (c as any).parent_id) === selectedCategoryObj.id)
          .map((c) => c.name.toLowerCase());
        const allowedCategoriesLower = [selectedCategoryObj.name.toLowerCase(), ...subCategoryNames];
        result = result.filter((p) => allowedCategoriesLower.includes(p.category.toLowerCase()));
      } else {
        result = result.filter((p) => p.category.toLowerCase() === activeCategoryLower);
      }
    }

    // Price range filter
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Combinable Product Types filter
    if (filters.productTypes.length > 0) {
      result = result.filter((p) =>
        filters.productTypes.some(
          (type) =>
            p.productType.toLowerCase().includes(type.toLowerCase()) ||
            type.toLowerCase().includes(p.productType.toLowerCase())
        )
      );
    }

    // Combinable Metals filter
    if (filters.metals.length > 0) {
      result = result.filter((p) => filters.metals.includes(p.metal));
    }

    // Combinable Genders filter
    if (filters.genders.length > 0) {
      result = result.filter((p) => filters.genders.includes(p.gender));
    }

    // Combinable Offers filter (Product has at least one of selected offers)
    if (filters.offers.length > 0) {
      result = result.filter((p) => p.offers.some((off) => filters.offers.includes(off)));
    }

    // Combinable Occasions filter
    if (filters.occasions.length > 0) {
      result = result.filter((p) => p.occasion.some((occ) => filters.occasions.includes(occ)));
    }

    // Combinable Styles filter
    if (filters.styles.length > 0) {
      result = result.filter((p) => filters.styles.includes(p.style));
    }

    // Combinable Designs filter
    if (filters.designs.length > 0) {
      result = result.filter((p) => filters.designs.includes(p.design));
    }

    // Sorting logic
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'newest') {
      // Keep mock array order or slightly randomized
    }

    const totalPages = Math.max(1, Math.ceil(result.length / pagination.limit));

    // Slice for infinite scroll: show all products from start up to current page's limit
    const paginated = result.slice(0, pagination.page * pagination.limit);

    return {
      filteredProducts: paginated,
      pagination: {
        ...pagination,
        totalPages,
      },
    };
  };

  return {
    products: [],
    filteredProducts: [],
    categories: [],
    selectedProduct: null,
    isLoading: false,
    filters: {
      category: 'All',
      searchQuery: '',
      sort: 'newest',
      priceRange: [0, 300000],
      productTypes: [],
      metals: [],
      genders: [],
      offers: [],
      occasions: [],
      styles: [],
      designs: [],
    },
    pagination: {
      page: 1,
      limit: 6,
      totalPages: 1,
    },

    setCategory: (category) => {
      set((state) => {
        const nextFilters = { ...state.filters, category };
        const nextPagination = { ...state.pagination, page: 1 };
        const { filteredProducts, pagination } = applyFilters(state.products, nextFilters, nextPagination);
        return { filters: nextFilters, pagination, filteredProducts };
      });
    },

    setSearchQuery: (searchQuery) => {
      set((state) => {
        const nextFilters = { ...state.filters, searchQuery };
        const nextPagination = { ...state.pagination, page: 1 };
        const { filteredProducts, pagination } = applyFilters(state.products, nextFilters, nextPagination);
        return { filters: nextFilters, pagination, filteredProducts };
      });
    },

    setSort: (sort) => {
      set((state) => {
        const nextFilters = { ...state.filters, sort };
        const { filteredProducts, pagination } = applyFilters(state.products, nextFilters, state.pagination);
        return { filters: nextFilters, filteredProducts, pagination };
      });
    },

    setPriceRange: (priceRange) => {
      set((state) => {
        const nextFilters = { ...state.filters, priceRange };
        const nextPagination = { ...state.pagination, page: 1 };
        const { filteredProducts, pagination } = applyFilters(state.products, nextFilters, nextPagination);
        return { filters: nextFilters, pagination, filteredProducts };
      });
    },

    setPage: (page) => {
      set((state) => {
        const nextPagination = { ...state.pagination, page };
        const { filteredProducts, pagination } = applyFilters(state.products, state.filters, nextPagination);
        return { pagination, filteredProducts };
      });
    },

    toggleFilter: (key, value) => {
      set((state) => {
        const currentList = state.filters[key];
        const nextList = currentList.includes(value)
          ? currentList.filter((v) => v !== value)
          : [...currentList, value];

        const nextFilters = {
          ...state.filters,
          [key]: nextList,
        };
        const nextPagination = { ...state.pagination, page: 1 };
        const { filteredProducts, pagination } = applyFilters(state.products, nextFilters, nextPagination);
        return { filters: nextFilters, pagination, filteredProducts };
      });
    },

    setBulkFilters: (bulkInput) => {
      set((state) => {
        const nextFilters = {
          ...state.filters,
          ...bulkInput,
        };
        const nextPagination = { ...state.pagination, page: 1 };
        const { filteredProducts, pagination } = applyFilters(state.products, nextFilters, nextPagination);
        return { filters: nextFilters, pagination, filteredProducts };
      });
    },

    getProductBySlug: (slug) => {
      const p = get().products.find((prod) => prod.slug === slug) || null;
      set({ selectedProduct: p });
      return p;
    },

    getProductById: (id) => {
      const p = get().products.find((prod) => prod.id === id) || null;
      set({ selectedProduct: p });
      return p;
    },

    addReview: (productId, reviewInput) => {
      set((state) => {
        const updatedProducts = state.products.map((p) => {
          if (p.id !== productId) return p;

          const newReview: ProductReview = {
            id: `rev-${Date.now()}`,
            ...reviewInput,
            createdAt: new Date().toISOString().split('T')[0],
          };

          const newReviews = [newReview, ...p.reviews];
          const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = parseFloat((totalRating / newReviews.length).toFixed(1));

          return {
            ...p,
            reviews: newReviews,
            reviewsCount: newReviews.length,
            rating: newAvgRating,
          };
        });

        const nextState = { products: updatedProducts };
        const { filteredProducts, pagination } = applyFilters(updatedProducts, state.filters, state.pagination);
        
        let nextSelected = state.selectedProduct;
        if (nextSelected && nextSelected.id === productId) {
          nextSelected = updatedProducts.find((p) => p.id === productId) || null;
        }

        return {
          ...nextState,
          filteredProducts,
          pagination,
          selectedProduct: nextSelected,
        };
      });
    },

    resetFilters: () => {
      set((state) => {
        const resetFiltersState: ProductState['filters'] = {
          category: 'All',
          searchQuery: '',
          sort: 'newest',
          priceRange: [0, 300000],
          productTypes: [],
          metals: [],
          genders: [],
          offers: [],
          occasions: [],
          styles: [],
          designs: [],
        };
        const resetPagination: ProductState['pagination'] = {
          page: 1,
          limit: 6,
          totalPages: Math.max(1, Math.ceil(state.products.length / 6)),
        };
        const { filteredProducts, pagination } = applyFilters(state.products, resetFiltersState, resetPagination);
        return { filters: resetFiltersState, pagination, filteredProducts };
      });
    },

    fetchProducts: async () => {
      set({ isLoading: true });
      try {
        // Pre-fetch categories if not loaded yet to keep UI categories consistent
        if (get().categories.length === 0) {
          await get().fetchCategories();
        }

        const { data } = await api.get('/catalog/product?limit=100');
        const dbProducts = data.data.products || [];
        const mapped = dbProducts.map(mapBackendProductToFrontend);
        
        set((state) => {
          const { filteredProducts, pagination } = applyFilters(mapped, state.filters, {
            ...state.pagination,
            totalPages: Math.max(1, Math.ceil(mapped.length / state.pagination.limit))
          });
          return {
            products: mapped,
            filteredProducts,
            pagination,
            isLoading: false
          };
        });
      } catch (error) {
        console.error("Failed to fetch products:", error);
        set({ isLoading: false });
      }
    },

    fetchCategories: async () => {
      try {
        const { data } = await api.get('/catalog/category?limit=100');
        const dbCategories = data.data?.categories || [];
        set({ categories: dbCategories });
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    },
  };
});

const mapBackendProductToFrontend = (p: any): Product => {
  const primaryImg = p.images?.find((img: any) => img.isPrimary || img.is_primary)?.imageUrl || 
                     p.images?.find((img: any) => img.isPrimary || img.is_primary)?.image_url || 
                     p.images?.[0]?.imageUrl || 
                     p.images?.[0]?.image_url || 
                     '/images/gold_diamond_ring.png';
  const allImgs = p.images?.map((img: any) => img.imageUrl || img.image_url) || [primaryImg];
  
  const defaultVariant = p.variants?.find((v: any) => v.name === 'Default' || v.name === 'default') || p.variants?.[0];
  const attrs = defaultVariant?.attributes || {};

  const priceVal = parseFloat(p.basePrice || p.base_price || '0');
  const origPriceVal = parseFloat(attrs.originalPrice || priceVal * 1.2);

  const reviewsMapped = p.reviews?.map((r: any) => ({
    id: r.id,
    userName: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() || 'Anonymous' : r.userName || 'Anonymous',
    rating: r.rating,
    comment: r.body || r.comment || '',
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  })) || [];

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    category: p.category?.name || 'Rings',
    price: priceVal,
    originalPrice: origPriceVal,
    image: primaryImg,
    images: allImgs,
    metalType: attrs.metalType || '18K Yellow Gold',
    diamondWeight: attrs.diamondWeight || '0.50 Carat',
    certification: attrs.certification || 'BIS Hallmarked',
    rating: p.reviews?.length ? parseFloat((p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length).toFixed(1)) : 4.8,
    reviewsCount: p.reviews?.length || 0,
    reviews: reviewsMapped,
    sku: p.sku,
    variants: p.variants?.filter((v: any) => v.name !== 'Default' && v.name !== 'default')?.map((v: any) => ({
      id: v.id,
      name: v.name,
      price: parseFloat(v.priceOverride || v.price_override || priceVal),
      stock: v.inventory?.quantity || 10,
      sku: v.sku
    })) || [],
    // Filtering metadata
    productType: attrs.productType || p.category?.name || 'Rings',
    metal: attrs.metal || 'Gold',
    gender: attrs.gender || 'Women',
    offers: attrs.offers || ['New Arrival'],
    occasion: attrs.occasion || ['Daily Wear'],
    style: attrs.style || 'Classic',
    design: attrs.design || 'Solitaire'
  };
};
