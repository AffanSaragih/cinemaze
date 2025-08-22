// src/context/SearchContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const clearSearch = () => {
    setSearchTerm('');
    setSearchOpen(false);
  }

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, searchOpen, openSearch, closeSearch, clearSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
};
