import { useAsyncData } from "./useAsyncData";
import { useDemoStateStore } from "../store/demoStateStore";

export function useDashboardData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const syncError = useDemoStateStore((s) => s.syncError);
  return useAsyncData(() => {
    if (syncError) return Promise.reject(new Error("Sync failed"));
    return fetcher();
  }, [syncError, ...deps]);
}
