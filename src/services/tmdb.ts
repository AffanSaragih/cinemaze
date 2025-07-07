const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (
  endpoint: string,
  query: Record<string, string> = {}
) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);

  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB fetch error: ${res.statusText}`);
  return res.json();
};

export const getTrendingMovies = () => {
  return fetchFromTMDB('/trending/movie/day');
};

// export const getPopularMovies = async (totalPages = 10) => {
//   let results: any[] = [];

//   for (let page = 1; page <= totalPages; page++) {
//     const res = await fetchFromTMDB('/movie/popular', { page: page.toString() });
//     results = results.concat(res.results);
//   }

//   return { results };
// };

// export const getPopularMovies = async (totalPages = 5) => {
//   let results: any[] = [];

//   for (let page = 1; page <= totalPages; page++) {
//     const res = await fetchFromTMDB('/movie/popular', { page: page.toString() });
//     results = results.concat(res.results);
//   }

//   results.sort((a: any, b: any) => b.vote_average - a.vote_average);
//   return { results };
// };