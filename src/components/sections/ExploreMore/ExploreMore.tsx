import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import styles from './ExploreMore.module.scss';
import { ScrollRevealItem } from '@/components/ui/ScrollRevealItem';
import { MovieCardPreview } from '@/components/ui/MovieCardPreview/MovieCardPreview';
import { Button } from '@/components/ui/Button';
import { LoadingAnimation } from '@/components/ui/LoadingAnimation';
import { getPopularMoviesChunk } from '@/services/getPopularMoviesChunk';
import { useGridLayout } from '@/hooks/useGridLayout/useGridLayout';
import { useDisableLastRow } from '@/hooks/useDisableLastRow/useDisableLastRow';
import { removeDuplicateMovies } from '@/utils/removeDuplicateMovies';
import type { BaseMovie } from '@/types/movie';
import { ScrollButton } from '@/components/ui/ScrollButton';

interface ExploreMoreProps {
  onReady?: () => void;
}

const INITIAL_LOAD = 50;
const LOAD_STEP = 25;
const STORAGE_KEY = 'exploreMoreState';

export const ExploreMore: React.FC<ExploreMoreProps> = ({ onReady }) => {
  const { gridRef, lastRowIndices, recalculateGrid } = useGridLayout();

  const [movies, setMovies] = useState<BaseMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxVisible, setMaxVisible] = useState(INITIAL_LOAD);
  const [isLoading, setIsLoading] = useState(false);
  const didFireReady = useRef(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMovies(parsed.movies);
        setCurrentPage(parsed.currentPage);
        setMaxVisible(parsed.maxVisible);
      } catch {
        fetchInitialMovies();
      }
    } else {
      fetchInitialMovies();
    }

    async function fetchInitialMovies() {
      setIsLoading(true);
      try {
        const initial = await getPopularMoviesChunk(0, INITIAL_LOAD);
        setMovies(removeDuplicateMovies(initial));
        setCurrentPage(1);
        setMaxVisible(INITIAL_LOAD);
      } catch (error) {
        console.error('Failed to fetch initial movies:', error);
        toast.error('Gagal memuat film. Coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (movies.length) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ movies, currentPage, maxVisible })
      );
    }
  }, [movies, currentPage, maxVisible]);

  useEffect(() => {
    recalculateGrid();
  }, [movies, maxVisible, recalculateGrid]);

  useEffect(() => {
    if (
      !didFireReady.current &&
      movies.length > 0 &&
      maxVisible >= movies.length &&
      lastRowIndices.length > 0
    ) {
      didFireReady.current = true;
      onReady?.();
    }
  }, [movies, maxVisible, lastRowIndices, onReady]);

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true);
    try {
      const startIndex = maxVisible;
      const newMovies = await getPopularMoviesChunk(startIndex, LOAD_STEP);
      setMovies((prev) => removeDuplicateMovies([...prev, ...newMovies]));
      setCurrentPage((prev) => prev + 1);
      setMaxVisible((prev) => prev + LOAD_STEP);
    } catch (error) {
      console.error('Failed to load more movies:', error);
      toast.error('Gagal memuat film tambahan.');
    } finally {
      setIsLoading(false);
    }
  }, [maxVisible]);

  const visibleMovies = useMemo(
    () => movies.slice(0, Math.min(maxVisible, movies.length)),
    [movies, maxVisible]
  );

  const disabledFlags = useDisableLastRow(visibleMovies, lastRowIndices);

  return (
    <section className={styles.newReleaseSection}>
      <div className='container'>
        <h2 className={styles.exploreMoreTitle}>Explore More</h2>
        <div ref={gridRef} className={styles.gridWrapper}>
          {visibleMovies.map((movie, index) => (
            <ScrollRevealItem
              key={`${movie.id}-${index}`}
              className={clsx(styles.grow, styles.cardReveal)}
            >
              <MovieCardPreview {...movie} isDisabled={disabledFlags[index]} />
            </ScrollRevealItem>
          ))}
        </div>
        <div className={styles.loadMoreWrapper}>
          {isLoading ? (
            <LoadingAnimation text='Loading...' />
          ) : (
            <Button
              variant='secondary'
              onClick={handleLoadMore}
              className={styles.button}
            >
              Load More
            </Button>
          )}
        </div>
      </div>
      <ScrollButton />
    </section>
  );
};
