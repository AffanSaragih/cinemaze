import React, { useState } from 'react';
import styles from './DetailCard.module.scss';
import iconStyles from '@/components/ui/Button/Button.module.scss';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button/Button';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { MetaCard } from '@/components/ui/MetaCard';
import { CastCard } from '@/components/ui/CastCard';
import { Toast } from '@/components/ui/Toast';
import { MovieDetail } from '@/types/movie';
import { formatDateToIndoLong } from '@/utils/formatDate';
import { fetchTrailerKey } from '@/utils/fetchTrailer';
import CalendarIcon from '@/assets/Calendar.svg';
import PlayIcon from '@/assets/Play.svg';
import StarIcon from '@/assets/Star.svg';
import VideoIcon from '@/assets/Video.svg';
import HappyEmojiIcon from '@/assets/HappyEmoji.svg';

const FavoriteButton: React.FC<{
  isFavorite: boolean;
  onClick: () => void;
}> = ({ isFavorite, onClick }) => (
  <Button
    variant='secondary'
    fullWidth={false}
    className={clsx(styles.favoriteButton, isFavorite && styles.active)}
    onClick={onClick}
  >
    <HeartIcon className={styles.heartIcon} filled={isFavorite} />
  </Button>
);

const CTAButtons: React.FC<{
  isFavorite: boolean;
  toggleFavorite: () => void;
  handleWatchTrailer: () => void;
  isLoading: boolean;
}> = ({ isFavorite, toggleFavorite, handleWatchTrailer, isLoading }) => (
  <div className={styles.ctaButton}>
    <Button onClick={handleWatchTrailer} disabled={isLoading}>
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          Watch Trailer <PlayIcon className={iconStyles.icon} />
        </>
      )}
    </Button>
    <div className={styles.favoriteButtonWrapper}>
      <FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite} />
    </div>
  </div>
);

const MetaCardsGroup: React.FC<{
  rating: number;
  genre: string[];
  ageLimit: number;
}> = ({ rating, genre, ageLimit }) => (
  <div className={styles.metaCards}>
    <MetaCard
      icon={<StarIcon />}
      label='Rating'
      value={`${rating.toFixed(1)}/10`}
    />
    <MetaCard icon={<VideoIcon />} label='Genre' value={genre.join(', ')} />

    <MetaCard
      icon={<HappyEmojiIcon />}
      label='Age Limit'
      value={`${ageLimit}+`}
    />
  </div>
);

export const DetailCard: React.FC<MovieDetail> = ({
  id,
  backdropUrl,
  poster,
  title,
  releaseDate,
  rating,
  genre,
  overview,
  ageLimit,
  casts = [],
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    setToastMessage(
      newState ? 'Success Add to Favorites' : 'Success Remove from Favorites'
    );
    setShowToast(true);
  };

  const handleWatchTrailer = async () => {
    setIsLoading(true);
    const key = await fetchTrailerKey(id);
    setIsLoading(false);

    if (key) {
      window.open(`https://www.youtube.com/watch?v=${key}`, '_blank');
    } else {
      setToastMessage("Trailer isn't Available");
      setShowToast(true);
    }
  };

  return (
    <div className={styles.detailContainer}>
      {backdropUrl && (
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <motion.div
            className={styles.gradientOverlay}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}

      <div className={styles.detailCard}>
        {/* Top Section */}
        <div className={styles.top}>
          <img src={poster} alt={title} className={styles.poster} />

          {/* Mobile Info */}
          <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.date}>
              <CalendarIcon className={styles.icon} />
              {releaseDate
                ? formatDateToIndoLong(releaseDate)
                : 'Tanggal tidak tersedia'}
            </div>
          </div>

          {/* Desktop Info */}
          <div className={styles.cardContent}>
            <div className={styles.info}>
              <h3 className={styles.title}>{title}</h3>
              <div className={styles.date}>
                <CalendarIcon className={styles.icon} />
                {releaseDate
                  ? formatDateToIndoLong(releaseDate)
                  : 'Tanggal tidak tersedia'}
              </div>
            </div>

            {/* Desktop CTA */}
            <CTAButtons
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              handleWatchTrailer={handleWatchTrailer}
              isLoading={isLoading}
            />

            {/* Desktop MetaCards */}
            <MetaCardsGroup rating={rating} genre={genre} ageLimit={ageLimit} />
          </div>
        </div>

        {/* Mobile CTA */}
        <CTAButtons
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          handleWatchTrailer={handleWatchTrailer}
          isLoading={isLoading}
        />

        {/* Mobile MetaCards */}
        <MetaCardsGroup rating={rating} genre={genre} ageLimit={ageLimit} />

        {/* Toast */}
        {showToast && (
          <Toast message={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </div>

      {/* Overview */}
      <div className={styles.overview}>
        <h2 className={styles.overviewTitle}>Overview</h2>
        <p className={styles.overviewText}>{overview}</p>
      </div>

      {/* Cast & Crew */}
      <div className={styles.castAndCrew}>
        <h2 className={styles.castsAndCrews}>Cast & Crew</h2>
        <div className={styles.casters}>
          {casts.map((cast) => (
            <CastCard
              key={cast.id}
              image={cast.profileUrl}
              name={cast.name}
              character={cast.character}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
