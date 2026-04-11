import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/axios";

interface PreferencesState {
  // Settings
  theme: "light" | "dark" | "system";
  notifications: boolean;
  language: "en" | "fr" | "pt";

  // Loading states
  isSyncing: boolean;
  syncError: string | null;

  // Single action
  setPreferences: (
    updates: Partial<
      Omit<
        PreferencesState,
        | "isSyncing"
        | "syncError"
        | "setPreferences"
        | "fetchPreferences"
        | "syncToBackend"
      >
    >,
  ) => Promise<void>;
  fetchPreferences: () => Promise<void>;
  syncToBackend: (preferences: Partial<PreferencesState>) => Promise<void>;
  reset: () => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      // Default values
      theme: "system",
      notifications: true,
      language: "en",
      isSyncing: false,
      syncError: null,

      // Single setter for any preference
      setPreferences: async (updates) => {
        // Update local state
        set(updates);

        // Sync to backend (only the updated fields)
        await get().syncToBackend(updates);
      },

      // Fetch preferences from backend on login
      fetchPreferences: async () => {
        set({ isSyncing: true, syncError: null });
        try {
          const response = await api.get("/user/preferences");
          const { theme, notifications, language } = response.data;
          set({
            theme: theme || "system",
            notifications: notifications ?? true,
            language: language || "en",
            isSyncing: false,
          });
        } catch (error) {
          console.error("Failed to fetch preferences:", error);
          set({ syncError: "Failed to load preferences", isSyncing: false });
        }
      },

      // Sync to backend
      syncToBackend: async (preferences) => {
        try {
          await api.patch("/user/preferences", preferences);
        } catch (error) {
          console.error("Failed to sync preference:", error);
          throw error;
        }
      },

      // Reset all
      reset: async () => {
        const defaults: Partial<
          Omit<
            PreferencesState,
            | "isSyncing"
            | "syncError"
            | "setPreferences"
            | "fetchPreferences"
            | "syncToBackend"
          >
        > = {
          theme: "system",
          notifications: true,
          language: "en",
        };
        set(defaults);
        await get().syncToBackend(defaults);
      },
    }),
    {
      name: "andlet-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
