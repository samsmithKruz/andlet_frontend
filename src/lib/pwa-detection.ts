// src/lib/pwa-detection.ts

export type DisplayMode =
  | "browser"
  | "standalone"
  | "minimal-ui"
  | "fullscreen"
  | "window-controls-overlay";

export function getPWADisplayMode(): DisplayMode {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isMinimalUI = window.matchMedia("(display-mode: minimal-ui)").matches;
  const isFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
  const isWindowControlsOverlay = window.matchMedia(
    "(display-mode: window-controls-overlay)",
  ).matches;

  if (isStandalone) return "standalone";
  if (isMinimalUI) return "minimal-ui";
  if (isFullscreen) return "fullscreen";
  if (isWindowControlsOverlay) return "window-controls-overlay";

  return "browser";
}

export function isRunningAsPWA(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isMinimalUI = window.matchMedia("(display-mode: minimal-ui)").matches;
  const isWindowControlsOverlay = window.matchMedia(
    "(display-mode: window-controls-overlay)",
  ).matches;

  // iOS detection
  const isiOSStandalone = (window.navigator as any).standalone === true;

  // DO NOT include fullscreen here
  return (
    isStandalone || isMinimalUI || isWindowControlsOverlay || isiOSStandalone
  );
}

// Check if the app was launched from installed PWA
export function wasLaunchedFromPWA(): boolean {
  // iOS specific
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isiOS && (window.navigator as any).standalone === true) {
    return true;
  }

  // Android/Desktop
  return isRunningAsPWA();
}
