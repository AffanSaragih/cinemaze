import React from 'react';
import styles from './LoadingAnimation.module.scss';
import clsx from 'clsx';
import LoadingIcon from '@/assets/bxs_tv.svg';

interface LoadingAnimationProps {
  text?: string;
  onlyText?: boolean;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  text = 'Loading...',
  onlyText = false,
}) => {
  return (
    <div className={clsx(styles.loadingWrapper, onlyText && styles.onlyText)}>
      <LoadingIcon className={styles.loadingIcon} />
      <span className={styles.loadingText}>{text}</span>
    </div>
  );
};
