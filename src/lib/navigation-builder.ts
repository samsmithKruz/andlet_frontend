// src/lib/navigation-builder.ts

import type { NavItem, NavItemConfig } from "@/types/navigation";

interface BuildContext {
  isAuthenticated: boolean;
  hasFeature: (feature: string) => boolean;
  unreadCount: number;
}

export function buildNavFromConfig(
  config: NavItemConfig[],
  context: BuildContext,
): NavItem[] {
  const { isAuthenticated, hasFeature, unreadCount } = context;

  // 1. Filter by feature availability
  const availableItems = config.filter((item) => {
    if (!item.requiredFeature) return true;
    const hasIt = hasFeature(item.requiredFeature);
    return hasIt;
  });

  // 2. Separate anchored vs floating
  const anchored = availableItems.filter((i) => i.anchor !== undefined);
  const floating = availableItems.filter((i) => i.anchor === undefined);

  // 3. Build 5 slots
  const result: (NavItemConfig | undefined)[] = new Array(5).fill(undefined);

  // 4. Place anchored items
  for (const item of anchored) {
    if (item.id === "login" && isAuthenticated) continue;
    result[item.anchor!] = item;
  }

  // 5. Sort floating by priority
  const sortedFloating = [...floating].sort((a, b) => b.priority - a.priority);

  // 6. Fill empty slots
  let floatingIndex = 0;
  for (let i = 0; i < 5; i++) {
    if (!result[i] && floatingIndex < sortedFloating.length) {
      result[i] = sortedFloating[floatingIndex];
      floatingIndex++;
    }
  }

  // 7. Transform to NavItem with badges
  const finalItems = result
    .filter((item): item is NavItemConfig => item !== undefined)
    .filter((item) => {
      if (!item.requiresAuth) return true;
      return isAuthenticated;
    })
    .map((config) => ({
      id: config.id,
      icon: config.icon,
      label: config.label,
      path: config.path,
      requiresAuth: config.requiresAuth,
      badge:
        config.badgeSource === "notifications" && unreadCount > 0
          ? unreadCount
          : undefined,
    }));

  return finalItems;
}
