// src/services/navigation-config.service.ts

import api from "@/lib/axios";
import { NAV_ITEMS_CONFIG } from "@/config/navigation";
import type { NavItemConfig } from "@/types/navigation";

interface RemoteNavConfig {
  version: string;
  items: NavItemConfig[];
  lastUpdated: string;
}

class NavigationConfigService {
  private readonly CONFIG_ENDPOINT = "/config/navigation";
  private readonly STORAGE_KEY = "andlet_nav_config";
  private readonly FALLBACK_CONFIG = NAV_ITEMS_CONFIG;

  private cachedConfig: NavItemConfig[] = this.FALLBACK_CONFIG;
  private fetchPromise: Promise<NavItemConfig[]> | null = null;

  async getConfig(): Promise<NavItemConfig[]> {
    const cached = this.getCachedConfig();
    this.refreshConfig(); // Fire and forget
    return cached;
  }

  private getCachedConfig(): NavItemConfig[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return this.FALLBACK_CONFIG;

      const parsed: RemoteNavConfig = JSON.parse(stored);
      const cacheAge = Date.now() - new Date(parsed.lastUpdated).getTime();
      const isStale = cacheAge > 24 * 60 * 60 * 1000;

      return isStale ? this.FALLBACK_CONFIG : parsed.items;
    } catch {
      return this.FALLBACK_CONFIG;
    }
  }

  private async refreshConfig(): Promise<void> {
    if (this.fetchPromise) {
      await this.fetchPromise;
      return;
    }

    this.fetchPromise = this.fetchRemoteConfig();

    try {
      const config = await this.fetchPromise;
      this.cachedConfig = config;
      this.cacheConfig(config);
    } catch (error) {
      console.warn("Failed to fetch remote nav config, using fallback", error);
    } finally {
      this.fetchPromise = null;
    }
  }

  private async fetchRemoteConfig(): Promise<NavItemConfig[]> {
    const response = await api.get<RemoteNavConfig>(this.CONFIG_ENDPOINT, {
      timeout: 5000,
    });

    return response.data.items;
  }

  private cacheConfig(items: NavItemConfig[]): void {
    const cacheData: RemoteNavConfig = {
      version: "1.0",
      items,
      lastUpdated: new Date().toISOString(),
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Failed to cache nav config", error);
    }
  }

  // PUBLIC method for forcing refresh
  async forceRefresh(): Promise<NavItemConfig[]> {
    this.fetchPromise = null;
    const config = await this.fetchRemoteConfig();
    this.cachedConfig = config;
    this.cacheConfig(config);
    return config;
  }

  resetToFallback(): void {
    this.cachedConfig = this.FALLBACK_CONFIG;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const navConfigService = new NavigationConfigService();
