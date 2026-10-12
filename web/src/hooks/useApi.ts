import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "../services/api";

interface Result<T> {
  key: string;
  data?: T;
  error?: string;
}

export function useApi<T>(path: string) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Result<T>>({ key: "" });
  const key = `${path}#${version}`;

  useEffect(() => {
    let cancelled = false;
    api.get<T>(path).then(
      (data) => {
        if (!cancelled) setResult({ key, data });
      },
      (error: unknown) => {
        if (!cancelled) setResult({ key, error: errorMessage(error) });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data: result.data,
    error: result.key === key ? result.error : undefined,
    loading: result.key !== key,
    reload,
  };
}
