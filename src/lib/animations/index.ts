// src/lib/animations/index.ts

import type { AnimationPreset } from "./types";



// CSS class name generator (web-specific)
export const getAnimationClass = (preset: AnimationPreset): string => {
  const { type, direction, easing } = preset;

  if (type === "fade") {
    return direction === "up" ? "animate-fade-up" : "animate-fade-in";
  }

  if (type === "slide") {
    return `animate-slide-${direction}`;
  }

  if (type === "scale") {
    return "animate-scale-in";
  }

  return "animate-fade-in";
};

export * from "./types";
export * from "./utils";
export * from "./web";