import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './useCartStore';
import type { Address } from './useAddressStore';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  filteredOrders: Order[];
  selectedOrder: Order | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  placeOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>) => Order;
  getOrderById: (id: string) => Order | null;
  setPage: (page: number) => void;
  clearOrders: () => void;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ZARI-2026-9841",
    status: "Delivered",
    createdAt: "2026-05-10 14:32",
    paymentMethod: "Credit Card (Visa)",
    subtotal: 45000,
    discount: 0,
    tax: 1350,
    shipping: 0,
    grandTotal: 46350,
    shippingAddress: {
      id: "addr-1",
      fullName: "Surya Prakash",
      phone: "+91 9876543210",
      addressLine1: "12, Royal Heritage Enclave",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560041",
      country: "India",
      isDefault: true
    },
    items: [
      {
        product: {
          id: "prod-1",
          name: "Starlight Solitaire Ring",
          slug: "starlight-solitaire-ring",
          description: "An iconic, classic design showcasing a brilliant-cut diamond set in solid 18k yellow gold.",
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
          reviews: []
        },
        quantity: 1,
        selectedSize: "Size 12"
      }
    ]
  }
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => {
      const applyPagination = (orders: Order[], page: number, limit: number) => {
        const totalPages = Math.max(1, Math.ceil(orders.length / limit));
        const startIdx = (page - 1) * limit;
        const paginated = orders.slice(startIdx, startIdx + limit);
        return {
          filteredOrders: paginated,
          pagination: {
            page,
            limit,
            totalPages,
          },
        };
      };

      return {
        orders: MOCK_ORDERS,
        filteredOrders: MOCK_ORDERS,
        selectedOrder: null,
        pagination: {
          page: 1,
          limit: 5,
          totalPages: Math.ceil(MOCK_ORDERS.length / 5),
        },

        placeOrder: (orderInput) => {
          const id = `ord-${Date.now()}`;
          const orderNumber = `ZARI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
          
          const newOrder: Order = {
            ...orderInput,
            id,
            orderNumber,
            status: 'Confirmed',
            createdAt,
          };

          set((state) => {
            const nextOrders = [newOrder, ...state.orders];
            const { filteredOrders, pagination } = applyPagination(nextOrders, 1, state.pagination.limit);
            return {
              orders: nextOrders,
              filteredOrders,
              pagination,
            };
          });

          return newOrder;
        },

        getOrderById: (id) => {
          const ord = get().orders.find((o) => o.id === id) || null;
          set({ selectedOrder: ord });
          return ord;
        },

        setPage: (page) => {
          set((state) => {
            const { filteredOrders, pagination } = applyPagination(state.orders, page, state.pagination.limit);
            return { filteredOrders, pagination };
          });
        },

        clearOrders: () => {
          set({ orders: [], filteredOrders: [], selectedOrder: null });
        },
      };
    },
    {
      name: 'zari-orders-storage',
    }
  )
);
