"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface State<T> {
  key: string;
  data?: T;
  error: Error | null;
}

/** Loads `fn()` whenever `deps` change. Keeps the previous data while reloading. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState<State<T>>({ key: "", error: null });
  const fnRef = useRef(fn);
  const key = `${JSON.stringify(deps)}#${nonce}`;

  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    let cancelled = false;
    fnRef.current().then(
      (data) => !cancelled && setState({ key, data, error: null }),
      (error: Error) => !cancelled && setState((s) => ({ key, data: s.data, error })),
    );
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setData = useCallback((data: T) => setState((s) => ({ ...s, data })), []);
  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const loading = state.key !== key;

  return { data: state.data, setData, error: loading ? null : state.error, loading, reload };
}
