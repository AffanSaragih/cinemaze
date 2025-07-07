import React, { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { TrendingNow } from '@/components/sections/TrendingNow';
import { ExploreMore } from '@/components/sections/ExploreMore';
import { ScrollButton } from '@/components/ui/ScrollButton';
import { LoadingAnimation } from '@/components/ui/LoadingAnimation';
import { Footer } from '@/components/layout/Footer';
import { getTrendingMovies } from '@/services/tmdb';
import { getTrailerKey } from '@/services/getTrailerKey';
// import { useScrollRestoration } from '@/hooks/useScrollRestoration/useScrollRestoration';
import { BaseMovie } from '@/types/movie';
import { normalizeMovie } from '@/utils/normalize/normalizeMovie';
import { TmdbMovie } from '@/types/tmdb';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<BaseMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setExploreReady] = useState(false);

  // Untuk animasi reveal TrendingNow
  const trendingNowRef = useRef<HTMLDivElement>(null);
  const [showTrending, setShowTrending] = useState(false);

  // useScrollRestoration(loading || !exploreReady);
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'auto' });
}, []);


  useEffect(() => {
    const fetchTrendingMovies = async () => {
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
      } catch (error) {
        console.error('Failed to fetch trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Intersection Observer untuk reveal TrendingNow
  useEffect(() => {
    if (!trendingNowRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowTrending(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(trendingNowRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return <LoadingAnimation text='Loading Content...' onlyText={true} />;
  }

  const trendingHeroMovie = trendingMovies[0];

  return (
    <div className={styles.main}>
      <Header />

      {/* Hero + ScrollButton */}
      <section className={styles.heroSection}>
        {trendingHeroMovie && <Hero {...trendingHeroMovie} />}
        <ScrollButton />
      </section>

      {/* Trending Now */}
      <section
        ref={trendingNowRef}
        className={`${styles.trendingSection} ${
          showTrending ? styles.reveal : ''
        }`}
      >
        <TrendingNow movies={trendingMovies} />
      </section>

      {/* Explore More */}
      <ExploreMore onReady={() => setExploreReady(true)} />

      <Footer />
    </div>
  );
};
