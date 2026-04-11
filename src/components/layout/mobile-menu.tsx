import { useState } from "react";
import { Link } from "react-router-dom";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  Search,
  User,
  PlusCircle,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Download,
} from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { isRunningAsPWA } from "@/lib/pwa-detection";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { install, isInstallable } = usePWAInstall();

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-70 sm:w-87.5">
        <SheetHeader className="text-left mb-6">
          <SheetTitle>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Andlet Logo" width={32} height={32} />
              <span className="font-bold text-lg text-primary">Andlet</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-1">
          <Link
            to="/"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <Link
            to="/listings"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Search className="h-5 w-5" />
            <span>Search Properties</span>
          </Link>

          <Link
            to="/dashboard"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <User className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <div className="h-px bg-border my-2" />

          <Link
            to="/listings/create"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Post Property</span>
          </Link>

          <Link
            to="/settings"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>

          <Link
            to="/help"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </Link>

          <div className="h-px bg-border my-2" />

          {/* Theme Section */}
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground mb-2">Theme</p>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                  theme === "light"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Sun className="h-4 w-4" />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Moon className="h-4 w-4" />
                <span className="text-sm">Dark</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                  theme === "system"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Laptop className="h-4 w-4" />
                <span className="text-sm">System</span>
              </button>
            </div>
          </div>

          {/* Only show install option if not in PWA */}
          {!isRunningAsPWA() && (
            <>
              <div className="h-px bg-border my-2" />
              <button
                onClick={() => {
                  install();
                  handleClose();
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full cursor-pointer"
              >
                <Download className="h-5 w-5" />
                <span>Install App</span>
              </button>
            </>
          )}

          <div className="h-px bg-border my-2" />

          <button
            onClick={() => {
              // Handle logout
              handleClose();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors w-full cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
