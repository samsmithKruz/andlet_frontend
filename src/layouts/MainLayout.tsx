import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { Home, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Andlet Logo" width={32} height={32} />
            <span className="font-bold text-lg text-primary">Andlet</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-stretch justify-items-stretch h-16">
            <Link className="p-1 flex-1 flex items-center flex-col gap-1 justify-center hover:bg-primary/5" to="/">
              <Home className="h-5 w-5" />
            </Link>
            <Link className="p-1 flex-1 flex items-center flex-col gap-1 justify-center hover:bg-primary/5" to="/listings">
              <Search className="h-5 w-5" />
            </Link>
            <Link className="p-1 flex-1 flex items-center flex-col gap-1 justify-center hover:bg-primary/5" to="/dashboard">
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
    </div>
  );
}
