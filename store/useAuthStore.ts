"use client";

import { create } from "zustand";
import { getCurrentUserAction } from "@/actions/auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasChecked: boolean;
  fetchUser: (force?: boolean) => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

let inFlightPromise: Promise<AuthUser | null> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  hasChecked: false,

  fetchUser: async (force = false) => {
    // If already checked and not forcing, return cached user with 0 network calls!
    if (get().hasChecked && !force) {
      return get().user;
    }

    if (inFlightPromise) {
      return inFlightPromise;
    }

    set({ isLoading: true });
    inFlightPromise = (async () => {
      try {
        const res = await getCurrentUserAction();
        set({ user: res.user, hasChecked: true, isLoading: false });
        return res.user;
      } catch {
        set({ user: null, hasChecked: true, isLoading: false });
        return null;
      } finally {
        inFlightPromise = null;
      }
    })();

    return inFlightPromise;
  },

  setUser: (user) => set({ user, hasChecked: true }),
  clearUser: () => set({ user: null, hasChecked: true }),
}));
