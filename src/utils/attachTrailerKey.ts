import { getTrailerKey } from '@/services/getTrailerKey';
import { TmdbMovie } from '@/types/tmdb';
import { BaseMovie } from '@/types/movie';

export const attachTrailerKeyToMovies = async (
  movies: TmdbMovie[]
): Promise<BaseMovie[]> => {
  const withTrailers = await Promise.all(
    movies.map(async (movie) => {
      const trailerKey = await getTrailerKey(movie.id);
      return {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
        rating: movie.vote_average,
        trailerKey: trailerKey ?? undefined,
      };
    })
  );
  return withTrailers;
};
