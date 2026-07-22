import { useCallback, useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "loading"; data?: undefined; error?: undefined }
  | { status: "ready"; data: T; error?: undefined }
  | { status: "error"; data?: undefined; error?: string };

export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", error: err instanceof Error ? err.message : undefined });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, reload };
}
