import axios from 'axios';
import { BaseMovie } from '@/types/movie';
import { normalizeMovie } from '@/utils/normalize/normalizeMovie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getPopularMoviesChunk(
  startIndex: number,
  count: number,
  cache?: Map<number, any>
): Promise<BaseMovie[]> {
  const itemsPerPage = 20;
  const startPage = Math.floor(startIndex / itemsPerPage) + 1;
  const endPage = Math.floor((startIndex + count - 1) / itemsPerPage) + 1;

  let allMovies: any[] = [];

  try {
    for (let page = startPage; page <= endPage; page++) {
      if (cache?.has(page)) {
        allMovies = allMovies.concat(cache.get(page));
        continue;
      }

      const res = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          page,
          language: 'en-US',
        },
      });

      cache?.set(page, res.data.results);
      allMovies = allMovies.concat(res.data.results);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }

  const offset = startIndex % itemsPerPage;
  const sliced = allMovies.slice(offset, offset + count);

  return sliced.map(normalizeMovie);
}
