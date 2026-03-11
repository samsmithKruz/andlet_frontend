import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { register } from "./pwa/serviceWorkerRegistration.ts";
import { showToast } from "./lib/toast.ts";
import { ThemeProvider } from "./providers/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="andlet-theme">
      <App />
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
