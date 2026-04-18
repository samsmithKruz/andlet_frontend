// src/hooks/useBottomNav.ts

import { useState, useEffect, useMemo } from "react";
import { navConfigService } from "@/services/navigation-config.service";
import { useAuth } from "./useAuth";
import { useInAppNotifications } from "@/providers/in-app-notification-provider";
import { buildNavFromConfig } from "@/lib/navigation-builder";
import { NAV_ITEMS_CONFIG } from "@/config/navigation";
import type { NavItem, NavItemConfig } from "@/types/navigation";

// src/hooks/useBottomNav.ts

export function useBottomNav(): NavItem[] {
  const [config, setConfig] = useState<NavItemConfig[]>(NAV_ITEMS_CONFIG);
  const { isAuthenticated, hasFeature, allFeatures } = useAuth();
  const { unreadCount } = useInAppNotifications();

  useEffect(() => {
    navConfigService
      .getConfig()
      .then((remoteConfig) => {
        if (remoteConfig && remoteConfig.length > 0) {
          setConfig(remoteConfig);
        }
      })
      .catch((err) => {
        console.warn("⚠️ Using fallback config:", err);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navConfigService
        .forceRefresh()
        .then((remoteConfig) => {
          if (remoteConfig && remoteConfig.length > 0) {
            
            setConfig(remoteConfig);
          }
        })
        .catch(console.warn);
    }
  }, [isAuthenticated]);

  return useMemo(() => {
    const items = buildNavFromConfig(config, {
      isAuthenticated,
      hasFeature,
      unreadCount,
    });

    return items;
  }, [config, isAuthenticated, hasFeature, unreadCount]);
}
