import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './useProductStore';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  } | null;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    grandTotal: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (product, quantity = 1, size) => {
        set((state) => {
          const existingItemIdx = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedSize === size
          );

          let newItems = [...state.items];
          if (existingItemIdx > -1) {
            newItems[existingItemIdx] = {
              ...newItems[existingItemIdx],
              quantity: newItems[existingItemIdx].quantity + quantity,
            };
          } else {
            newItems.push({ product, quantity, selectedSize: size });
          }

          return { items: newItems };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedSize === size)
          ),
        }));
      },

      updateQuantity: (productId, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      applyCoupon: (code) => {
        const uppercaseCode = code.toUpperCase();
        if (uppercaseCode === 'GOLD10') {
          set({
            appliedCoupon: {
              code: 'GOLD10',
              discountType: 'percentage',
              discountValue: 10,
            },
          });
          return true;
        } else if (uppercaseCode === 'WELCOME5000') {
          set({
            appliedCoupon: {
              code: 'WELCOME5000',
              discountType: 'fixed',
              discountValue: 5000,
            },
          });
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      getTotals: () => {
        const { items, appliedCoupon } = get();
        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        let discount = 0;
        if (appliedCoupon) {
          if (appliedCoupon.discountType === 'percentage') {
            discount = subtotal * (appliedCoupon.discountValue / 100);
          } else if (appliedCoupon.discountType === 'fixed') {
            discount = Math.min(subtotal, appliedCoupon.discountValue);
          }
        }

        const discountedSubtotal = Math.max(0, subtotal - discount);
        const tax = Math.round(discountedSubtotal * 0.03); // 3% jewelry gst
        const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 500; // Free above 50k
        const grandTotal = discountedSubtotal + tax + shipping;

        return {
          subtotal,
          discount,
          tax,
          shipping,
          grandTotal,
        };
      },
    }),
    {
      name: 'zari-cart-storage',
    }
  )
);
