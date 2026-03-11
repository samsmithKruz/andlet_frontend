import { Spinner } from "@/components/ui/spinner";

interface PageLoaderProps {
  fullscreen?: boolean;
  text?: string;
  spinnerSize?: "xs" | "sm" | "md" | "lg";
}
const spinnerSizes = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
};
export function PageLoader({
  fullscreen = false,
  text,
  spinnerSize = "md",
}: PageLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner
        className={`text-primary ${spinnerSize ? `size-${spinnerSizes[spinnerSize]}` : ""}`}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {content}
    </div>
  );
}
