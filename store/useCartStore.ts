import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";
import { trackEvent } from "@/lib/fpixel";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export type ShippingArea = "inside_dhaka" | "outside_dhaka";

interface CartStore {
  items: CartItem[];
  shippingArea: ShippingArea;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setShippingArea: (area: ShippingArea) => void;

  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingArea: "inside_dhaka",
      isCartOpen: false,
      isCheckoutOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      setShippingArea: (area) => set({ shippingArea: area }),

      addItem: (product, size, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id && item.size === size
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [...currentItems, { product, size, quantity }],
          });
        }

        // Trigger Meta Pixel AddToCart
        try {
          trackEvent("AddToCart", {
            content_name: product.name,
            content_category: product.category,
            content_ids: [product.id],
            content_type: "product",
            value: (product.salePrice || product.regularPrice) * quantity,
            currency: "BDT",
          });
        } catch {
          // Non-blocking
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && item.size === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.salePrice * item.quantity,
          0
        );
      },

      getShippingCost: () => {
        if (get().items.length === 0) return 0;
        return get().shippingArea === "inside_dhaka" ? 70 : 130;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal + get().getShippingCost();
      },
    }),
    {
      name: "izhaan-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, shippingArea: state.shippingArea }),
    }
  )
);
