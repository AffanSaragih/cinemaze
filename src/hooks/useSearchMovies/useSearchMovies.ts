import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchMovies } from '@/services/tmdb';
import { normalizeMovie } from '@/utils/normalize/normalizeMovie';
import type { BaseMovie } from '@/types/movie';

type Options = {
  debounceMs?: number;
  language?: string;
  includeAdult?: boolean;
  page?: number;
};

/** Debounce + fetch TMDB + normalisasi -> BaseMovie[] */
export function useSearchMovies(term: string, options: Options = {}) {
  const {
    debounceMs = 300,
    language = 'en-US',
    includeAdult = false,
    page = 1,
  } = options;

  const debounced = useDebounce(term, debounceMs);
  const [results, setResults] = useState<BaseMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      setError(null);
      if (!debounced.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const json = await searchMovies(debounced, {
          page,
          include_adult: includeAdult,
          language,
        });
        const arr = (json?.results ?? []).map(normalizeMovie) as BaseMovie[];
        if (active) setResults(arr);
      } catch (e) {
        if (active) setError(e);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [debounced, page, includeAdult, language]);

  return { results, loading, error, debounced };
}
