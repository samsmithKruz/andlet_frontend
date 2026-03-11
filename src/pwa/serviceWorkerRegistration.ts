// This handles service worker registration for production

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `/sw.js`; // Vite PWA plugin generates this

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("Service Worker registered: ", registration);

          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  console.log("New content available, please refresh.");
                  if (config?.onUpdate) config.onUpdate(registration);
                } else {
                  // First time cached
                  console.log("Content cached for offline use.");
                  if (config?.onSuccess) config.onSuccess(registration);
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error("Service Worker registration failed: ", error);
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
