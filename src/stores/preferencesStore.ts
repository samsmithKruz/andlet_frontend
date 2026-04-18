// src/stores/preferencesStore.ts

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

  // Actions
  setPreferences: (
    updates: Partial<
      Omit<
        PreferencesState,
        | "isSyncing"
        | "syncError"
        | "setPreferences"
        | "fetchPreferences"
        | "syncToBackend"
        | "reset"
        | "flushPendingSync"
      >
    >,
  ) => void; // Note: no longer async
  fetchPreferences: () => Promise<void>;
  flushPendingSync: () => Promise<void>;
  reset: () => void;
}

// Throttle configuration
const THROTTLE_MS = 2000; // 2 seconds
const MAX_BATCH_AGE_MS = 5000; // Force sync after 5 seconds even with continuous changes

// Global throttle state (outside store to survive re-renders)
let pendingChanges: Partial<PreferencesState> = {};
let throttleTimer: ReturnType<typeof setTimeout> | null = null;
let maxAgeTimer: ReturnType<typeof setTimeout> | null = null;
let syncPromise: Promise<void> | null = null;

const clearTimers = () => {
  if (throttleTimer) {
    clearTimeout(throttleTimer);
    throttleTimer = null;
  }
  if (maxAgeTimer) {
    clearTimeout(maxAgeTimer);
    maxAgeTimer = null;
  }
};

const scheduleSync = (syncFn: () => Promise<void>) => {
  // Clear existing throttle timer
  if (throttleTimer) {
    clearTimeout(throttleTimer);
  }

  // Set new throttle timer
  throttleTimer = setTimeout(async () => {
    throttleTimer = null;
    await syncFn();
  }, THROTTLE_MS);

  // Set max age timer if not already set (ensures sync eventually happens)
  if (!maxAgeTimer) {
    maxAgeTimer = setTimeout(async () => {
      maxAgeTimer = null;
      if (throttleTimer) {
        clearTimeout(throttleTimer);
        throttleTimer = null;
      }
      await syncFn();
    }, MAX_BATCH_AGE_MS);
  }
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      // Default values
      theme: "system",
      notifications: true,
      language: "en",
      isSyncing: false,
      syncError: null,

      setPreferences: (updates) => {
        // 1. Immediately update local state (optimistic)
        set(updates);

        // 2. Accumulate pending changes
        Object.assign(pendingChanges, updates);

        // 3. Schedule the sync
        const syncFn = async () => {
          // Capture current pending changes and clear
          const changesToSync = { ...pendingChanges };
          pendingChanges = {};

          // Only sync if there are actual changes
          if (Object.keys(changesToSync).length === 0) return;

          // If already syncing, queue this batch for after
          if (syncPromise) {
            await syncPromise;
          }

          set({ isSyncing: true, syncError: null });

          syncPromise = (async () => {
            try {
              await api.patch("/user/preferences", changesToSync);
              set({ isSyncing: false });
            } catch (error) {
              console.error("Failed to sync preferences:", error);
              set({
                syncError: "Failed to sync preferences",
                isSyncing: false,
              });

              // On failure, merge back into pending for retry
              Object.assign(pendingChanges, changesToSync);

              throw error;
            } finally {
              syncPromise = null;
              clearTimers();
            }
          })();

          return syncPromise;
        };

        scheduleSync(syncFn);
      },

      flushPendingSync: async () => {
        // Force immediate sync of any pending changes
        clearTimers();

        if (Object.keys(pendingChanges).length === 0) return;

        const changesToSync = { ...pendingChanges };
        pendingChanges = {};

        set({ isSyncing: true });
        try {
          await api.patch("/user/preferences", changesToSync);
        } catch (error) {
          // Merge back on failure
          Object.assign(pendingChanges, changesToSync);
          throw error;
        } finally {
          set({ isSyncing: false });
        }
      },

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

      reset: () => {
        clearTimers();
        pendingChanges = {};

        const defaults = {
          theme: "system" as const,
          notifications: true,
          language: "en" as const,
        };

        set(defaults);

        // Sync reset immediately (no throttle)
        api.patch("/user/preferences", defaults).catch(console.error);
      },
    }),
    {
      name: "andlet-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Optional: Auto-flush on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (Object.keys(pendingChanges).length > 0) {
      // Use sendBeacon for reliable delivery during page unload
      const blob = new Blob([JSON.stringify(pendingChanges)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/user/preferences", blob);
    }
  });
}
