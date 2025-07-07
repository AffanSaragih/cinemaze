import { TmdbMovie, TmdbCredits } from '@/types/tmdb';
import { normalizeMovieDetail } from '@/utils/normalize/normalizeMovieDetail';
import { normalizeCast } from '@/utils/normalize/normalizeCredits';
import { BaseMovie, Cast } from '@/types/movie';

const TMDB_API = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchMovieDetail(id: number): Promise<BaseMovie> {
  const res = await fetch(`${TMDB_API}/movie/${id}?api_key=${API_KEY}`);
  const data: TmdbMovie = await res.json();
  return normalizeMovieDetail(data);
}

export async function fetchMovieCasts(id: number): Promise<Cast[]> {
  const res = await fetch(`${TMDB_API}/movie/${id}/credits?api_key=${API_KEY}`);
  const data: TmdbCredits = await res.json();
  return data.cast.slice(0, 10).map(normalizeCast);
}
