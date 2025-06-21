import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Track } from '@shared/schema';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['/api/search', { q: debouncedQuery }],
    enabled: debouncedQuery.length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json() as Promise<Track[]>;
    },
  });

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    searchResults: searchResults || [],
    isLoading: isLoading && debouncedQuery.length > 0,
    error,
    clearSearch,
    hasQuery: debouncedQuery.length > 0,
  };
};
