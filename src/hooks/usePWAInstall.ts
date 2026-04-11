import { useState, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { isRunningAsPWA } from "@/lib/pwa-detection";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if already in PWA
    if (isRunningAsPWA()) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const install = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          showToast.success("Andlet installed! 🎉", {
            description: "Welcome to the full experience!",
          });
          return true;
        } else {
          showToast.info("Installation cancelled", {
            description: "You can install later",
            duration: 3000,
          });
          return false;
        }
      } catch (error) {
        showToast.error("Installation failed", {
          description: "Please try again",
        });
        return false;
      } finally {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      // iOS - show instructions
      const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isiOS) {
        showToast.custom("Install Andlet on iOS", {
          description: "Tap Share → Add to Home Screen",
          duration: 5000,
        });
      } else {
        showToast.custom("Install Andlet", {
          description: "Open Chrome menu → Install App",
          duration: 5000,
        });
      }
      return false;
    }
  };

  return {
    install,
    isInstallable,
    isSupported:
      !!window.matchMedia("(display-mode: standalone)").matches === false,
  };
}
