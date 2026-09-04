import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";

interface WishlistStore {
  items: Product[];
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isWishlistOpen: false,

      openWishlist: () => set({ isWishlistOpen: true }),
      closeWishlist: () => set({ isWishlistOpen: false }),

      toggleWishlist: (product) => {
        const current = get().items;
        const exists = current.some((p) => p.id === product.id);
        if (exists) {
          set({ items: current.filter((p) => p.id !== product.id) });
        } else {
          set({ items: [...current, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((p) => p.id !== productId) });
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "izhaan-wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
