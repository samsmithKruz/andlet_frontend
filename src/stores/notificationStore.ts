import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  id: string;
  type: "hunter_match" | "inspection_update" | "message" | "system" | "listing" | string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: state.notifications.filter((n) => n.id !== id && !n.read)
            .length,
        }));
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      fetchNotifications: async () => {
        // TODO: Replace with actual API call
        // const response = await api.get('/notifications');
        // const data = await response.data;
        // set({ notifications: data, unreadCount: data.filter(n => !n.read).length });

        // Mock data for testing
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "hunter_match",
            title: "New property match!",
            message: "A new 3-bedroom flat in Lekki matches your hunt.",
            read: false,
            createdAt: new Date(),
          },
          {
            id: "2",
            type: "inspection_update",
            title: "Inspection scheduled",
            message: "Your inspection for property #123 has been confirmed.",
            read: false,
            createdAt: new Date(),
          },
        ];

        set({
          notifications: mockNotifications,
          unreadCount: mockNotifications.filter((n) => !n.read).length,
        });
      },
    }),
    {
      name: "andlet-notifications",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    },
  ),
);
