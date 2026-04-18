import { useState } from "react";
import { Link } from "react-router-dom";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useAuth } from "@/hooks/useAuth";
import { useInAppNotifications } from "@/providers/in-app-notification-provider";
import { Can } from "@/components/auth/Can";
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
  LogIn,
  Sun,
  Moon,
  Laptop,
  Download,
  Heart,
  Bell,
  Compass,
  List,
  UserCircle,
} from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { isRunningAsPWA } from "@/lib/pwa-detection";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { unreadCount } = useInAppNotifications();
  const { install } = usePWAInstall();

  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Menu className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center px-0.5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="max-w-70 w-full sm:max-w-87.5 sm:w-full overflow-y-auto"
      >
        <SheetHeader className="text-left mb-6">
          <SheetTitle>
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={handleClose}
            >
              <img src="/logo.svg" alt="Andlet Logo" width={32} height={32} />
              <span className="font-bold text-lg text-primary">Andlet</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-1">
          {/* Primary Navigation - Always visible */}
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
            <span>Explore</span>
          </Link>

          <Link
            to="/hunter"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Compass className="h-5 w-5" />
            <span>Hunter</span>
          </Link>

          {/* Authenticated Only Section */}
          {isAuthenticated && (
            <>
              <div className="h-px bg-border my-2" />

              {/* Dashboard - Permission protected */}
              <Can permission="dashboard.view">
                <Link
                  to="/dashboard"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </Can>

              {/* Post Property - Feature protected */}
                <Link
                  to="/listings/create"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Post Property</span>
                </Link>

                <Link
                  to="/my-listings"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <List className="h-5 w-5" />
                  <span>My Listings</span>
                </Link>

                <Link
                  to="/saved"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>Saved Properties</span>
                </Link>

              {/* Inspections - Feature protected */}
              <Can permission="inspections.view">
                <Link
                  to="/inspections"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span>Inspections</span>
                </Link>
              </Can>

              {/* Properties Management - Feature protected */}
              <Can permission="properties.manage">
                <Link
                  to="/properties"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <List className="h-5 w-5" />
                  <span>Properties</span>
                </Link>
              </Can>

              {/* Notifications */}
              <Link
                to="/notifications"
                onClick={handleClose}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <div className="h-px bg-border my-2" />

              <Link
                to="/profile"
                onClick={handleClose}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                <UserCircle className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={handleClose}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </>
          )}

          {/* Support - Always visible */}
          <Link
            to="/help"
            onClick={handleClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </Link>

          <div className="h-px bg-border my-2" />

          {/* Theme Section - Always visible */}
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground mb-2">Theme</p>
            <div className="flex gap-2 flex-wrap">
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
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md transition-colors cursor-pointer ${
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

          {/* Install App - Only show if not in PWA */}
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

          {/* Auth Section */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors w-full cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 px-3">
              <Link
                to="/signup"
                onClick={handleClose}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
              <Link
                to="/login"
                onClick={handleClose}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors w-full cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
