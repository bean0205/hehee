import { useState, useCallback, useRef } from 'react';

export interface UseFeedPaginationOptions {
  initialPage?: number;
  pageSize?: number;
  fetchFunction: (page: number, pageSize: number) => Promise<any[]>;
}

export interface UseFeedPaginationReturn<T> {
  data: T[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  error: string | null;
  page: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook cho Feed pagination với infinite scroll
 *
 * Features:
 * - Infinite scroll (load more when reach end)
 * - Pull-to-refresh
 * - Error handling
 * - Loading states
 * - Duplicate prevention
 */
export function useFeedPagination<T extends { id: string }>({
  initialPage = 1,
  pageSize = 10,
  fetchFunction,
}: UseFeedPaginationOptions): UseFeedPaginationReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);

  const isLoadingRef = useRef(false);

  /**
   * Load more posts (infinite scroll)
   */
  const loadMore = useCallback(async () => {
    // Prevent duplicate calls
    if (isLoadingRef.current || !hasMore || loading) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const newData = await fetchFunction(page, pageSize);

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        // Prevent duplicates
        setData((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewData = newData.filter((item: T) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewData];
        });
        setPage((p) => p + 1);
      }
    } catch (err) {
      console.error('Load more error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [page, pageSize, hasMore, loading, fetchFunction]);

  /**
   * Refresh feed (pull-to-refresh)
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setPage(initialPage);
    setHasMore(true);

    try {
      const newData = await fetchFunction(initialPage, pageSize);
      setData(newData);

      if (newData.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Refresh error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  }, [initialPage, pageSize, fetchFunction]);

  /**
   * Reset pagination state
   */
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setLoading(false);
    setRefreshing(false);
    isLoadingRef.current = false;
  }, [initialPage]);

  return {
    data,
    loading,
    refreshing,
    hasMore,
    error,
    page,
    loadMore,
    refresh,
    reset,
  };
}
