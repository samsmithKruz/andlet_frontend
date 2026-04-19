import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { showToast } from "@/lib/toast";
import { PRESETS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface EarnSectionProps {
  topEarnersAmount?: string;
  className?: string;
}

export function EarnSection({
  topEarnersAmount = "200k",
  className,
}: EarnSectionProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const sectionRef = useScrollReveal<HTMLDivElement>({
    preset: PRESETS.fadeInUp,
    threshold: 0.1,
    once: true,
  });

  const handlePostProperty = () => {
    if (!isAuthenticated) {
      showToast.info("Sign in to post", {
        description: "Create a free account to start earning",
      });
      navigate("/signup", { state: { from: "/listings/create" } });
      return;
    }
    navigate("/listings/create");
  };

  const handleLearnMore = () => {
    navigate("/learn/earning");
  };

  return (
    <section
      ref={sectionRef.ref}
      className={cn("px-4 py-12 sm:py-16 bg-background", className)}
    >
      {/* Rounded Container */}
      <div className="max-w-6xl mx-auto bg-muted/30 rounded-3xl sm:rounded-4xl border border-border overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center">
            {/* Earnings Signal */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit mb-6">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                Top earners made ₦{topEarnersAmount}+ this month
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-4 leading-[1.2]">
              Earn passively.
              <br />
              <span className="text-primary">No stress.</span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              See a "To Let" sign in your neighborhood? Snap a few photos, post
              it in minutes, and earn money from inspection fees. No license. No
              subscription. Just you and your phone.
            </p>

            {/* Simple Steps */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Camera className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Snap and post</p>
                  <p className="text-sm text-muted-foreground">
                    Take photos of any vacant property around you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Set your fee</p>
                  <p className="text-sm text-muted-foreground">
                    You decide what to charge for property viewings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Earn passively
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get paid when seekers book inspections. You just show up.
                  </p>
                </div>
              </div>
            </div>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handlePostProperty}
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all"
              >
                Post a property
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                onClick={handleLearnMore}
                variant="outline"
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base font-medium border-border text-foreground hover:bg-muted rounded-xl transition-all"
              >
                Learn more
              </Button>
            </div>

            {/* Micro Testimonial */}
            <p className="text-sm text-muted-foreground mt-6 italic border-l-2 border-primary/30 pl-4">
              "I posted my neighbor's flat. Made ₦45k in two weeks." — Funke,
              Lagos
            </p>
          </div>

          {/* Right Column - Illustration */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Illustration Container */}
              <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl border border-border shadow-xl">
                {/* Placeholder Illustration */}
                <img
                  src="/images/hero/hunter-demo-thumbnail.png"
                  alt="Earn money by posting properties"
                  className="w-full h-full object-cover rounded-2xl"
                />

                {/* Floating Stats Card */}
                <div className="absolute -bottom-4 -left-4 bg-background rounded-xl shadow-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Average earnings
                  </p>
                  <p className="text-2xl font-bold text-foreground">₦35k</p>
                  <p className="text-xs text-primary">per property monthly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
