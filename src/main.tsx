import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { register } from "./lib/serviceWorkerRegistration.ts";
import { showToast } from "./lib/toast.ts";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { OfflineIndicator } from "./components/ui/offline-indicator.tsx";
import { PageLoader } from "./components/ui/page-loader.tsx";
import { InAppNotificationProvider } from "./providers/in-app-notification-provider.tsx";
import { PushNotificationProvider } from "./providers/push-notification-provider.tsx";
import { handleAuthCallback } from "./lib/auth-handler.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <InAppNotificationProvider>
        <PushNotificationProvider>
          <OfflineIndicator />
          <Suspense fallback={<PageLoader fullscreen />}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster />
        </PushNotificationProvider>
      </InAppNotificationProvider>
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

const redirectPath = handleAuthCallback();
if (redirectPath) {
  window.location.href = redirectPath;
}
