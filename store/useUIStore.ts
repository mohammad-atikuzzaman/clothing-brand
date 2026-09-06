import { create } from "zustand";
import { Product } from "@/data/products";

interface UIStore {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  isAuthOpen: boolean;
  authDefaultTab: "login" | "register";
  openAuth: (tab?: "login" | "register") => void;
  closeAuth: () => void;

  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;

  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  isAuthOpen: false,
  authDefaultTab: "login",
  openAuth: (tab = "login") => set({ isAuthOpen: true, authDefaultTab: tab }),
  closeAuth: () => set({ isAuthOpen: false }),

  isSizeGuideOpen: false,
  openSizeGuide: () => set({ isSizeGuideOpen: true }),
  closeSizeGuide: () => set({ isSizeGuideOpen: false }),

  quickViewProduct: null,
  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),
}));
