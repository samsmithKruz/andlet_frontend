/**
 * Web-specific animation implementations
 * Uses CSS custom properties and class toggling
 */

import type {
  AnimationPreset,
  ScrollRevealOptions,
  StaggerOptions,
} from "./types";
import { PRESETS, DURATION, DELAY } from "./types";
import { isBrowser, prefersReducedMotion, generateAnimationId } from "./utils";

/**
 * Apply animation preset to a DOM element
 */
export const applyAnimation = (
  element: HTMLElement,
  preset: AnimationPreset,
): void => {
  if (!isBrowser() || !element) return;

  // Respect reduced motion preference
  if (prefersReducedMotion()) {
    preset = { ...preset, duration: 0, delay: 0 };
  }

  // Set CSS custom properties
  element.style.setProperty("--animation-duration", `${preset.duration}ms`);
  element.style.setProperty("--animation-delay", `${preset.delay}ms`);
  element.style.setProperty("--animation-easing", preset.easing);

  // Add animation class
  const animationClass = getAnimationClassName(preset);
  element.classList.add(animationClass);
};

/**
 * Remove animation from element
 */
export const removeAnimation = (
  element: HTMLElement,
  preset: AnimationPreset,
): void => {
  if (!isBrowser() || !element) return;

  const animationClass = getAnimationClassName(preset);
  element.classList.remove(animationClass);

  // Reset opacity if it was animated
  element.style.opacity = "";
  element.style.transform = "";
};

/**
 * Map preset to CSS class name
 */
export const getAnimationClassName = (preset: AnimationPreset): string => {
  const { type, direction } = preset;

  if (type === "fade") {
    return direction === "up"
      ? "animate-fade-up"
      : direction === "down"
        ? "animate-fade-down"
        : direction === "left"
          ? "animate-fade-left"
          : direction === "right"
            ? "animate-fade-right"
            : "animate-fade-in";
  }

  if (type === "slide") {
    return `animate-slide-${direction}`;
  }

  if (type === "scale") {
    return "animate-scale-in";
  }

  return "animate-fade-in";
};

/**
 * Get initial hidden styles for an element
 */
export const getHiddenStyles = (
  preset: AnimationPreset,
): Partial<CSSStyleDeclaration> => {
  const { type, direction } = preset;

  const styles: Partial<CSSStyleDeclaration> = {
    opacity: "0",
  };

  if (type === "slide" || (type === "fade" && direction !== "none")) {
    const distance = "30px";

    if (direction === "up") styles.transform = `translateY(${distance})`;
    if (direction === "down") styles.transform = `translateY(-${distance})`;
    if (direction === "left") styles.transform = `translateX(${distance})`;
    if (direction === "right") styles.transform = `translateX(-${distance})`;
  }

  if (type === "scale") {
    styles.transform = "scale(0.9)";
  }

  return styles;
};

/**
 * Apply hidden state to element (before animation)
 */
export const setHiddenState = (
  element: HTMLElement,
  preset: AnimationPreset,
): void => {
  if (!isBrowser() || !element) return;

  const styles = getHiddenStyles(preset);
  Object.assign(element.style, styles);
};

/**
 * Create a scroll-triggered animation observer
 */
export const createScrollObserver = (
  element: HTMLElement,
  options: ScrollRevealOptions,
  onReveal: () => void,
  onHide?: () => void,
): IntersectionObserver => {
  const { threshold = 0.1, rootMargin = "0px", once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onReveal();
          if (once) observer.unobserve(element);
        } else if (!once && onHide) {
          onHide();
        }
      });
    },
    { threshold, rootMargin },
  );

  observer.observe(element);
  return observer;
};

/**
 * Stagger animation for multiple elements
 */
export const staggerElements = (
  elements: HTMLElement[],
  options: StaggerOptions,
): void => {
  const {
    staggerDelay = DELAY.small,
    from = "start",
    preset = PRESETS.fadeInUp,
  } = options;

  let sortedElements = [...elements];

  if (from === "end") {
    sortedElements = sortedElements.reverse();
  } else if (from === "center") {
    const mid = Math.floor(elements.length / 2);
    sortedElements = [
      ...elements.slice(mid).reverse(),
      ...elements.slice(0, mid),
    ];
  }

  sortedElements.forEach((element, index) => {
    const elementPreset: AnimationPreset = {
      ...preset,
      delay: index * staggerDelay,
    };

    setHiddenState(element, elementPreset);

    // Small delay before applying animation (ensures hidden state is set)
    requestAnimationFrame(() => {
      applyAnimation(element, elementPreset);
    });
  });
};

/**
 * Create a simple fade transition between two states
 */
export const crossFade = (
  outgoingElement: HTMLElement,
  incomingElement: HTMLElement,
  duration: number = DURATION.normal,
): Promise<void> => {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      resolve();
      return;
    }

    const fadeOut: AnimationPreset = {
      ...PRESETS.fadeIn,
      duration: duration / 2,
    };

    const fadeIn: AnimationPreset = {
      ...PRESETS.fadeIn,
      duration: duration / 2,
    };

    // Fade out
    outgoingElement.style.transition = `opacity ${fadeOut.duration}ms ${fadeOut.easing}`;
    outgoingElement.style.opacity = "0";

    setTimeout(() => {
      outgoingElement.style.display = "none";
      incomingElement.style.display = "";

      // Fade in
      setHiddenState(incomingElement, fadeIn);
      requestAnimationFrame(() => {
        applyAnimation(incomingElement, fadeIn);
      });

      setTimeout(resolve, fadeIn.duration);
    }, fadeOut.duration);
  });
};

/**
 * Pause all animations on an element
 */
export const pauseAnimations = (element: HTMLElement): void => {
  if (!isBrowser() || !element) return;
  element.style.animationPlayState = "paused";
};

/**
 * Resume all animations on an element
 */
export const resumeAnimations = (element: HTMLElement): void => {
  if (!isBrowser() || !element) return;
  element.style.animationPlayState = "running";
};

/**
 * Check if an element is currently animating
 */
export const isAnimating = (element: HTMLElement): boolean => {
  if (!isBrowser() || !element) return false;

  const animations = element.getAnimations();
  return (
    animations.length > 0 &&
    animations.some((anim) => anim.playState === "running")
  );
};
