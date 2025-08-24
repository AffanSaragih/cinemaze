import { useState, useEffect } from 'react';
import { getPopularMoviesChunk } from '@/services/getPopularMoviesChunk';
import type { BaseMovie } from '@/types/movie';

const LOAD_STEP = 100;

export function usePopularMovies() {
  const [movies, setMovies] = useState<BaseMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const initial = await getPopularMoviesChunk(0, LOAD_STEP);
      if (mounted) {
        setMovies(initial);
        setCurrentPage(1);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const loadMore = async () => {
    const startIndex = currentPage * LOAD_STEP;
    const newMovies = await getPopularMoviesChunk(startIndex, LOAD_STEP);
    setMovies((prev) => [...prev, ...newMovies]);
    setCurrentPage((prev) => prev + 1);
  };

  return { movies, loadMore };
}
