import { useEffect, useState } from "react";

type QueryEntry<Data> = {
  promise?: Promise<Data>;
  data?: Data;
  error?: unknown;
  hasData: boolean;
  hasError: boolean;
};

// Cache entries are looked up by queryKey.
const queryCache = new Map<string, QueryEntry<unknown>>();

const getCacheEntry = <Data,>(queryKey: readonly unknown[]) => {
  const key = JSON.stringify(queryKey);
  let entry = queryCache.get(key) as QueryEntry<Data> | undefined;
  if (!entry) {
    entry = { hasData: false, hasError: false };
    queryCache.set(key, entry as QueryEntry<unknown>);
  }
  return entry;
};

export const useQueryWithCache = <Data, Error = unknown>(
  queryFn: () => Promise<Data>,
  queryKey: readonly unknown[],
) => {
  const [state, setState] = useState(() => {
    const cached = getCacheEntry(queryKey);
    return {
      data: cached.data,
      error: cached.error as Error | undefined,
      loading: !cached.hasData && !cached.hasError,
      isSuccess: cached.hasData,
    };
  });

  useEffect(() => {
    let active = true;
    const entry = getCacheEntry<Data>(queryKey);

    if (entry.hasData || entry.hasError) {
      setState({
        data: entry.data,
        error: entry.error as Error | undefined,
        loading: false,
        isSuccess: entry.hasData,
      });
      return () => { active = false; };
    }

    setState({ data: undefined, error: undefined, loading: true, isSuccess: false });

    // Hook instances with the same queryKey share this promise.
    entry.promise ??= queryFn()
      .then((data) => {
        entry.data = data;
        entry.hasData = true;
        return data;
      })
      .catch((error: unknown) => {
        entry.error = error;
        entry.hasError = true;
        throw error;
      })
      .finally(() => {
        entry.promise = undefined;
      });

    entry.promise.then(
      (data) => {
        if (active) setState({ data, error: undefined, loading: false, isSuccess: true });
      },
      (error: unknown) => {
        if (active) setState({ data: undefined, error: error as Error, loading: false, isSuccess: false });
      },
    );

    return () => { active = false; };
    // queryKey is the cache identity and request change signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, queryKey);

  return {
    ...state,
    isError: state.error !== undefined,
  };
};
