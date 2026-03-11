import { showToast } from "./toast";

type OfflineAction = {
  id: string;
  type: "inspection_code" | "viewed_property" | "hunt_match";
  data: any;
  timestamp: number;
};

class OfflineManager {
  private static instance: OfflineManager;
  private actions: OfflineAction[] = [];
  private readonly STORAGE_KEY = "andlet-offline-actions";

  private constructor() {
    this.loadFromStorage();
    this.setupListeners();
  }

  static getInstance() {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private setupListeners() {
    window.addEventListener("online", () => {
      showToast.success("Back online! Syncing data...");
      this.syncActions();
    });

    window.addEventListener("offline", () => {
      showToast.warning("You are offline. Using cached data.");
    });
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.actions = JSON.parse(stored);
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.actions));
  }

  addAction(action: Omit<OfflineAction, "id" | "timestamp">) {
    const newAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.actions.push(newAction);
    this.saveToStorage();
    showToast.info("Action saved offline. Will sync when online.");
  }

  async syncActions() {
    if (!navigator.onLine) return;

    const actionsToSync = [...this.actions];
    this.actions = [];
    this.saveToStorage();

    for (const action of actionsToSync) {
      try {
        // TODO: Send to API based on action type
        console.log("Syncing:", action);
      } catch (error) {
        console.error("Sync failed:", error);
        // Re-add failed actions
        this.actions.push(action);
        this.saveToStorage();
      }
    }

    if (this.actions.length === 0) {
      showToast.success("All offline actions synced!");
    } else {
      showToast.error("Some actions failed to sync. Will retry.");
    }
  }

  getCachedData(key: string) {
    return localStorage.getItem(`andlet-cache-${key}`);
  }

  setCachedData(key: string, data: any) {
    localStorage.setItem(`andlet-cache-${key}`, JSON.stringify(data));
  }
}

export const offlineManager = OfflineManager.getInstance();
