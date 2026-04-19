import { useEffect, useRef, useCallback } from "react";
import {
  applyAnimation,
  setHiddenState,
  removeAnimation,
  createScrollObserver,
} from "@/lib/animations/web";
import {
  type AnimationPreset,
  type ScrollRevealOptions,
  PRESETS,
} from "@/lib/animations/types";
import {
  prefersReducedMotion,
  generateAnimationId,
} from "@/lib/animations/utils";

interface UseScrollRevealReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  reveal: () => void;
  hide: () => void;
  isRevealed: () => boolean;
}

/**
 * Hook for scroll-triggered reveal animations
 *
 * @example
 * const { ref } = useScrollReveal<HTMLDivElement>({
 *   preset: PRESETS.fadeInUp,
 *   threshold: 0.2,
 *   once: true,
 * });
 *
 * return <div ref={ref}>Content that animates on scroll</div>;
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
): UseScrollRevealReturn<T> {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    preset = PRESETS.fadeInUp,
    once = true,
    disabled = false,
  } = options;

  const ref = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isRevealedRef = useRef<boolean>(false);
  const animationIdRef = useRef<string>(generateAnimationId());

  // Manual reveal function
  const reveal = useCallback(() => {
    const element = ref.current;
    if (!element || isRevealedRef.current) return;

    // Respect reduced motion
    if (prefersReducedMotion()) {
      element.style.opacity = "1";
      element.style.transform = "none";
      isRevealedRef.current = true;
      return;
    }

    applyAnimation(element, preset);

    // Mark animation as complete
    const onAnimationEnd = () => {
      element.classList.add("animation-complete");
      element.removeEventListener("animationend", onAnimationEnd);
    };
    element.addEventListener("animationend", onAnimationEnd, { once: true });

    isRevealedRef.current = true;
  }, [preset]);

  // Manual hide function
  const hide = useCallback(() => {
    const element = ref.current;
    if (!element || !isRevealedRef.current) return;

    if (prefersReducedMotion()) {
      setHiddenState(element, preset);
      isRevealedRef.current = false;
      return;
    }

    removeAnimation(element, preset);
    setHiddenState(element, preset);
    isRevealedRef.current = false;
  }, [preset]);

  // Check if currently revealed
  const isRevealed = useCallback(() => {
    return isRevealedRef.current;
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    // Set initial hidden state
    setHiddenState(element, preset);

    // Clean up any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new scroll observer
    observerRef.current = createScrollObserver(
      element,
      { threshold, rootMargin, once },
      reveal,
      once ? undefined : hide,
    );

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Remove animation classes on unmount
      if (element) {
        removeAnimation(element, preset);
      }
    };
  }, [threshold, rootMargin, once, disabled, preset, reveal, hide]);

  return {
    ref,
    reveal,
    hide,
    isRevealed,
  };
}

/**
 * Hook for scroll-triggered stagger animations on multiple children
 *
 * @example
 * const { containerRef } = useScrollStagger<HTMLDivElement>({
 *   childSelector: '.stagger-item',
 *   preset: PRESETS.fadeInUp,
 *   staggerDelay: 100,
 * });
 *
 * return (
 *   <div ref={containerRef}>
 *     <div className="stagger-item">Item 1</div>
 *     <div className="stagger-item">Item 2</div>
 *   </div>
 * );
 */
interface ScrollStaggerOptions extends ScrollRevealOptions {
  childSelector: string;
  staggerDelay?: number;
  from?: "start" | "end" | "center";
}

export function useScrollStagger<T extends HTMLElement = HTMLDivElement>(
  options: ScrollStaggerOptions,
): { containerRef: React.RefObject<T | null> } {
  const {
    childSelector,
    staggerDelay = 100,
    from = "start",
    threshold = 0.1,
    rootMargin = "0px",
    preset = PRESETS.fadeInUp,
    once = true,
    disabled = false,
  } = options;

  const containerRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  const animateChildren = useCallback(() => {
    const container = containerRef.current;
    if (!container || hasAnimatedRef.current) return;

    const children = Array.from(
      container.querySelectorAll(childSelector),
    ) as HTMLElement[];

    if (children.length === 0) return;

    // Respect reduced motion
    if (prefersReducedMotion()) {
      children.forEach((child) => {
        child.style.opacity = "1";
        child.style.transform = "none";
      });
      hasAnimatedRef.current = true;
      return;
    }

    // Sort children based on 'from' option
    let sortedChildren = [...children];
    if (from === "end") {
      sortedChildren = sortedChildren.reverse();
    } else if (from === "center") {
      const mid = Math.floor(children.length / 2);
      sortedChildren = [
        ...children.slice(mid).reverse(),
        ...children.slice(0, mid),
      ];
    }

    // Animate with stagger
    sortedChildren.forEach((child, index) => {
      const childPreset: AnimationPreset = {
        ...preset,
        delay: index * staggerDelay,
      };

      setHiddenState(child, childPreset);

      // Small delay to ensure hidden state is applied
      requestAnimationFrame(() => {
        applyAnimation(child, childPreset);

        // Mark animation as complete
        const onAnimationEnd = () => {
          child.classList.add("animation-complete");
          child.removeEventListener("animationend", onAnimationEnd);
        };
        child.addEventListener("animationend", onAnimationEnd, { once: true });
      });
    });

    hasAnimatedRef.current = true;
  }, [childSelector, preset, staggerDelay, from]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    // Set initial hidden state on all children
    const children = Array.from(
      container.querySelectorAll(childSelector),
    ) as HTMLElement[];

    children.forEach((child) => {
      setHiddenState(child, preset);
    });

    // Create observer for the container
    observerRef.current = createScrollObserver(
      container,
      { threshold, rootMargin, once },
      animateChildren,
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [
    childSelector,
    threshold,
    rootMargin,
    once,
    disabled,
    preset,
    animateChildren,
  ]);

  return { containerRef };
}
