import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: "agent" | "seeker" | "admin";
  handle?: string;
}

interface Subscription {
  plan: string;
  features: string[];
  expires_at?: string;
}

interface AuthState {
  // State
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  permissions: string[];
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Computed
  allFeatures: string[];

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  refreshTokens: () => Promise<void>;
  setPermissions: (permissions: string[]) => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasFeature: (feature: string) => boolean;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      accessToken: null,
      refreshToken: null,
      user: null,
      permissions: [],
      subscription: null,
      isAuthenticated: false,
      isLoading: false,

      // Computed getter
      get allFeatures(): string[] {
        const { permissions, subscription } = get();
        const subscriptionFeatures = subscription?.features || [];
        return [...permissions, ...subscriptionFeatures];
      },

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/login", { email, password });
          if (response.status !== 200) throw new Error("Login failed");

          const {
            access_token,
            refresh_token,
            user,
            permissions,
            subscription,
          } = response.data;

          set({
            accessToken: access_token,
            refreshToken: refresh_token,
            user: user,
            permissions: permissions || [],
            subscription: subscription || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          permissions: [],
          subscription: null,
          isAuthenticated: false,
        });
        // Clear any cached queries
        queryClient.clear();
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      refreshTokens: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          throw new Error("No refresh token available");
        }

        try {
          const response = await api.post("/api/refresh", {
            refresh_token: refreshToken,
          });

          if (response.status !== 200) throw new Error("Refresh failed");

          const { access_token, refresh_token, permissions, subscription } =
            response.data;

          set({
            accessToken: access_token,
            refreshToken: refresh_token,
            permissions: permissions || get().permissions,
            subscription: subscription || get().subscription,
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setPermissions: (permissions: string[]) => {
        set({ permissions });
      },

      hasPermission: (permission: string): boolean => {
        const { user } = get();
        // Admin has all permissions
        if (user?.role === "admin") return true;
        return get().permissions.includes(permission);
      },

      hasAnyPermission: (requiredPermissions: string[]): boolean => {
        const { user } = get();
        if (user?.role === "admin") return true;
        return requiredPermissions.some((p) => get().permissions.includes(p));
      },

      hasAllPermissions: (requiredPermissions: string[]): boolean => {
        const { user } = get();
        if (user?.role === "admin") return true;
        return requiredPermissions.every((p) => get().permissions.includes(p));
      },

      hasFeature: (feature: string): boolean => {
        const { user } = get();
        // Admin has all features
        if (user?.role === "admin") return true;
        return get().allFeatures.includes(feature);
      },

      hydrate: () => {
        // Load persisted state from storage
        const persisted = localStorage.getItem("auth-storage");
        if (persisted) {
          const parsed = JSON.parse(persisted);
          if (parsed.state?.accessToken) {
            set({
              accessToken: parsed.state.accessToken,
              refreshToken: parsed.state.refreshToken,
              user: parsed.state.user,
              isAuthenticated: true,
              permissions: parsed.state.permissions || [],
              subscription: parsed.state.subscription || null,
            });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        permissions: state.permissions,
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
