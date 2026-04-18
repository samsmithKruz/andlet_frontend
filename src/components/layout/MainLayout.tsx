import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { Home, Search, User } from "lucide-react";
import { Header } from "@/components/layout/header";
import { InstallBanner } from "@/components/ui/install-banner";
import { BottomNav } from "./bottom-nav";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />

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
