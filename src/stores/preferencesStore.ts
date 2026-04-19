import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { backgroundQueue } from "@/lib/queue/backgroundQueue";

interface PreferencesState {
  // Settings
  theme: "light" | "dark" | "system";
  notifications: boolean;
  language: "en" | "fr" | "pt";

  // Loading states
  isSyncing: boolean;
  syncError: string | null;
  pendingChanges: number; // Number of changes waiting to sync

  // Actions
  setPreferences: (
    updates: Partial<
      Omit<
        PreferencesState,
        | "isSyncing"
        | "syncError"
        | "pendingChanges"
        | "setPreferences"
        | "fetchPreferences"
        | "reset"
      >
    >,
  ) => void;
  fetchPreferences: () => Promise<void>;
  reset: () => void;
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
      pendingChanges: 0,

      setPreferences: (updates) => {
        // 1. Immediately update local state (optimistic)
        set(updates);

        // 2. Queue the change for background sync
        set({ pendingChanges: get().pendingChanges + 1 });

        backgroundQueue
          .add("preference-update", updates, { maxRetries: 3 })
          .then(() => {
            set({
              pendingChanges: Math.max(0, get().pendingChanges - 1),
              syncError: null,
            });
          })
          .catch((error) => {
            console.error("Failed to sync preferences:", error);
            set({
              syncError:
                "Some changes couldn't be saved. Will retry when online.",
            });
            // pendingChanges remains - it will retry
          });
      },

      fetchPreferences: async () => {
        set({ isSyncing: true, syncError: null });
        try {
          // This could also use background queue, but fetch is read-only
          // and should happen immediately if online
          const result = await backgroundQueue.add(
            "preference-fetch",
            {},
            { maxRetries: 1 },
          );

          const { theme, notifications, language } = result;
          set({
            theme: theme || "system",
            notifications: notifications ?? true,
            language: language || "en",
            isSyncing: false,
          });
        } catch (error) {
          console.error("Failed to fetch preferences:", error);
          set({
            syncError: "Failed to load preferences. Working offline.",
            isSyncing: false,
          });
          // Keep existing preferences from localStorage
        }
      },

      reset: () => {
        const defaults = {
          theme: "system" as const,
          notifications: true,
          language: "en" as const,
        };

        set(defaults);
        set({ pendingChanges: get().pendingChanges + 1 });

        backgroundQueue
          .add("preference-update", defaults, { maxRetries: 3 })
          .then(() => {
            set({
              pendingChanges: Math.max(0, get().pendingChanges - 1),
              syncError: null,
            });
          })
          .catch((error) => {
            console.error("Failed to reset preferences:", error);
            set({
              syncError: "Reset couldn't be saved. Will retry when online.",
            });
          });
      },
    }),
    {
      name: "andlet-preferences",
      storage: createJSONStorage(() => localStorage),
      // Don't persist loading states
      partialize: (state) => ({
        theme: state.theme,
        notifications: state.notifications,
        language: state.language,
      }),
    },
  ),
);
