import { ArrowDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PRESETS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface HeroBridgeProps {
  className?: string;
}

export function HeroBridge({ className }: HeroBridgeProps) {
  const bridgeRef = useScrollReveal<HTMLDivElement>({
    preset: {
      ...PRESETS.fadeInUp,
      delay: 200,
    },
    threshold: 0.2,
    once: true,
  });

  return (
    <div
      ref={bridgeRef.ref}
      className={cn(
        "relative py-16 sm:py-20 flex flex-col items-center justify-center text-center bg-muted/30",
        className,
      )}
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-primary/30 rounded-full" />

      {/* Bridge Message */}
      <div className="max-w-2xl px-5">
        <p className="text-sm sm:text-base font-medium uppercase tracking-wider text-primary mb-3">
          One platform. Two ways to win.
        </p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Whether you're looking or earning,
        </p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
          Andlet works for you.
        </p>
      </div>

      {/* Visual arrow indicator */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Scroll to discover
        </span>
        <div className="animate-bounce">
          <ArrowDown className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
