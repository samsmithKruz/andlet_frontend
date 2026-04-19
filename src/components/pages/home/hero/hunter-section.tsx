import { useNavigate } from "react-router-dom";
import { Sparkles, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { showToast } from "@/lib/toast";
import { PRESETS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface HunterSectionProps {
  propertyCount: number;
  className?: string;
}

export function HunterSection({
  propertyCount,
  className,
}: HunterSectionProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const formattedCount = new Intl.NumberFormat().format(propertyCount);

  const sectionRef = useScrollReveal<HTMLDivElement>({
    preset: PRESETS.fadeInUp,
    threshold: 0.1,
    once: true,
  });

  const handleTryHunter = () => {
    if (!isAuthenticated) {
      showToast.info("Sign in to use Hunter", {
        description: "Create a free account to let AI find your perfect home",
      });
      navigate("/signup", { state: { from: "/hunter" } });
      return;
    }
    navigate("/hunter");
  };

  const handleWatchVideo = () => {
    const videoElement = document.getElementById("hunter-video");
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef.ref}
      className={cn(
        "relative flex flex-col items-center justify-center px-5 py-16 sm:py-24 bg-background",
        className,
      )}
    >
      <div className="relative w-full max-w-4xl mx-auto text-center">
        {/* Availability Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
            {formattedCount}+ properties discovered this week
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-4 leading-[1.1]">
          We find it.
          <br />
          <span className="text-primary">You just show up.</span>
        </h1>

        <p className="text-base sm:text-lg font-bold text-foreground/80 mb-3">
          Stop scrolling. Start living.
        </p>

        <p className="text-sm sm:text-base text-muted-foreground max-w-md sm:max-w-lg mx-auto mb-8 sm:mb-10 px-2">
          Tell us what you want. Our AI scans thousands of listings day and
          night. When a match appears, you are the first to know.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 sm:mb-12">
          <Button
            onClick={handleTryHunter}
            size="lg"
            className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Try it Now
          </Button>
          <Button
            onClick={handleWatchVideo}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base font-medium border-border text-foreground hover:bg-muted rounded-xl transition-all"
          >
            <Play className="h-4 w-4 mr-2" />
            See how it works
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-muted overflow-hidden"
              >
                <img
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="Andlet Testimonial avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base italic text-muted-foreground px-4">
              "I was sleeping. Hunter found my apartment."
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              10,000+ homes already found
            </p>
          </div>
        </div>

        {/* YouTube Embed */}
        <div
          id="hunter-video"
          className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-border"
        >
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/GrebV814fok"
              title="How I saved a Property Management Company $94,000 with AI Agents (2026)"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
