import { MovieDetail } from '@/types/movie';
import { TmdbMovie, TmdbCast } from '@/types/tmdb';
import { normalizeCast } from './normalizeCredits';

interface RawMovieDetail extends TmdbMovie {
  genres?: { id: number; name: string }[];
  credits?: {
    cast: TmdbCast[];
  };
}

export function normalizeMovieDetail(raw: RawMovieDetail): MovieDetail {
  return {
    id: raw.id,
    title: raw.title,
    releaseDate: raw.release_date,
    rating: raw.vote_average,
    genre: raw.genres.map((g) => g.name).slice(0, 3),
    ageLimit: raw.adult ? 18 : 13,
    poster: `https://image.tmdb.org/t/p/w500${raw.poster_path}`,
    backdropUrl: `https://image.tmdb.org/t/p/original${raw.backdrop_path}`,
    overview: raw.overview,
    casts: raw.credits?.cast?.slice(0, 5).map(normalizeCast) ?? [],
  };
}
