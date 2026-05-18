import { create } from "zustand";

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

// Category structure mapping backend Prisma schema
export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  isPublished: boolean;
  sortOrder: number;
}

// Product structure updated with UUID references and isPublished flag
export interface Product {
  id: number;
  categoryId: string; // Foreign key link to Category
  name: string;
  price: string;
  sku: string;
  description: string;
  details: string;
  careInstructions: string;
  isPublished: boolean; // Publish checkbox flag
}

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
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, fields: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Product Catalog & Actions
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, fields: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  
  // Custom collections heritage story
  collectionStory: string;
  updateCollectionStory: (story: string) => void;
  
  // Inventory shipping parameters
  shippingNotes: string;
  updateShippingNotes: (notes: string) => void;
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

  // Dynamic Categories Database mapping backend Prisma
  categories: [
    {
      id: "cat-rings",
      parentId: null,
      name: "Solitaire Rings",
      slug: "solitaire-rings",
      description: "<h3>Elite Solitaire Rings</h3><p>Perfectly micro-paved solid rings and bands featuring flawless brilliant-cut solitaire diamonds.</p>",
      isPublished: true,
      sortOrder: 1
    },
    {
      id: "cat-necklaces",
      parentId: null,
      name: "Halo Necklaces",
      slug: "halo-necklaces",
      description: "<h3>Royal Halo Necklaces</h3><p>Luxury necklaces framing natural blue sapphires and fine emerald gemstones.</p>",
      isPublished: true,
      sortOrder: 2
    },
    {
      id: "cat-earrings",
      parentId: null,
      name: "Classic Earrings",
      slug: "classic-earrings",
      description: "<h3>Timeless Gold Hoop Earrings</h3><p>Comfortable lightweight drop earrings and hoops polished to mirror gold finishes.</p>",
      isPublished: true,
      sortOrder: 3
    },
    {
      id: "cat-bracelets",
      parentId: null,
      name: "Bespoke Bracelets",
      slug: "bespoke-bracelets",
      description: "<h3>Elite Fine Bracelets</h3><p>Elite hand-crafted yellow gold chain links and classic diamond tennis bracelets.</p>",
      isPublished: true,
      sortOrder: 4
    }
  ],

  addCategory: (category) => set((state) => ({
    categories: [
      ...state.categories,
      { ...category, id: `cat-${Date.now().toString().slice(-4)}` }
    ]
  })),

  updateCategory: (id, fields) => set((state) => ({
    categories: state.categories.map((c) => c.id === id ? { ...c, ...fields } : c)
  })),

  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
    // Re-assign products pointing to this category to Rings to avoid broken relational bounds
    products: state.products.map((p) => p.categoryId === id ? { ...p, categoryId: "cat-rings" } : p)
  })),

  // Catalog products pointing to Category UUIDs and featuring the isPublished schema flag
  products: [
    {
      id: 1,
      categoryId: "cat-rings",
      name: "Elysian Diamond Ring",
      price: "28450.30",
      sku: "ELY-004",
      description: "<h3>The Epitome of Jewelry Brilliance</h3><p>An exquisite, micro-paved 18k yellow gold band featuring a spectacular <strong>brilliant-cut solitaire diamond</strong> centered in a classic four-prong gold crown.</p>",
      details: "<ul><li>GIA Certified Flawless D-Color Diamond.</li><li>1.8 Carat Solitaire center stone.</li><li>Total pave diamond weight of 0.45 Carats.</li><li>18k solid recycled yellow gold.</li></ul>",
      careInstructions: "<p>Avoid contact with strong abrasive household cleaners, lotions, and perfumes. Wash occasionally with warm soapy water and a ultra-soft micro-bristle jewelry brush.</p>",
      isPublished: true
    },
    {
      id: 2,
      categoryId: "cat-necklaces",
      name: "Sapphire Necklace",
      price: "13430.30",
      sku: "SAP-901",
      description: "<h3>Royal Sapphire Solitaire</h3><p>Capturing deep ocean depths, this solid 18k white gold pendant encapsulates a premium <strong>pear-shaped Royal Blue Sapphire</strong> surrounded by a delicate halo of premium micro-pearls.</p>",
      details: "<ul><li>Natural Heat-Treated Pear Blue Sapphire (1.2ct).</li><li>Micro pave white diamonds (0.15ct total).</li><li>18-inch solid white gold chain with secure lobster clasp.</li></ul>",
      careInstructions: "<p>Store flat in the provided velvet jewelry box to prevent white gold chain tangles. Clean with a dry microfiber cloth only.</p>",
      isPublished: true
    },
    {
      id: 3,
      categoryId: "cat-earrings",
      name: "Gold Hoop Earrings",
      price: "13850.00",
      sku: "GHO-115",
      description: "<h3>Timeless Gold Hoop Classics</h3><p>Polished to a flawless mirror finish, these hand-crafted 18k yellow gold hollow hoop earrings offer premium luxury shine with lightweight, comfortable day-to-day wearing weights.</p>",
      details: "<ul><li>18k heavy solid yellow gold casting.</li><li>Diameter: 35mm | Thickness: 3.5mm.</li><li>Integrated secure hinge-post closures.</li></ul>",
      careInstructions: "<p>Always remove gold hoops before sleeping or bathing to ensure hinge alignments remain pristine. Buff occasionally with the included gold polishing cloth.</p>",
      isPublished: true
    },
    {
      id: 4,
      categoryId: "cat-rings",
      name: "Halo Engagement Ring",
      price: "7980.00",
      sku: "HAL-202",
      description: "<h3>Bespoke Romance Re-imagined</h3><p>Celebrate pure love with our signature cushion-cut diamond centered inside a dazzling halo of round brilliant diamonds, set upon a micro-paved platinum band.</p>",
      details: "<ul><li>0.9 Carat Cushion-Cut center diamond.</li><li>Color: F | Clarity: VS1.</li><li>Solid Platinum-950 hypoallergenic alloy casting.</li></ul>",
      careInstructions: "<p>Bring to your nearest Aurélia Jewels boutique once a year for complimentary prong audits and professional ultra-sonic polishing.</p>",
      isPublished: false // Setup as a draft item for display comparison!
    }
  ],

  addProduct: (product) => set((state) => ({
    products: [
      ...state.products,
      { ...product, id: Date.now() }
    ]
  })),

  updateProduct: (id, fields) => set((state) => ({
    products: state.products.map((p) => p.id === id ? { ...p, ...fields } : p)
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id)
  })),

  collectionStory: "<h3>Heritage of Aurélia Jewels</h3><p>Founded in Paris and re-imagined for global connoisseurs, <strong>Aurélia Jewels</strong> creates hand-crafted masterpieces. Every piece of jewelry tells a unique story of ancient volcanic formations, GIA-inspected luxury, and micro-precision craftsmanship.</p><p>We believe in pure structural beauty, sustainable recycled gold castings, and creating heirloom memories that transition elegantly across generations.</p>",
  updateCollectionStory: (story) => set({ collectionStory: story }),

  shippingNotes: "<h3>Premium Boutique Delivery System</h3><p>Every Aurélia Jewels dispatch features secure signature-required transit, fully insured under a global cargo policy. Packaging includes our leather jewelry case, GIA certification sheets, and clean gold polishing cloths.</p><h4>Returns Policy</h4><p>We provide a complimentary <strong>30-day window</strong> for exchanges and returns. Returned items must remain completely unworn with security seals and certificates intact.</p>",
  updateShippingNotes: (notes) => set({ shippingNotes: notes })
}));
