import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import styles from './SearchOverlayResults.module.scss';
import { MovieCard } from '@/components/sections/MovieCard';
import { Empty } from '@/components/ui/Empty';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/context/SearchContext';
import type { BaseMovie } from '@/types/movie';
import { normalizeMovie } from '@/utils/normalize/normalizeMovie';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const SearchOverlayResults: React.FC = () => {
  const { searchTerm, searchOpen, closeSearch } = useSearch();
  const debounced = useDebounce(searchTerm, 300);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { pathname } = useLocation();

  const [searchResults, setSearchResults] = React.useState<BaseMovie[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSearchResults([]);
    setError(null);
  }, [pathname]);

  const query = debounced.trim();

  // CHANGED: SSR-safe navigator
  const language = useMemo(
    () => (typeof navigator !== 'undefined' ? navigator.language : 'en-US'),
    []
  ); 


  useEffect(() => {
    if (!isDesktop) return;
    if (!query && searchOpen) closeSearch();
  }, [query, searchOpen, closeSearch, isDesktop]);

  useEffect(() => {
    if (!searchOpen || !query) {
      abortRef.current?.abort();
      setLoading(false);
      setError(null);
      if (!query) setSearchResults([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL('https://api.themoviedb.org/3/search/movie');
        url.searchParams.set('query', query);
        url.searchParams.set('language', language);
        url.searchParams.set('include_adult', 'false');
        url.searchParams.set('page', '1');
        url.searchParams.set('api_key', String(API_KEY));

        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

        const data = await res.json();
        const results = Array.isArray(data?.results) ? data.results : [];
        setSearchResults(results.map(normalizeMovie));
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          setError(e?.message || 'Failed to fetch results');
          setSearchResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [query, searchOpen, language]); // ⬅️ perhatikan: isDesktop DIHAPUS dari deps

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') closeSearch();
    },
    [closeSearch]
  );

  const showEmptyHint = !query && !loading;
  const showNotFound =
    query && !loading && !error && searchResults.length === 0;

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role='dialog'
          aria-modal='true'
          aria-label='Search results'
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          onKeyDown={onKeyDown}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
          tabIndex={-1} // CHANGED: agar bisa menerima keydown/Escape
        >
          <div className='container'>
            <div className={styles.results}>
              {showEmptyHint && (
                <div className={styles.centerBox}>
                  <Empty
                    title='No Search Query'
                    subtitle='Type a keyword to explore movies.'
                    showCTA={false}
                  />
                </div>
              )}

              {loading && (
                <div
                  className={`${styles.centerBox} ${styles.loading}`}
                  aria-busy='true'
                >
                  Loading…
                </div>
              )}

              {error && (
                <div className={styles.centerBox}>
                  <Empty
                    title='Something went wrong'
                    subtitle={error}
                    showCTA={false}
                  />
                </div>
              )}

              {!loading &&
                !error &&
                searchResults.length > 0 &&
                searchResults.map((movie) => (
                  <MovieCard key={movie.id} {...movie} />
                ))}

              {showNotFound && (
                <div className={styles.centerBox}>
                  <Empty
                    title='No Results'
                    subtitle='Try different keywords.'
                    showCTA={false}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
