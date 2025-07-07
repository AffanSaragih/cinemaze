import { TmdbMovie } from '@/types/tmdb';
import { BaseMovie } from '@/types/movie';

export function normalizeMovie(
  raw: TmdbMovie & {
    trailerKey?: string;
    isTrending?: boolean;
    index?: number;
  }
): BaseMovie {
  return {
    id: raw.id,
    title: raw.title,
    poster: `https://image.tmdb.org/t/p/w500${raw.poster_path}`,
    rating: raw.vote_average,
    overview: raw.overview,
    backdropUrl: `https://image.tmdb.org/t/p/original${raw.backdrop_path}`,
    releaseDate: raw.release_date,
    genreIds: raw.genre_ids,
    trailerKey: raw.trailerKey,
    isTrending: raw.isTrending,
    index: raw.index,
  };
}
