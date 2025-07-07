import { BaseMovie } from "@/types/movie";

export function removeDuplicateMovies<T extends BaseMovie>(movies: T[]): T[] {
  const seen = new Set();
  return movies.filter((movie) => {
    const id = movie.id;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
