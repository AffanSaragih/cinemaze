import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BaseMovie } from '@/types/movie';

interface MovieState {
  allMovies: BaseMovie[];
  setAllMovies: (movies: BaseMovie[]) => void;
  resetMovies: () => void;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set) => ({
      allMovies: [],
      setAllMovies: (movies) => set({ allMovies: movies }),
      resetMovies: () => set({ allMovies: [] }),
    }),
    {
      name: 'movie-storage', // key di localStorage
      partialize: (state) => ({ allMovies: state.allMovies }),
    }
  )
);
