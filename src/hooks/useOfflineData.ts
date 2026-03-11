import { useState, useEffect } from "react";
import { offlineManager } from "@/lib/offline";

export function useOfflineData<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get from cache first
        const cached = offlineManager.getCachedData(key);
        if (cached) {
          setData(JSON.parse(cached));
        }

        // If online, fetch fresh data
        if (navigator.onLine) {
          const fresh = await fetcher();
          setData(fresh);
          offlineManager.setCachedData(key, fresh);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  return { data, loading, error };
}
