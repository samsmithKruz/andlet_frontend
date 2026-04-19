// src/lib/animations/utils.ts

/**
 * Web-only animation utilities
 * Optimized for Vite React PWA
 */

export const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

export const prefersReducedMotion = (): boolean => {
  if (!isBrowser()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const onMotionPreferenceChange = (
  callback: (prefersReduced: boolean) => void,
): (() => void) => {
  if (!isBrowser()) return () => {};

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
};

/**
 * Generate a unique ID for animation instances
 */
export const generateAnimationId = (): string => {
  return `anim-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (
  element: HTMLElement,
  offset: number = 0,
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top <= windowHeight - offset && rect.bottom >= offset;
};

/**
 * Debounce function for scroll/resize events
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
