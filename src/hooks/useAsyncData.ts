import { useCallback, useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "loading"; data?: undefined }
  | { status: "ready"; data: T }
  | { status: "error"; data?: undefined };

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
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, reload };
}
