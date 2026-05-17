import { create } from 'zustand';

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
  category: 'Rings' | 'Earrings' | 'Pendants' | 'Bangles' | 'Gifts';
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  metalType: '18K Yellow Gold' | '18K White Gold' | '14K Rose Gold' | 'Platinum';
  diamondWeight: string; // e.g. "0.5 Carat", "1.2 Carat"
  certification: string; // e.g. "SGL Certified", "GIA Certified"
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  variants?: ProductVariant[];
  sku: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Starlight Solitaire Ring",
    slug: "starlight-solitaire-ring",
    description: "An iconic, classic design showcasing a brilliant-cut diamond of exceptional clarity set in solid 18k yellow gold.",
    category: "Rings",
    price: 45000,
    originalPrice: 52000,
    image: "/images/gold_diamond_ring.png",
    images: ["/images/gold_diamond_ring.png", "/images/gold_diamond_ring.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "0.50 Carat",
    certification: "GIA Certified",
    rating: 4.8,
    reviewsCount: 12,
    sku: "ZRI-RG-001",
    reviews: [
      { id: "rev-1", userName: "Aishwarya R.", rating: 5, comment: "Absolutely breathtaking! The diamond clarity is stunning.", createdAt: "2026-04-12" },
      { id: "rev-2", userName: "Priya S.", rating: 4, comment: "Perfect fit. Elegant styling, very comfortable to wear daily.", createdAt: "2026-05-02" }
    ],
    variants: [
      { id: "var-1-1", name: "Size 10", price: 45000, stock: 5, sku: "ZRI-RG-001-S10" },
      { id: "var-1-2", name: "Size 12", price: 45000, stock: 3, sku: "ZRI-RG-001-S12" }
    ]
  },
  {
    id: "prod-2",
    name: "Dewdrop Cascade Earrings",
    slug: "dewdrop-cascade-earrings",
    description: "Graceful drop earrings featuring a linear cascade of delicate round brilliant diamonds ending in a dramatic pear-cut centerpiece.",
    category: "Earrings",
    price: 68000,
    originalPrice: 79000,
    image: "/images/gold_drop_earrings.png",
    images: ["/images/gold_drop_earrings.png", "/images/gold_drop_earrings.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "0.85 Carat",
    certification: "SGL Certified",
    rating: 4.9,
    reviewsCount: 8,
    sku: "ZRI-ER-002",
    reviews: [
      { id: "rev-3", userName: "Meera K.", rating: 5, comment: "These are so light and sparkly! Got compliments all night.", createdAt: "2026-05-10" }
    ]
  },
  {
    id: "prod-3",
    name: "Aurelia Marquise Necklace",
    slug: "aurelia-marquise-necklace",
    description: "An intricate statement piece showing a garland of hand-carved marquise settings holding brilliant diamonds in 18k solid gold.",
    category: "Pendants",
    price: 245000,
    originalPrice: 275000,
    image: "/images/gold_necklace.png",
    images: ["/images/gold_necklace.png", "/images/gold_necklace.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "2.40 Carat",
    certification: "GIA Certified",
    rating: 5.0,
    reviewsCount: 4,
    sku: "ZRI-NC-003",
    reviews: [
      { id: "rev-4", userName: "Komal D.", rating: 5, comment: "A true masterpiece. Simply imperial packaging and delivery.", createdAt: "2026-03-24" }
    ]
  },
  {
    id: "prod-4",
    name: "Royal Stacked Bangles",
    slug: "royal-stacked-bangles",
    description: "A solid stack of classic bangle bands, meticulously micro-paved with rows of selected brilliant diamonds.",
    category: "Bangles",
    price: 189000,
    originalPrice: 210000,
    image: "/images/gold_bangles.png",
    images: ["/images/gold_bangles.png", "/images/gold_bangles.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "1.75 Carat",
    certification: "BIS Hallmarked",
    rating: 4.7,
    reviewsCount: 15,
    sku: "ZRI-BG-004",
    reviews: [
      { id: "rev-5", userName: "Sonia G.", rating: 4, comment: "Heavier than expected, but absolutely royal.", createdAt: "2026-02-15" }
    ]
  },
  {
    id: "prod-5",
    name: "Prism Halo Diamond Ring",
    slug: "prism-halo-diamond-ring",
    description: "An elegant cushion-cut diamond framed by a high-end halo of smaller brilliant diamonds in 18k white gold.",
    category: "Rings",
    price: 75000,
    originalPrice: 85000,
    image: "/images/gold_diamond_ring.png",
    images: ["/images/gold_diamond_ring.png"],
    metalType: "18K White Gold",
    diamondWeight: "0.75 Carat",
    certification: "GIA Certified",
    rating: 4.6,
    reviewsCount: 9,
    sku: "ZRI-RG-005",
    reviews: []
  },
  {
    id: "prod-6",
    name: "Aurelia Pearl Drop Pendants",
    slug: "aurelia-pearl-drop-pendants",
    description: "A gorgeous premium pendant set featuring a solitary south-sea pearl hanging from a loop of solid rose gold.",
    category: "Pendants",
    price: 32000,
    originalPrice: 38000,
    image: "/images/gold_necklace.png",
    images: ["/images/gold_necklace.png"],
    metalType: "14K Rose Gold",
    diamondWeight: "0.15 Carat",
    certification: "BIS Hallmarked",
    rating: 4.5,
    reviewsCount: 6,
    sku: "ZRI-PD-006",
    reviews: []
  },
  {
    id: "prod-7",
    name: "Classic Aurelia Gold Band",
    slug: "classic-aurelia-gold-band",
    description: "A clean, modern solid wedding band with soft rounded internal curves for supreme daily comfort.",
    category: "Rings",
    price: 18000,
    originalPrice: 22000,
    image: "/images/gold_diamond_ring.png",
    images: ["/images/gold_diamond_ring.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "0.00 Carat",
    certification: "BIS Hallmarked",
    rating: 4.9,
    reviewsCount: 22,
    sku: "ZRI-RG-007",
    reviews: []
  },
  {
    id: "prod-8",
    name: "Imperial Diamond Hoop Earrings",
    slug: "imperial-diamond-hoops",
    description: "Medium-sized classic golden hoops detailed with sparkling diamonds along both internal and external arcs.",
    category: "Earrings",
    price: 89000,
    originalPrice: 105000,
    image: "/images/gold_drop_earrings.png",
    images: ["/images/gold_drop_earrings.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "1.10 Carat",
    certification: "SGL Certified",
    rating: 4.8,
    reviewsCount: 11,
    sku: "ZRI-ER-008",
    reviews: []
  }
];

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  filters: {
    category: string;
    searchQuery: string;
    sort: 'price-asc' | 'price-desc' | 'rating' | 'newest';
    priceRange: [number, number];
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
  getProductBySlug: (slug: string) => Product | null;
  getProductById: (id: string) => Product | null;
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  resetFilters: () => void;
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

    // Category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range filter
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Sorting logic
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    const totalPages = Math.max(1, Math.ceil(result.length / pagination.limit));

    // Slice pagination
    const startIdx = (pagination.page - 1) * pagination.limit;
    const paginated = result.slice(startIdx, startIdx + pagination.limit);

    return {
      filteredProducts: paginated,
      pagination: {
        ...pagination,
        totalPages,
      },
    };
  };

  return {
    products: MOCK_PRODUCTS,
    filteredProducts: MOCK_PRODUCTS.slice(0, 8),
    selectedProduct: null,
    filters: {
      category: 'All',
      searchQuery: '',
      sort: 'newest',
      priceRange: [0, 300000],
    },
    pagination: {
      page: 1,
      limit: 6,
      totalPages: Math.ceil(MOCK_PRODUCTS.length / 6),
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
        };
        const resetPagination: ProductState['pagination'] = {
          page: 1,
          limit: 6,
          totalPages: Math.ceil(state.products.length / 6),
        };
        const { filteredProducts, pagination } = applyFilters(state.products, resetFiltersState, resetPagination);
        return { filters: resetFiltersState, pagination, filteredProducts };
      });
    },
  };
});
