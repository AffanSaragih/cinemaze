import React, { useEffect, useState, useRef } from 'react';
import { Hero } from '@/components/sections/Hero';
import { TrendingNow } from '@/components/sections/TrendingNow';
import { ExploreMore } from '@/components/sections/ExploreMore';
import { ScrollButton } from '@/components/ui/ScrollButton';
import { LoadingAnimation } from '@/components/ui/LoadingAnimation';
import { getTrendingMovies } from '@/services/tmdb';
import { getTrailerKey } from '@/services/getTrailerKey';
import { BaseMovie } from '@/types/movie';
import { normalizeMovie } from '@/utils/normalize/normalizeMovie';
import { TmdbMovie } from '@/types/tmdb';
import { useMovieStore } from '@/store/useMovieStore';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<BaseMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const trendingNowRef = useRef<HTMLDivElement>(null);
  const [showTrending, setShowTrending] = useState(false);
  const { setAllMovies } = useMovieStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoading(true);
      try {
        const trendingRes = await getTrendingMovies();
        const enriched = await Promise.all(
          trendingRes.results.map(async (movie: TmdbMovie, index: number) => {
            const trailerKey = await getTrailerKey(movie.id);
            return normalizeMovie({
              ...movie,
              trailerKey: trailerKey ?? undefined,
              isTrending: true,
              index,
            });
          })
        );
        setTrendingMovies(enriched);
        setAllMovies(enriched); // simpan ke global store (zustand)
      } catch (error) {
        console.error('Failed to fetch trending movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingMovies();
  }, [setAllMovies]);

  useEffect(() => {
    if (!trendingNowRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowTrending(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(trendingNowRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className='center-loader'>
        <LoadingAnimation text='Loading Content...' onlyText={true} />
      </div>
    );
  }

  const trendingHeroMovie = trendingMovies[0];

  return (
    <div className={styles.main}>
      <section className={styles.heroSection}>
        {trendingHeroMovie && <Hero {...trendingHeroMovie} />}
      </section>
      <section
        ref={trendingNowRef}
        className={`${styles.trendingSection} ${showTrending ? styles.reveal : ''}`}
      >
        <TrendingNow movies={trendingMovies} />
      </section>
      <ExploreMore />
      <ScrollButton />
    </div>
  );
};
