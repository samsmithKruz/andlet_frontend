// src/lib/pwa-redirect.ts

import { isRunningInBrowser } from "./pwa-detection";

// Check if the app should redirect to PWA
export function shouldRedirectToPWA(): boolean {
  // Don't redirect if already in PWA
  if (!isRunningInBrowser()) return false;

  // Don't redirect if user has dismissed
  const hasDismissedRedirect =
    localStorage.getItem("pwa-redirect-dismissed") === "true";
  if (hasDismissedRedirect) return false;

  // Check if PWA is installed (Android only)
  // This is not perfectly reliable, but works in modern browsers
  const isPWAInstalled = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  return !isPWAInstalled;
}

export function dismissRedirect() {
  localStorage.setItem("pwa-redirect-dismissed", "true");
}

export function getRedirectCountdown(): number {
  const count = localStorage.getItem("pwa-redirect-countdown");
  return count ? parseInt(count) : 3; // default 3 seconds
}

export function setRedirectCountdown(seconds: number) {
  localStorage.setItem("pwa-redirect-countdown", seconds.toString());
}
