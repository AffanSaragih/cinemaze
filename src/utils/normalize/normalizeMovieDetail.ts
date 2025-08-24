// src/utils/normalize/normalizeMovieDetail.ts
import { MovieDetail } from '@/types/movie';
import { TmdbMovie, TmdbCast } from '@/types/tmdb';
import { normalizeCast } from './normalizeCredits';

interface RawMovieDetail extends TmdbMovie {
  genres?: { id: number; name: string }[];
  credits?: { cast?: TmdbCast[] };
}

export function normalizeMovieDetail(raw: RawMovieDetail): MovieDetail {
  const poster = raw.poster_path
    ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
    : '';
  const backdropUrl = raw.backdrop_path
    ? `https://image.tmdb.org/t/p/original${raw.backdrop_path}`
    : '';

  return {
    id: raw.id,
    title: raw.title ?? (raw as any).name ?? 'Untitled',
    releaseDate: raw.release_date ?? (raw as any).first_air_date,
    rating: Number(raw.vote_average ?? 0),
    genre: Array.isArray(raw.genres) ? raw.genres.map((g) => g.name).slice(0, 3) : [],
    ageLimit: raw.adult ? 18 : 13,
    poster,
    backdropUrl,
    overview: raw.overview ?? '',
    casts: (raw.credits?.cast ?? []).slice(0, 12).map(normalizeCast),
  };
}
