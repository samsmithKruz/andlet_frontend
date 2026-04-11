import { useState, useEffect } from "react";
import { X, Download, Smartphone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isRunningAsPWA } from "@/lib/pwa-detection";
import { showToast } from "@/lib/toast";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const BANNER_DISMISSED_KEY = "andlet-banner-dismissed-timestamp";
const BANNER_COOLDOWN_MS = 60000; // 60 seconds

export function InstallBanner() {
  const { install, isInstallable } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already in PWA
    if (isRunningAsPWA()) {
      return;
    }

    // Check if banner was recently dismissed
    const dismissedTimestamp = localStorage.getItem(BANNER_DISMISSED_KEY);
    const now = Date.now();

    if (dismissedTimestamp) {
      const timeSinceDismissal = now - parseInt(dismissedTimestamp, 10);
      if (timeSinceDismissal < BANNER_COOLDOWN_MS) {
        return;
      } else {
        localStorage.removeItem(BANNER_DISMISSED_KEY);
      }
    }

    setShowBanner(true);
  }, []);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setShowBanner(false);
      localStorage.removeItem(BANNER_DISMISSED_KEY);
    }
  };

  const handleContinueInApp = () => {
    showToast.info("Opening app...", {
      description: "If the app doesn't open, please install it first",
      duration: 3000,
    });
    window.location.href = window.location.href;
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, Date.now().toString());

    showToast.info("Install Andlet", {
      description:
        "Banner will return after 60 seconds. Install for the best experience.",
      duration: 3000,
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm bg-primary text-primary-foreground rounded-lg shadow-xl animate-in slide-in-from-top duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="shrink-0 h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Get the Andlet App</p>
              <p className="text-xs text-primary-foreground/80 mt-1">
                Faster browsing, offline access, and instant notifications
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleInstall}
                  className="gap-2 h-8 text-xs"
                >
                  <Download className="h-3 w-3" />
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleContinueInApp}
                  className="gap-2 h-8 text-xs text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <ExternalLink className="h-3 w-3" />
                  Already have it? Open in App
                </Button>
              </div>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDismiss}
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20 shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
