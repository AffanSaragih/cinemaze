import React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CarouselArrow.module.scss';

type CarouselArrowProps = {
  direction: 'left' | 'right';
  onClick?: () => void;
};

export const CarouselArrow: React.FC<CarouselArrowProps> = ({
  direction,
  onClick,
}) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      type='button'
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      onClick={onClick}
      className={clsx(styles.arrowButton, styles[direction])}
    >
      <Icon className={styles.icon} />
    </button>
  );
};
