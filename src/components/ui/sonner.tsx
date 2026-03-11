import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          success:
            "group-[.toast]:bg-[#16A34A] group-[.toast]:text-white group-[.toast]:border-[#16A34A] dark:group-[.toast]:bg-[#16A34A]/90",
          error:
            "group-[.toast]:bg-destructive group-[.toast]:text-destructive-foreground group-[.toast]:border-destructive",
          warning:
            "group-[.toast]:bg-amber-500 group-[.toast]:text-white group-[.toast]:border-amber-500 dark:group-[.toast]:bg-amber-600",
          info: "group-[.toast]:bg-blue-500 group-[.toast]:text-white group-[.toast]:border-blue-500 dark:group-[.toast]:bg-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
