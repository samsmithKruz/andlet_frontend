import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY = "andlet_fab_position";

// Calculate default position (bottom-right, above bottom nav)
const getDefaultPosition = (): Position => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const fabSize = 56; // h-14 = 56px

  return {
    x: viewportWidth - fabSize - 16, // 16px from right edge
    y: viewportHeight - fabSize - 96, // 16px above bottom nav (h-16 = 64px + 16px margin)
  };
};

const SNAP_THRESHOLD = 20;

export function PostFAB() {
  const navigate = useNavigate();
  const fabRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<Position>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : getDefaultPosition();
    } catch {
      return getDefaultPosition();
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const getBoundedPosition = useCallback((x: number, y: number): Position => {
    if (!fabRef.current) return { x, y };

    const fabRect = fabRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const rightOffset = viewportWidth - x - fabRect.width;
    const bottomOffset = viewportHeight - y - fabRect.height;

    let finalX = x;
    let finalY = y;

    // Snap to edges
    if (rightOffset < SNAP_THRESHOLD) {
      finalX = viewportWidth - fabRect.width - 16;
    } else if (x < SNAP_THRESHOLD) {
      finalX = 16;
    }

    if (bottomOffset < SNAP_THRESHOLD) {
      finalY = viewportHeight - fabRect.height - 80; // Above bottom nav
    } else if (y < SNAP_THRESHOLD) {
      finalY = 16;
    }

    return {
      x: Math.max(16, Math.min(finalX, viewportWidth - fabRect.width - 16)),
      y: Math.max(16, Math.min(finalY, viewportHeight - fabRect.height - 80)),
    };
  }, []);

  const savePosition = useCallback((pos: Position) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch (error) {
      console.warn("Failed to save FAB position", error);
    }
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    if (!fabRef.current) return;

    const rect = fabRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });

    setIsDragging(true);
    setHasMoved(false);
  };

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !fabRef.current) return;

      e.preventDefault();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;

      const boundedPos = getBoundedPosition(newX, newY);
      setPosition(boundedPos);
      setHasMoved(true);
    },
    [isDragging, dragOffset, getBoundedPosition],
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (hasMoved) {
        savePosition(position);
      }
    }
  }, [isDragging, hasMoved, position, savePosition]);

  const handleClick = () => {
    if (hasMoved) return;
    navigate("/listings/create");
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => getBoundedPosition(prev.x, prev.y));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getBoundedPosition]);

  return (
    <button
      ref={fabRef}
      onClick={handleClick}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      className={cn(
        "fixed z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "active:scale-95",
        isDragging && "scale-110 shadow-xl cursor-grabbing",
        !isDragging && "cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
      style={{
        left: position.x,
        top: position.y,
        transition: isDragging ? "none" : "all 0.2s ease",
      }}
      aria-label="Post property"
    >
      <Plus className="h-6 w-6" />
      <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full border shadow-sm flex items-center justify-center">
        <span className="text-[8px] text-muted-foreground">⟲</span>
      </span>
    </button>
  );
}
