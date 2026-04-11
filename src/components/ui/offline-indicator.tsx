import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineToast(true);
      // Hide the success message after 3 seconds
      setTimeout(() => setShowOnlineToast(false), 3000);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="sticky top-0 z-50 w-full bg-destructive text-white px-4 py-2 shadow-lg flex items-center justify-center gap-2 text-sm animate-in slide-in-from-top duration-300">
        <WifiOff className="h-4 w-4" />
        <span>You're offline</span>
      </div>
    );
  }

  // Show temporary online success message
  if (showOnlineToast) {
    return (
      <div className="sticky top-0 z-50 w-full bg-[#16A34A] text-white px-4 py-2 shadow-lg flex items-center justify-center gap-2 text-sm animate-in slide-in-from-top fade-out duration-500 delay-1000">
        <Wifi className="h-4 w-4" />
        <span>Back online! Syncing data...</span>
      </div>
    );
  }

  return null;
}
