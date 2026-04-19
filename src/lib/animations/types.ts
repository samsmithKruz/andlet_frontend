// src/lib/animations/types.ts

/**
 * Web-optimized animation types
 * For Vite React PWA
 */

export type AnimationType = "fade" | "slide" | "scale";

export type AnimationDirection = "up" | "down" | "left" | "right" | "none";

export type AnimationEasing =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

export interface AnimationPreset {
  type: AnimationType;
  direction?: AnimationDirection;
  duration: number;
  delay: number;
  easing: AnimationEasing;
}

export interface ScrollRevealOptions {
  threshold?: number; // 0-1, how much of element must be visible
  rootMargin?: string; // CSS margin string (e.g., "0px 0px -50px 0px")
  preset?: AnimationPreset; // Animation to play when revealed
  once?: boolean; // Only trigger once
  disabled?: boolean; // Completely disable (for A/B testing)
}

export interface StaggerOptions {
  staggerDelay?: number; // Delay between each child
  from?: "start" | "end" | "center";
  preset?: AnimationPreset;
}

// Web-specific duration tokens (match CSS variables)
export const DURATION = {
  instant: 100,
  fast: 200,
  normal: 400,
  slow: 600,
  glacial: 1000,
} as const;

export const DELAY = {
  none: 0,
  micro: 50,
  small: 100,
  medium: 200,
  large: 400,
} as const;

// Pre-built presets for web
export const PRESETS = {
  fadeIn: {
    type: "fade" as const,
    direction: "none" as const,
    duration: DURATION.normal,
    delay: DELAY.none,
    easing: "ease-out" as const,
  },
  fadeInUp: {
    type: "fade" as const,
    direction: "up" as const,
    duration: DURATION.normal,
    delay: DELAY.none,
    easing: "ease-out" as const,
  },
  slideUp: {
    type: "slide" as const,
    direction: "up" as const,
    duration: DURATION.normal,
    delay: DELAY.none,
    easing: "ease-out" as const,
  },
  slideLeft: {
    type: "slide" as const,
    direction: "left" as const,
    duration: DURATION.normal,
    delay: DELAY.none,
    easing: "ease-out" as const,
  },
  slideRight: {
    type: "slide" as const,
    direction: "right" as const,
    duration: DURATION.normal,
    delay: DELAY.none,
    easing: "ease-out" as const,
  },
  scaleIn: {
    type: "scale" as const,
    direction: "none" as const,
    duration: DURATION.fast,
    delay: DELAY.none,
    easing: "ease-out" as const,
  },
} as const;
