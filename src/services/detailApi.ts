import { TmdbMovie, TmdbCredits } from '@/types/tmdb';
import { normalizeMovieDetail } from '@/utils/normalize/normalizeMovieDetail';
import { normalizeCast } from '@/utils/normalize/normalizeCredits';
import { MovieDetail, Cast } from '@/types/movie';

const TMDB_API =
  import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchMovieDetail(id: number): Promise<MovieDetail> {
  const res = await fetch(`${TMDB_API}/movie/${id}?api_key=${API_KEY}&language=en-US`);
  const data: TmdbMovie = await res.json();
  return normalizeMovieDetail(data);
}

export async function fetchMovieCasts(id: number): Promise<Cast[]> {
  const res = await fetch(`${TMDB_API}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`);
  const data: TmdbCredits = await res.json();
  return data.cast.slice(0, 12).map(normalizeCast);
}
