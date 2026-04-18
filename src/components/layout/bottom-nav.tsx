import { NavLink, useNavigate } from "react-router-dom";
import { useBottomNav } from "@/hooks/useBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";

export function BottomNav() {
  const items = useBottomNav();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleItemClick = (item: NavItem) => {
    if (item.requiresAuth && !isAuthenticated) {
      showToast.info("Sign in required", {
        description: `Sign in to access ${item.label}`,
      });
      navigate("/auth", { state: { from: item.path } });
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-40">
      <div className="flex items-stretch h-16">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={(e) => {
              if (item.requiresAuth && !isAuthenticated) {
                e.preventDefault();
                handleItemClick(item);
              }
            }}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all",
                      isActive && "fill-primary/10",
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center px-0.5">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-none">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
