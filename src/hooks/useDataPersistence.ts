import { useState, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const dataCache = new DataCache();

export function useDataPersistence<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: {
    ttl?: number;
    refetchOnMount?: boolean;
    refetchInterval?: number;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    refetchOnMount = false,
    refetchInterval
  } = options;

  const fetchData = async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (useCache && dataCache.has(key)) {
        const cachedData = dataCache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // Fetch fresh data
      const freshData = await fetchFunction();
      
      // Cache the data
      dataCache.set(key, freshData, ttl);
      setData(freshData);
      
      return freshData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error(`Error fetching data for key ${key}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchData(false);

  const clearCache = () => {
    dataCache.clear(key);
  };

  useEffect(() => {
    // Initial load
    fetchData(!refetchOnMount);

    // Set up interval if specified
    let intervalId: NodeJS.Timeout | undefined;
    if (refetchInterval && refetchInterval > 0) {
      intervalId = setInterval(() => {
        fetchData(false);
      }, refetchInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [key]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
}
