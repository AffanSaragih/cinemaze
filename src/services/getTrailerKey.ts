import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getTrailerKey = async (
  movieId: number
): Promise<string | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: API_KEY },
    });

    type VideoResult = {
      key: string;
      site: string;
      type: string;
    };

    const trailers = res.data.results as VideoResult[];
    const youtubeTrailer = trailers.find(
      (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
    );

    return youtubeTrailer?.key || null;
  } catch (err) {
    console.error(`❌ Failed to fetch trailer for movie ${movieId}`, err);
    return null;
  }
};
