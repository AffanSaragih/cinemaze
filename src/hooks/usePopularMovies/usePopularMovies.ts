import { useState, useEffect } from 'react';
import { getPopularMoviesChunk, Movie } from '@/services/getPopularMoviesChunk';

const LOAD_STEP = 100;

export function usePopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchInitial = async () => {
      const initial = await getPopularMoviesChunk(0, LOAD_STEP);
      setMovies(initial);
      setCurrentPage(1);
    };
    fetchInitial();
  }, []);

  const loadMore = async (cols: number) => {
    const startIndex = currentPage * LOAD_STEP;
    const newMovies = await getPopularMoviesChunk(startIndex, LOAD_STEP);
    setMovies((prev) => [...prev, ...newMovies]);
    setCurrentPage((prev) => prev + 1);
  };

  return { movies, loadMore };
}
