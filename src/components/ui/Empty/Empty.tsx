import React from 'react';
import styles from './Empty.module.scss';
import { Button } from '@/components/ui/Button/Button';
import EmptyIcon from '@/assets/emptyIcon.svg?react';
import { useNavigate } from 'react-router-dom';

interface EmptyProps {
  title?: string;
  subtitle?: string;
  showCTA?: boolean;
  onClickCTA?: () => void;
  ctaText?: string;
}
export const Empty: React.FC<EmptyProps> = ({
  title = 'Data Empty',
  subtitle = "You don't have a favorite movie yet",
  showCTA = true,
  onClickCTA,
  ctaText = 'Explore Movies',
}) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    if (onClickCTA) {
      onClickCTA();
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.emptyStateWrapper}>
      <div className={styles.emptyStateContent}>
        <div className={styles.emptyStateVisual}>
          <EmptyIcon className={styles.emptyStateIcon} />
          <div className={styles.emptyStateText}>
            <div className={styles.emptyStateTitle}>{title}</div>
            <div className={styles.emptyStateSubtitle}>{subtitle}</div>
          </div>
        </div>
        {showCTA && (
          <div className={styles.emptyStateAction}>
            <Button onClick={handleExploreClick}>{ctaText}</Button>
          </div>
        )}
      </div>
    </div>
  );
};
