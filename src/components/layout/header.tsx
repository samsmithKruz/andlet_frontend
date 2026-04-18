import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Plus, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { useAuth } from "@/hooks/useAuth";
import { useInAppNotifications } from "@/providers/in-app-notification-provider";
import { useBottomNav } from "@/hooks/useBottomNav";
import { Can } from "@/components/auth/Can";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useInAppNotifications();
  const navigate = useNavigate();
  const navItems = useBottomNav();

  const handlePostClick = () => {
    navigate("/listings/create");
  };

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="Andlet Logo" width={32} height={32} />
          <span className="font-bold text-lg text-primary hidden sm:inline">
            Andlet
          </span>
        </Link>

        {/* Desktop Navigation - Same 5 items as mobile */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems
            .filter((item) => item.id !== "login")
            .map((item) => (
              <Button key={item.id} variant="ghost" asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn("relative", isActive && "text-primary font-medium")
                  }
                >
                  {item.label}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center px-0.5">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </NavLink>
              </Button>
            ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:flex"
          >
            <Link to="/listings">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* Desktop Post Button */}
          <Can permission="listings.create">
            <Button
              onClick={handlePostClick}
              size="sm"
              className="hidden md:flex gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Post Property</span>
            </Button>
          </Can>

          {/* Notifications - Desktop */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden lg:flex relative"
            >
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center px-0.5">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            </Button>
          )}

          {/* Desktop User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden lg:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-listings">My Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/saved">Saved Properties</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu (Hamburger) */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
