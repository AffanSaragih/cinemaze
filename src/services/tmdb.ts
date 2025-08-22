// src/services/tmdb.ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (
  endpoint: string,
  query: Record<string, string> = {}
) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB fetch error: ${res.statusText}`);
  return res.json();
};

export const getTrendingMovies = () => {
  return fetchFromTMDB('/trending/movie/day');
};

/** 🔎 PENCARIAN FILM */
export const searchMovies = (q: string, opts?: {
  page?: number;
  include_adult?: boolean;
  language?: string; // contoh: 'en-US' | 'id-ID'
}) => {
  return fetchFromTMDB('/search/movie', {
    query: q,
    page: String(opts?.page ?? 1),
    include_adult: String(!!opts?.include_adult),
    language: opts?.language ?? 'en-US',
  });
};
