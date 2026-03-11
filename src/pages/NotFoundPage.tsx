import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import your SVG (adjust path based on where you saved it)
import NotFoundSvg from "@/assets/404.svg";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background">
      {/* SVG Illustration */}
      <div className="w-full max-w-[300px] mb-8">
        <img
          src={NotFoundSvg}
          alt="404 - Page not found"
          className="w-full h-auto"
        />
      </div>

      {/* Message */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Lost your way?
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <Button asChild className="w-full" size="lg">
          <Link to="/">Take me home</Link>
        </Button>

        <Button asChild variant="outline" className="w-full" size="lg">
          <Link to="/listings">Browse properties</Link>
        </Button>
      </div>
    </div>
  );
}
