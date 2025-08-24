import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import ArrowIcon from '@/assets/ArrowUp.svg?react';
import styles from './ScrollButton.module.scss';

interface ScrollButtonProps {
  onClick?: () => void;
}

export const ScrollButton: React.FC<ScrollButtonProps> = ({ onClick }) => {
  const [isBottom, setIsBottom] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    setIsBottom(scrollPosition >= pageHeight - 100);
  };

  const handleClick = () => {
    if (onClick) return onClick();

    if (isBottom) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.wrapper}>
      <Button variant='secondary' fullWidth={false} onClick={handleClick}>
        <ArrowIcon className={isBottom ? styles.iconDown : styles.iconUp} />
      </Button>
    </div>
  );
};
