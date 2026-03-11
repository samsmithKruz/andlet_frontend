import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 z-50 w-full flex justify-center mx-auto">
      <div className="bg-destructive text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>You're offline</span>
      </div>
    </div>
  );
}
