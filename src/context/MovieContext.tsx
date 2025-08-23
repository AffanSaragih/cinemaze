import React, { createContext, useContext, useState, useEffect } from 'react';
import { BaseMovie } from '@/types/movie';

interface MovieContextType {
  allMovies: BaseMovie[];
  setAllMovies: (movies: BaseMovie[]) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allMovies, setAllMoviesState] = useState<BaseMovie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('allMovies');
    if (stored) {
      try {
        setAllMoviesState(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse allMovies from localStorage');
      }
    }
  }, []);

  const setAllMovies = (movies: BaseMovie[]) => {
    setAllMoviesState(movies);
    localStorage.setItem('allMovies', JSON.stringify(movies));
  };

  return (
    <MovieContext.Provider value={{ allMovies, setAllMovies }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovie must be used within a MovieProvider');
  return context;
};
