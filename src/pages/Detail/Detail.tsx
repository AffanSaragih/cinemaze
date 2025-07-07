// pages/Detail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Asumsikan pakai react-router
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DetailCard } from '@/components/ui/DetailCard';
import { ToastProvider } from '@/provider/ToastProvider';
import { fetchMovieDetail, fetchMovieCasts } from '@/services/detailApi';
import { BaseMovie, Cast } from '@/types/movie';

export const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<BaseMovie | null>(null);
  const [casts, setCasts] = useState<Cast[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const movieData = await fetchMovieDetail(Number(id));
      const castData = await fetchMovieCasts(Number(id));
      setMovie(movieData);
      setCasts(castData);
    };

    fetchData();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <ToastProvider>
      <Header />
      <DetailCard {...movie} casts={casts} />
      <Footer />
    </ToastProvider>
  );
};
