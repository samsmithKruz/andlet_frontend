import { EarnSection } from "./hero/EarnSection";
import { HeroBridge } from "./hero/hero-bridge";
import { HunterSection } from "./hero/hunter-section";

export function HeroSection() {
  return (
    <div>
      <HunterSection propertyCount={1200} />

      <HeroBridge />

      <EarnSection />

      {/* EarnSection will go here */}
    </div>
  );
}
