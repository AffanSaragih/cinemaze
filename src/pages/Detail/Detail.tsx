import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DetailCard } from '@/components/ui/DetailCard';
import { fetchMovieDetail, fetchMovieCasts } from '@/services/detailApi';
import type { MovieDetail, Cast } from '@/types/movie';
import styles from './Detail.module.scss';

export const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [casts, setCasts] = useState<Cast[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const movieData = await fetchMovieDetail(Number(id));
      const castData = await fetchMovieCasts(Number(id));
      setMovie(movieData);
      setCasts(castData);
    })();
  }, [id]);

  useEffect(() => {
    if (movie?.id) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movie?.id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <section className={styles.detailPage}>
      <div className='container'>
        <DetailCard {...movie} casts={casts} />
      </div>
    </section>
  );
};
