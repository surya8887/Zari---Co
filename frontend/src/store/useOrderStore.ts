import { create } from 'zustand';
import api from '@/api/axios';
import type { CartItem } from './useCartStore';
import type { Address } from './useAddressStore';
import { useAuthStore } from './useAuthStore';

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
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  fetchOrders: () => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>) => Promise<Order>;
  getOrderById: (id: string) => Order | null;
  setPage: (page: number) => void;
  clearOrders: () => void;
}

const mapBackendOrderToFrontend = (ord: any): Order => {
  const mappedItems = ord.items?.map((item: any) => {
    const prod = item.variant?.product;
    const primaryImg = prod?.images?.find((img: any) => img.isPrimary || img.is_primary)?.imageUrl || prod?.images?.[0]?.imageUrl || '/images/gold_diamond_ring.png';
    return {
      product: {
        id: prod?.id || '',
        name: prod?.name || '',
        slug: prod?.slug || '',
        description: prod?.description || '',
        price: parseFloat(item.unitPrice || '0'),
        image: primaryImg,
        images: prod?.images?.map((img: any) => img.imageUrl || img.image_url) || [primaryImg],
      },
      quantity: item.quantity,
      selectedSize: item.variant?.name === 'Default' || item.variant?.name === 'default' ? undefined : item.variant?.name
    };
  }) || [];

  const capitalizeStatus = (status: string) => {
    if (status === 'pending_payment') return 'Pending';
    if (status === 'payment_failed') return 'Cancelled';
    const s = status.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const user = useAuthStore.getState().user;

  return {
    id: ord.id,
    orderNumber: `ZARI-2026-${ord.id.slice(-4).toUpperCase()}`,
    status: capitalizeStatus(ord.status) as any,
    createdAt: new Date(ord.createdAt).toISOString().replace('T', ' ').substring(0, 16),
    paymentMethod: ord.paymentMethod || 'Credit Card',
    subtotal: parseFloat(ord.subtotal || '0'),
    discount: parseFloat(ord.discountTotal || '0'),
    tax: parseFloat(ord.taxTotal || '0'),
    shipping: parseFloat(ord.shippingTotal || '0'),
    grandTotal: parseFloat(ord.grandTotal || '0'),
    shippingAddress: {
      id: ord.address?.id || '',
      fullName: user ? `${user.firstName} ${user.lastName}`.trim() : 'Valued Customer',
      phone: user?.phone || '',
      addressLine1: ord.address?.line1 || '',
      addressLine2: ord.address?.line2 || undefined,
      city: ord.address?.city || '',
      state: ord.address?.state || '',
      zipCode: ord.address?.zipCode || '',
      country: ord.address?.countryCode === 'IN' ? 'India' : ord.address?.countryCode || '',
      isDefault: ord.address?.isDefault || false
    },
    items: mappedItems
  };
};

export const useOrderStore = create<OrderState>((set, get) => {
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
    orders: [],
    filteredOrders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 5,
      totalPages: 1,
    },

    fetchOrders: async () => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await api.get('/orders');
        const dbOrders = data.data || [];
        const mapped = dbOrders.map(mapBackendOrderToFrontend);
        
        set((state) => {
          const { filteredOrders, pagination } = applyPagination(mapped, 1, state.pagination.limit);
          return {
            orders: mapped,
            filteredOrders,
            pagination,
            isLoading: false
          };
        });
      } catch (err: any) {
        console.error('Failed to fetch orders:', err);
        set({ isLoading: false, error: err.message });
      }
    },

    placeOrder: async (orderInput) => {
      set({ isLoading: true, error: null });
      try {
        const payload = {
          addressId: orderInput.shippingAddress.id,
          paymentMethod: orderInput.paymentMethod,
          subtotal: orderInput.subtotal,
          discount: orderInput.discount,
          tax: orderInput.tax,
          shipping: orderInput.shipping,
          grandTotal: orderInput.grandTotal,
          items: orderInput.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize
          }))
        };

        const { data } = await api.post('/orders', payload);
        const newOrder = mapBackendOrderToFrontend({
          ...data.data,
          address: {
            id: orderInput.shippingAddress.id,
            line1: orderInput.shippingAddress.addressLine1,
            line2: orderInput.shippingAddress.addressLine2,
            city: orderInput.shippingAddress.city,
            state: orderInput.shippingAddress.state,
            zipCode: orderInput.shippingAddress.zipCode,
            countryCode: orderInput.shippingAddress.country === 'India' ? 'IN' : orderInput.shippingAddress.country.slice(0, 2).toUpperCase(),
            isDefault: orderInput.shippingAddress.isDefault
          },
          items: orderInput.items.map((item, idx) => ({
            id: `item-${idx}`,
            quantity: item.quantity,
            unitPrice: item.product.price,
            variant: {
              name: item.selectedSize || 'Default',
              product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                description: item.product.description,
                images: item.product.images?.map(img => ({ imageUrl: img }))
              }
            }
          }))
        });

        set((state) => {
          const nextOrders = [newOrder, ...state.orders];
          const { filteredOrders, pagination } = applyPagination(nextOrders, 1, state.pagination.limit);
          return {
            orders: nextOrders,
            filteredOrders,
            pagination,
            isLoading: false
          };
        });

        return newOrder;
      } catch (err: any) {
        console.error('Failed to place order:', err);
        set({ isLoading: false, error: err.message });
        throw err;
      }
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
});
