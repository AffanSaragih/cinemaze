import React from 'react';
import styles from './MetaCard.module.scss';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const MetaCard: React.FC<InfoCardProps> = ({ icon, label, value }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
};
