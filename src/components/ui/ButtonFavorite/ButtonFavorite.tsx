import React from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button/Button';
import { HeartIcon } from '@/components/ui/HeartIcon/HeartIcon';
import styles from './ButtonFavorite.module.scss';

type ButtonFavoriteProps = {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
};

export const ButtonFavorite: React.FC<ButtonFavoriteProps> = ({
  isFavorite,
  onClick,
  className,
}) => {
  return (
    <Button
      variant='secondary'
      fullWidth={false}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={clsx(
        styles.buttonFavorite,
        isFavorite && styles.active,
        className
      )}
      onClick={onClick}
    >
      <HeartIcon filled={isFavorite} className={styles.heartIcon} />
    </Button>
  );
};
