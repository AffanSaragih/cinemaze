import React from 'react';
import styles from './MovieCard.module.scss';
import iconStyles from '@/components/ui/Button/Button.module.scss';
import { Button } from '@/components/ui/Button';
import { BaseMovie } from '@/types/movie';
import { ButtonFavorite } from '@/components/ui/ButtonFavorite/ButtonFavorite';
import StarIcon from '@/assets/Star.svg';
import PlayIcon from '@/assets/Play.svg';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import { fetchTrailerKey } from '@/utils/fetchTrailer';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useToastContext } from '@/provider/ToastProvider/ToastProvider';

export const MovieCard: React.FC<BaseMovie> = ({
  id,
  poster,
  title,
  rating,
  overview,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { resetSearch } = useSearch();
  const { showToast } = useToastContext();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();

  const handleRedirect = () => {
    resetSearch();
    navigate(`/detail/${id}`);
  };

  const handleWatchTrailer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    const key = await fetchTrailerKey(id);
    setIsLoading(false);

    if (key) {
      window.open(`https://www.youtube.com/watch?v=${key}`, '_blank');
    } else {
      showToast("Trailer isn't available");
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Favoriting', id);
    if (isFavorite(id)) {
      removeFavorite(id);
      showToast('Removed from Favorites', 1500);
    } else {
      addFavorite({ id, poster, title, rating, overview });
      showToast('Added to Favorites');
    }
  };

  return (
    <div className={styles.cardWrapper} onClick={handleRedirect}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            <img
              src={poster}
              alt={`${title} Poster`}
              className={styles.image}
            />
          </div>

          <div className={styles.text}>
            <div className={styles.textWrapper}>
              <div className={styles.title}>{title}</div>
              <div className={styles.rating}>
                <StarIcon className={styles.starIcon} />
                <span>{rating.toFixed(1)}/10</span>
              </div>
              <div className={styles.description}>{overview}</div>
            </div>

            <Button
              className={styles.secondWatchTrailerButton}
              onClick={handleWatchTrailer}
              disabled={isLoading}
            >
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  Watch Trailer <PlayIcon className={iconStyles.icon} />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            className={styles.watchTrailerButton}
            onClick={handleWatchTrailer}
            disabled={isLoading}
          >
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Watch Trailer <PlayIcon className={iconStyles.icon} />
              </>
            )}
          </Button>

          <div className={styles.favoriteButtonWrapper}>
            <ButtonFavorite
              isFavorite={isFavorite(id)}
              onClick={handleToggleFavorite}
            />
          </div>
        </div>

        <div className={styles.topRightButton}>
          <ButtonFavorite
            isFavorite={isFavorite(id)}
            onClick={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
};
