import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import iconStyles from '@/components/ui/Button/Button.module.scss';
import PlayIcon from '@/assets/Play.svg';
import styles from './Hero.module.scss';
import { fetchTrailerKey } from '@/utils/fetchTrailer';
import type { BaseMovie } from '@/types/movie';

export const Hero: React.FC<BaseMovie> = ({
  id,
  title,
  backdropUrl,
  overview,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchTrailer = async () => {
    setIsLoading(true);
    const key = await fetchTrailerKey(id);
    setIsLoading(false);

    if (key) {
      window.open(`https://www.youtube.com/watch?v=${key}`, '_blank');
    } else {
      alert("Trailer isn't Available");
    }
  };

  return (
    <div className={styles.hero}>
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

      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h1 className={styles.title}>{title || 'Untitled Movie'}</h1>
          <p className={`${styles.overview} ${styles.hideOnMobile}`}>
            {overview || 'No overview available.'}
          </p>
        </div>

        <div className={styles.actionsBlock}>
          <Button
            variant='primary'
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
          <Button variant='secondary' onClick={() => navigate(`/detail/${id}`)}>
            See Detail
          </Button>
        </div>
      </div>
    </div>
  );
};
