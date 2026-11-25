import { useEffect, useState } from "react";



export const useQuery = <Data, Error=unknown> (
  queryFn: () => Promise<Data>,
  dep: readonly unknown[]
) => {
  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(undefined);

    queryFn()
      .then(results => {
        if (!cancelled) {
          setData(results);
          setError(undefined)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setData(undefined);
          setError(err as Error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      })

      return () => {
        cancelled = true;
      }
  }, dep);

  return {
    data,
    loading,
    error,
    isSuccess: !loading && error === undefined,
    isError: error !== undefined
  }
}