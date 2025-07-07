import React, { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './MovieCard.module.scss';
import StarIcon from '@/assets/Star.svg';
import { BaseMovie } from '@/types/movie';

interface MovieCardProps extends BaseMovie {
  isDisabled?: boolean;
  trailerKey?: string;
  hideActions?: boolean;
}

const hoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 0.95,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const CardContent: React.FC<{
  title: string;
  imgSrc: string;
  isTrending: boolean;
  index?: number;
  rating: number;
  isHovered?: boolean;
  trailerKey?: string;
}> = memo(
  ({
    title,
    imgSrc,
    isTrending,
    index,
    rating,
    isHovered = false,
    trailerKey,
  }) => (
    <motion.div
      className={styles.card}
      variants={hoverVariants}
      initial='rest'
      whileHover='hover'
      animate='rest'
    >
      <div
        className={clsx(styles.imageWrapper, {
          [styles.playing]: isHovered && trailerKey,
        })}
      >
        {isHovered && trailerKey && (
          <AnimatePresence>
            <motion.iframe
              key='trailer'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.trailerPreview}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
              title={`${title} trailer preview`}
              allow='autoplay; encrypted-media'
              allowFullScreen
            />
          </AnimatePresence>
        )}
        <img
          src={imgSrc}
          alt={title}
          title={title}
          className={styles.image}
          loading='lazy'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg';
          }}
        />
        {isTrending && typeof index === 'number' && (
          <div className={styles.trendingBadge}>{index + 1}</div>
        )}
        {/* Tidak ada tombol overlay */}
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        <div className={styles.rating}>
          <StarIcon className={styles.starIcon} />
          <span className={styles.number}>{rating.toFixed(1)}/10</span>
        </div>
      </div>
    </motion.div>
  )
);
CardContent.displayName = 'CardContent';

export const MovieCard: React.FC<MovieCardProps> = memo(
  ({
    id,
    title,
    poster,
    rating,
    isTrending = false,
    index,
    isDisabled = false,
    trailerKey,
  }) => {
    const imgSrc = poster || '/placeholder.jpg';
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const content = (
      <CardContent
        title={title}
        imgSrc={imgSrc}
        isTrending={isTrending}
        index={index}
        rating={rating}
        isHovered={isHovered}
        trailerKey={trailerKey}
      />
    );

    return isDisabled ? (
      <div
        className={clsx(styles.link, styles.disabled)}
        aria-disabled='true'
        tabIndex={-1}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </div>
    ) : (
      <Link
        to={`/detail/${id}`}
        className={styles.link}
        aria-label={`See detail for ${title}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </Link>
    );
  }
);

MovieCard.displayName = 'MovieCard';
export default MovieCard;
