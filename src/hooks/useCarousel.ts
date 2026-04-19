import { useState, useRef, useEffect, useCallback } from "react";
import { debounce, clamp } from "@/lib/animations/utils";

interface UseCarouselOptions {
  slidesPerView?: number | "auto";
  spacing?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  enableKeyboard?: boolean;
  onSlideChange?: (index: number) => void;
}

interface UseCarouselReturn<T extends HTMLElement> {
  containerRef: React.RefObject<T | null>;
  activeIndex: number;
  totalSlides: number;
  isDragging: boolean;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollTo: (index: number, behavior?: ScrollBehavior) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollToStart: () => void;
  scrollToEnd: () => void;
}

/**
 * Hook for creating native CSS scroll-snap carousels
 * Touch-optimized, zero dependencies, fully accessible
 *
 * @example
 * const { containerRef, activeIndex, scrollNext, scrollPrev } = useCarousel({
 *   slidesPerView: 1.2,
 *   spacing: 16,
 *   autoplay: true,
 * });
 *
 * return (
 *   <>
 *     <div ref={containerRef} className="carousel">
 *       <div className="carousel-slide">Slide 1</div>
 *       <div className="carousel-slide">Slide 2</div>
 *     </div>
 *     <button onClick={scrollPrev}>Prev</button>
 *     <button onClick={scrollNext}>Next</button>
 *   </>
 * );
 */
export function useCarousel<T extends HTMLElement = HTMLDivElement>(
  options: UseCarouselOptions = {},
): UseCarouselReturn<T> {
  const {
    slidesPerView = 1,
    spacing = 0,
    autoplay = false,
    autoplayInterval = 3000,
    loop = false,
    enableKeyboard = true,
    onSlideChange,
  } = options;

  const containerRef = useRef<T>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualNavigationRef = useRef(false);
  const slidePositionsRef = useRef<number[]>([]);

  // Calculate slide positions and dimensions
  const calculateSlidePositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const slides = Array.from(container.children) as HTMLElement[];
    const containerWidth = container.offsetWidth;

    let slideWidth: number;

    if (slidesPerView === "auto") {
      // Use first slide's width
      slideWidth = slides[0]?.offsetWidth || containerWidth;
    } else {
      slideWidth =
        (containerWidth - spacing * (slidesPerView - 1)) / slidesPerView;
    }

    const positions: number[] = [];
    slides.forEach((_, index) => {
      positions.push(index * (slideWidth + spacing));
    });

    slidePositionsRef.current = positions;
    setTotalSlides(slides.length);

    return { slideWidth, positions };
  }, [slidesPerView, spacing]);

  // Update active index based on scroll position
  const updateActiveIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const positions = slidePositionsRef.current;

    if (positions.length === 0) return;

    // Find the closest slide position
    let closestIndex = 0;
    let minDistance = Infinity;

    positions.forEach((position, index) => {
      const distance = Math.abs(scrollLeft - position);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);

    // Update scroll boundaries
    const maxScroll = container.scrollWidth - containerWidth;
    setCanScrollPrev(scrollLeft > 5);
    setCanScrollNext(scrollLeft < maxScroll - 5);

    onSlideChange?.(closestIndex);
  }, [onSlideChange]);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    updateActiveIndex();
  }, [updateActiveIndex]);

  const debouncedHandleScroll = debounce(handleScroll, 100);

  // Scroll to specific slide
  const scrollTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      if (!container) return;

      const positions = slidePositionsRef.current;
      const targetIndex = clamp(index, 0, totalSlides - 1);
      const targetPosition = positions[targetIndex] || 0;

      container.scrollTo({
        left: targetPosition,
        behavior,
      });

      setActiveIndex(targetIndex);
      onSlideChange?.(targetIndex);
    },
    [totalSlides, onSlideChange],
  );

  // Navigation methods
  const scrollNext = useCallback(() => {
    isManualNavigationRef.current = true;
    const nextIndex =
      loop && activeIndex === totalSlides - 1 ? 0 : activeIndex + 1;
    if (nextIndex < totalSlides) {
      scrollTo(nextIndex);
    }

    // Reset manual flag after animation
    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 500);
  }, [activeIndex, totalSlides, loop, scrollTo]);

  const scrollPrev = useCallback(() => {
    isManualNavigationRef.current = true;
    const prevIndex =
      loop && activeIndex === 0 ? totalSlides - 1 : activeIndex - 1;
    if (prevIndex >= 0) {
      scrollTo(prevIndex);
    }

    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 500);
  }, [activeIndex, totalSlides, loop, scrollTo]);

  const scrollToStart = useCallback(() => {
    scrollTo(0);
  }, [scrollTo]);

  const scrollToEnd = useCallback(() => {
    scrollTo(totalSlides - 1);
  }, [scrollTo, totalSlides]);

  // Touch handlers for drag detection
  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
    isManualNavigationRef.current = true;

    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 500);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!autoplay || !containerRef.current) return;

    const startAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }

      autoplayTimerRef.current = setTimeout(() => {
        if (!isDragging && !isManualNavigationRef.current) {
          scrollNext();
        }
        startAutoplay();
      }, autoplayInterval);
    };

    startAutoplay();

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isDragging, scrollNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      // Only handle if carousel is in viewport or has focus
      const rect = containerRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isInViewport) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToStart();
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, scrollNext, scrollPrev, scrollToStart, scrollToEnd]);

  // Initialize and handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      calculateSlidePositions();
      updateActiveIndex();

      // Maintain scroll position relative to active slide
      const positions = slidePositionsRef.current;
      if (positions[activeIndex] !== undefined) {
        container.scrollLeft = positions[activeIndex];
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initial calculation
    calculateSlidePositions();
    updateActiveIndex();

    // Scroll event listener
    container.addEventListener("scroll", debouncedHandleScroll, {
      passive: true,
    });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("mouseDown", handleTouchStart);
    container.addEventListener("mouseUp", handleTouchEnd);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("scroll", debouncedHandleScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mouseDown", handleTouchStart);
      container.removeEventListener("mouseUp", handleTouchEnd);
    };
  }, [
    calculateSlidePositions,
    updateActiveIndex,
    debouncedHandleScroll,
    handleTouchStart,
    handleTouchEnd,
    activeIndex,
  ]);

  return {
    containerRef,
    activeIndex,
    totalSlides,
    isDragging,
    canScrollPrev,
    canScrollNext,
    scrollTo,
    scrollNext,
    scrollPrev,
    scrollToStart,
    scrollToEnd,
  };
}
