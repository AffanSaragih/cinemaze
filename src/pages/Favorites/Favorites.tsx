import React from 'react';
import styles from './Favorites.module.scss';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { MovieCard } from '@/components/sections/MovieCard/MovieCard';
import { Empty } from '@/components/ui/Empty/Empty';
import { useSearch } from '@/context/SearchContext';

const Favorites: React.FC = () => {
  const favorites = useFavoriteStore((s) => s.favorites);
  const { searchTerm } = useSearch();

  const filteredFavorites = favorites.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEmpty = favorites.length === 0;
  const noMatch = searchTerm && filteredFavorites.length === 0;

  return (
    <div className={styles.favoriteWrapper}>
      <div className='container'>
        <div className={styles.title}>Favorites</div>

        {isEmpty ? (
          <Empty title='Data Empty' />
        ) : noMatch ? (
          <Empty
            title='No matching movies found.'
            subtitle='Try different keywords.'
            showCTA={false}
          />
        ) : (
          <div className={styles.gridWrapper}>
            {filteredFavorites.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        )}
        <div className={styles.pageSpacer} />
      </div>
    </div>
  );
};

export default Favorites;