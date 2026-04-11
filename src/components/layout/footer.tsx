import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { Home, Search, User } from "lucide-react";
import { Header } from "@/components/layout/header";
import { InstallBanner } from "@/components/ui/install-banner";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-stretch justify-items-stretch h-16">
          <Link
            className="p-1 flex-1 flex items-center flex-col gap-1 justify-center hover:bg-primary/5"
            to="/"
          >
            <Home className="h-5 w-5" />
          </Link>
          <Link
            className="p-1 flex-1 flex items-center flex-col gap-1 justify-center hover:bg-primary/5"
            to="/listings"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            className="p-1 flex-1 flex items-center flex-col gap-1 justify-center hover:bg-primary/5"
            to="/dashboard"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </nav>

      {/* Footer for desktop */}
      <footer className="hidden lg:block border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Andlet. All rights reserved.
          </p>
        </div>
      </footer>

      <InstallBanner />
    </div>
  );
}
