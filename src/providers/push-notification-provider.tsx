// src/providers/push-notification-provider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/lib/toast";

// VAPID helper
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface PushNotificationContextType {
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
}

const PushNotificationContext = createContext<
  PushNotificationContextType | undefined
>(undefined);

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export function PushNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);

      if ("Notification" in window) {
        setPermission(Notification.permission);
      }

      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setSubscription(sub);
      }

      setIsLoading(false);
    };

    checkStatus();
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      showToast.error("Notifications not supported");
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const subscribe = async (): Promise<boolean> => {
    try {
      if (permission !== "granted") {
        const newPermission = await requestPermission();
        if (newPermission !== "granted") return false;
      }

      const registration = await navigator.serviceWorker.ready;

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(newSubscription);

      if (isAuthenticated) {
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSubscription),
        });
      }

      showToast.success("Push notifications enabled");
      return true;
    } catch (error) {
      console.error("Subscription failed:", error);
      showToast.error("Failed to enable notifications");
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    try {
      const currentSub =
        subscription ||
        (await navigator.serviceWorker.ready.then((reg) =>
          reg.pushManager.getSubscription(),
        ));

      if (currentSub) {
        await currentSub.unsubscribe();
        setSubscription(null);

        if (isAuthenticated) {
          await fetch("/api/push/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: currentSub.endpoint }),
          });
        }

        showToast.success("Push notifications disabled");
      }

      return true;
    } catch (error) {
      console.error("Unsubscribe failed:", error);
      return false;
    }
  };

  return (
    <PushNotificationContext.Provider
      value={{
        permission,
        subscription,
        isSubscribed: !!subscription,
        isLoading,
        subscribe,
        unsubscribe,
        requestPermission,
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
}

export function usePushNotifications() {
  const context = useContext(PushNotificationContext);
  if (!context)
    throw new Error(
      "usePushNotifications must be used within PushNotificationProvider",
    );
  return context;
}
