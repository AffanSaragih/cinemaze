// export const fetchTrailerKey = async (movieId: number): Promise<string | null> => {
//   try {
//     const res = await fetch(
//       `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
//     );
//     const data = await res.json();
//     const trailer = data.results.find(
//       (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
//     );
//     return trailer?.key ?? null;
//   } catch (error) {
//     console.error('Error fetching trailer:', error);
//     return null;
//   }
// };
import { TmdbVideo } from '@/types/tmdb';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const isYoutubeTrailer = (video: TmdbVideo) =>
  video.site === 'YouTube' && video.type === 'Trailer';

export const fetchTrailerKey = async (movieId: number): Promise<string | null> => {
  try {
    const response = await fetch(`${TMDB_API_BASE}/movie/${movieId}/videos?api_key=${API_KEY}`);

    if (!response.ok) throw new Error('Failed to fetch trailer data');

    const data = await response.json();
    const trailer = (data.results as TmdbVideo[]).find(isYoutubeTrailer);

    return trailer?.key ?? null;
  } catch (error) {
    console.error('[fetchTrailerKey]', error);
    return null;
  }
};
