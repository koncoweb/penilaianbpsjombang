import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to fetch data only once on mount
 * Prevents infinite loops and multiple fetches
 */
export function useFetchOnMount<T>(
  fetchFn: () => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Skip if disabled or already fetched
    if (options?.enabled === false || hasFetched.current) {
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        hasFetched.current = true;
        
        const result = await fetchFn();
        setData(result);
        
        if (options?.onSuccess) {
          options.onSuccess(result);
        }
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error('[useFetchOnMount] Error:', error);
        
        if (options?.onError) {
          options.onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.enabled]); // Only depend on enabled flag

  const refetch = async () => {
    hasFetched.current = false;
    setIsLoading(true);
    
    try {
      const result = await fetchFn();
      setData(result);
      hasFetched.current = true;
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      if (options?.onError) {
        options.onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
}

