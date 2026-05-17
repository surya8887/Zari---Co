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
    images: ["/images/gold_diamond_ring.png"],
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
    ],
    productType: "Rings",
    metal: "Gold",
    gender: "Women",
    offers: ["New Arrival", "Best Seller"],
    occasion: ["Engagement", "Anniversary", "Wedding"],
    style: "Luxury",
    design: "Solitaire"
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
    images: ["/images/gold_drop_earrings.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "0.85 Carat",
    certification: "SGL Certified",
    rating: 4.9,
    reviewsCount: 8,
    sku: "ZRI-ER-002",
    reviews: [
      { id: "rev-3", userName: "Meera K.", rating: 5, comment: "These are so light and sparkly! Got compliments all night.", createdAt: "2026-05-10" }
    ],
    productType: "Earrings",
    metal: "Diamond",
    gender: "Women",
    offers: ["Discount"],
    occasion: ["Party Wear", "Anniversary"],
    style: "Modern",
    design: "Gemstone"
  },
  {
    id: "prod-3",
    name: "Aurelia Marquise Necklace",
    slug: "aurelia-marquise-necklace",
    description: "An intricate statement piece showing a garland of hand-carved marquise settings holding brilliant diamonds in 18k solid gold.",
    category: "Necklaces",
    price: 245000,
    originalPrice: 275000,
    image: "/images/gold_necklace.png",
    images: ["/images/gold_necklace.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "2.40 Carat",
    certification: "GIA Certified",
    rating: 5.0,
    reviewsCount: 4,
    sku: "ZRI-NC-003",
    reviews: [
      { id: "rev-4", userName: "Komal D.", rating: 5, comment: "A true masterpiece. Simply imperial packaging and delivery.", createdAt: "2026-03-24" }
    ],
    productType: "Necklaces",
    metal: "Gold",
    gender: "Women",
    offers: ["Best Seller"],
    occasion: ["Wedding"],
    style: "Traditional",
    design: "Floral"
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
    images: ["/images/gold_bangles.png"],
    metalType: "18K Yellow Gold",
    diamondWeight: "1.75 Carat",
    certification: "BIS Hallmarked",
    rating: 4.7,
    reviewsCount: 15,
    sku: "ZRI-BG-004",
    reviews: [
      { id: "rev-5", userName: "Sonia G.", rating: 4, comment: "Heavier than expected, but absolutely royal.", createdAt: "2026-02-15" }
    ],
    productType: "Bangles",
    metal: "Gold",
    gender: "Women",
    offers: ["Ready to Ship"],
    occasion: ["Wedding", "Anniversary"],
    style: "Luxury",
    design: "Geometric"
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
    reviews: [],
    productType: "Rings",
    metal: "Diamond",
    gender: "Women",
    offers: ["Discount"],
    occasion: ["Engagement", "Party Wear"],
    style: "Modern",
    design: "Geometric"
  },
  {
    id: "prod-6",
    name: "Aurelia Pearl Drop Pendant",
    slug: "aurelia-pearl-drop-pendant",
    description: "A gorgeous premium pendant featuring a solitary south-sea pearl hanging from a loop of solid rose gold.",
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
    reviews: [],
    productType: "Pendants",
    metal: "Rose Gold",
    gender: "Women",
    offers: ["New Arrival"],
    occasion: ["Daily Wear", "Gifting"],
    style: "Minimal",
    design: "Pearl"
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
    reviews: [],
    productType: "Rings",
    metal: "Gold",
    gender: "Unisex",
    offers: ["Ready to Ship"],
    occasion: ["Daily Wear", "Wedding"],
    style: "Classic",
    design: "Solitaire"
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
    reviews: [],
    productType: "Earrings",
    metal: "Diamond",
    gender: "Women",
    offers: ["Best Seller"],
    occasion: ["Party Wear", "Gifting"],
    style: "Luxury",
    design: "Geometric"
  },
  {
    id: "prod-9",
    name: "Aurelia Men's Gold Chain",
    slug: "aurelia-mens-gold-chain",
    description: "A classic heavy solid gold link chain meticulously crafted to give a polished high-end luxury shine.",
    category: "Chains",
    price: 28000,
    originalPrice: 32000,
    image: "/images/gold_necklace.png",
    images: ["/images/gold_necklace.png"],
    metalType: "22K Yellow Gold",
    diamondWeight: "0.00 Carat",
    certification: "BIS Hallmarked",
    rating: 4.6,
    reviewsCount: 3,
    sku: "ZRI-CH-009",
    reviews: [],
    productType: "Chains",
    metal: "Gold",
    gender: "Men",
    offers: ["Ready to Ship"],
    occasion: ["Daily Wear"],
    style: "Classic",
    design: "Geometric"
  },
  {
    id: "prod-10",
    name: "Royal Diamond Tennis Bracelet",
    slug: "royal-diamond-tennis-bracelet",
    description: "A breathtaking linear band of hand-selected round brilliant diamonds set in pristine solid platinum settings.",
    category: "Bracelets",
    price: 155000,
    originalPrice: 175000,
    image: "/images/gold_bangles.png",
    images: ["/images/gold_bangles.png"],
    metalType: "Platinum 950",
    diamondWeight: "3.20 Carat",
    certification: "GIA Certified",
    rating: 5.0,
    reviewsCount: 7,
    sku: "ZRI-BR-010",
    reviews: [],
    productType: "Bracelets",
    metal: "Platinum",
    gender: "Women",
    offers: ["Best Seller", "New Arrival"],
    occasion: ["Anniversary", "Party Wear"],
    style: "Luxury",
    design: "Solitaire"
  },
  {
    id: "prod-11",
    name: "Golden Heart Kids Ring",
    slug: "golden-heart-kids-ring",
    description: "A light, polished rose gold heart ring, perfectly curved for comfort and safety of kids.",
    category: "Gifts",
    price: 9500,
    originalPrice: 12000,
    image: "/images/gold_diamond_ring.png",
    images: ["/images/gold_diamond_ring.png"],
    metalType: "14K Rose Gold",
    diamondWeight: "0.02 Carat",
    certification: "BIS Hallmarked",
    rating: 4.8,
    reviewsCount: 14,
    sku: "ZRI-RG-011",
    reviews: [],
    productType: "Rings",
    metal: "Rose Gold",
    gender: "Kids",
    offers: ["Discount"],
    occasion: ["Gifting"],
    style: "Minimal",
    design: "Heart"
  },
  {
    id: "prod-12",
    name: "Imperial Blue Sapphire Pendant",
    slug: "imperial-blue-sapphire-pendant",
    description: "A gorgeous modern pendant featuring a deep blue oval cut gemstone framed by a cluster of micro-paved diamonds.",
    category: "Pendants",
    price: 42000,
    originalPrice: 48000,
    image: "/images/gold_necklace.png",
    images: ["/images/gold_necklace.png"],
    metalType: "18K White Gold",
    diamondWeight: "0.45 Carat",
    certification: "GIA Certified",
    rating: 4.9,
    reviewsCount: 5,
    sku: "ZRI-PD-012",
    reviews: [],
    productType: "Pendants",
    metal: "Diamond",
    gender: "Women",
    offers: ["New Arrival"],
    occasion: ["Party Wear", "Gifting"],
    style: "Modern",
    design: "Gemstone"
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
    if (filters.category && filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range filter
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Combinable Product Types filter
    if (filters.productTypes.length > 0) {
      result = result.filter((p) => filters.productTypes.includes(p.productType));
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
    filteredProducts: MOCK_PRODUCTS.slice(0, 6),
    selectedProduct: null,
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
          totalPages: Math.ceil(state.products.length / 6),
        };
        const { filteredProducts, pagination } = applyFilters(state.products, resetFiltersState, resetPagination);
        return { filters: resetFiltersState, pagination, filteredProducts };
      });
    },
  };
});
