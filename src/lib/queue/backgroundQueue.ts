import { dispatchAction } from "./dispatcher";
import type { QueueActionType, QueueActionPayload } from "./types";

interface StoredQueuedAction {
  id: string;
  type: QueueActionType;
  payload: QueueActionPayload;
  retries: number;
  maxRetries: number;
  createdAt: number;
}

class BackgroundQueue {
  private queue: StoredQueuedAction[] = [];
  private pendingPromises: Map<
    string,
    { resolve: (value: any) => void; reject: (reason: any) => void }
  > = new Map();
  private isProcessing = false;
  private storageKey = "andlet-background-queue";

  constructor() {
    this.loadFromStorage();
    this.setupListeners();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.queue = JSON.parse(saved);
        console.log(`Loaded ${this.queue.length} pending actions from storage`);
      } catch (e) {
        console.error("Failed to load queue:", e);
        this.queue = [];
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
  }

  private setupListeners() {
    window.addEventListener("online", () => {
      console.log("Back online - processing background queue");
      this.process();
    });
  }

  add(
    type: QueueActionType,
    payload: QueueActionPayload,
    options?: { maxRetries?: number },
  ): Promise<any> {
    const id = crypto.randomUUID();

    const queuedAction: StoredQueuedAction = {
      id,
      type,
      payload,
      retries: 0,
      maxRetries: options?.maxRetries ?? 3,
      createdAt: Date.now(),
    };

    this.queue.push(queuedAction);
    this.saveToStorage();

    const promise = new Promise((resolve, reject) => {
      this.pendingPromises.set(id, { resolve, reject });
    });

    if (navigator.onLine) {
      this.process();
    }

    return promise;
  }

  private async process() {
    if (this.isProcessing) return;
    if (!navigator.onLine) return;
    if (this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const action = this.queue[0];
      const promiseHandlers = this.pendingPromises.get(action.id);

      try {
        const result = await dispatchAction(action.type, action.payload);

        if (result.success) {
          this.queue.shift();
          this.saveToStorage();

          if (promiseHandlers) {
            promiseHandlers.resolve(result.data);
            this.pendingPromises.delete(action.id);
          }
        } else {
          throw result.error;
        }
      } catch (error) {
        console.error(`Action ${action.id} (${action.type}) failed:`, error);
        action.retries++;

        if (action.retries >= action.maxRetries) {
          this.queue.shift();
          this.saveToStorage();

          if (promiseHandlers) {
            promiseHandlers.reject(error);
            this.pendingPromises.delete(action.id);
          }
        } else {
          this.queue.push(this.queue.shift()!);
          this.saveToStorage();
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    this.isProcessing = false;
  }

  getStatus() {
    return {
      pending: this.queue.length,
      isProcessing: this.isProcessing,
      isOnline: navigator.onLine,
    };
  }

  clear() {
    for (const [id, { reject }] of this.pendingPromises) {
      reject(new Error("Queue cleared"));
      this.pendingPromises.delete(id);
    }
    this.queue = [];
    this.saveToStorage();
  }
}

export const backgroundQueue = new BackgroundQueue();
