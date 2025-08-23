import React from 'react';
import styles from './CastCard.module.scss';

type CastCardProps = {
  image: string;
  name: string;
  character: string;
};

export const CastCard: React.FC<CastCardProps> = ({
  image,
  name,
  character,
}: CastCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={`${name} Picture`} className={styles.image} />
      </div>
      <div className={styles.info}>
        <h4>{name}</h4>
        <p>{character}</p>
      </div>
    </div>
  );
};
