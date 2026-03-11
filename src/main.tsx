import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { register } from "./pwa/serviceWorkerRegistration.ts";
import { showToast } from "./lib/toast.ts";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { OfflineIndicator } from "./components/ui/offline-indicator.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="andlet-theme">
      <RouterProvider router={router} />
      <Toaster />
      <OfflineIndicator />
    </ThemeProvider>
  </StrictMode>,
);

register({
  onUpdate: (registration) => {
    showToast.custom("New version available", {
      description: "A new version of Andlet is ready",
      action: {
        label: "Update now",
        onClick: () => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        },
      },
      duration: Infinity,
    });
  },
});
