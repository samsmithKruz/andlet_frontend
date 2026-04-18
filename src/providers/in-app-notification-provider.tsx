// src/providers/in-app-notification-provider.tsx
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuth } from "@/hooks/useAuth";

interface InAppNotificationContextType {
  unreadCount: number;
  notifications: any[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const InAppNotificationContext = createContext<
  InAppNotificationContextType | undefined
>(undefined);

export function InAppNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  return (
    <InAppNotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </InAppNotificationContext.Provider>
  );
}

export function useInAppNotifications() {
  const context = useContext(InAppNotificationContext);
  if (context === undefined) {
    throw new Error(
      "useInAppNotifications must be used within an InAppNotificationProvider",
    );
  }
  return context;
}
