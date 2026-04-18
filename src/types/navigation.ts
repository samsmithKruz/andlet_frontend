import type { LucideIcon } from "lucide-react";

export interface NavItemConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  requiredFeature: string | null;
  requiresAuth: boolean;
  badgeSource: "notifications" | null;
  priority: number;
  anchor?: number;
}

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  requiresAuth: boolean;
  badge?: number;
}
