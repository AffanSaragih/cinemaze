import React from 'react';
import clsx from 'clsx';
import { BaseMovie } from '@/types/movie';
import { MovieCardPreview } from '@/components/ui/MovieCardPreview/MovieCardPreview';
import styles from './MovieList.module.scss';

type MovieListProps = {
  movies: BaseMovie[];
  emptyText?: string;
  variant?: 'grid' | 'list';
};

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  emptyText,
  variant = 'grid',
}) => {
  if (!movies || movies.length === 0) {
    return (
      <div className={styles.emptyState}>{emptyText || 'No movies found.'}</div>
    );
  }

  return (
    <div
      className={clsx(
        styles.gridWrapper,
        variant === 'list' && styles.listWrapper
      )}
    >
      {movies.map((movie) => (
        <MovieCardPreview key={movie.id} {...movie} />
      ))}
    </div>
  );
};
