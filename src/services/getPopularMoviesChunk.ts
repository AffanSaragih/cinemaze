import axios from 'axios';
import { BaseMovie } from '@/types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export async function getPopularMoviesChunk(startIndex: number, count: number): Promise<BaseMovie[]> {
  const itemsPerPage = 20;
  const startPage = Math.floor(startIndex / itemsPerPage) + 1;
  const endPage = Math.floor((startIndex + count - 1) / itemsPerPage) + 1;

  let allMovies: any[] = [];

  try {
    for (let page = startPage; page <= endPage; page++) {
      const res = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          page,
          language: 'en-US',
        },
      });

      allMovies = allMovies.concat(res.data.results);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];  // Graceful fallback: return array kosong kalau error
  }

  const offset = startIndex % itemsPerPage;
  const sliced = allMovies.slice(offset, offset + count);

  return sliced.map((movie: any) => ({
    id: movie.id,
    movieId: movie.id,
    title: movie.title,
    poster: movie.poster_path
      ? `${BASE_IMAGE_URL}${movie.poster_path}`
      : '/default-poster.jpg',
    rating: movie.vote_average,
  }));
}
