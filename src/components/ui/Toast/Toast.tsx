import React, { useEffect, useState } from 'react';
import styles from './Toast.module.scss';
import ChecklistIcon from '@/assets/Checklist.svg?react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  duration = 2000,
  onClose,
}) => {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 10);
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration);

    const removeTimer = setTimeout(() => {
      onClose();
    }, duration + 500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <button
      onClick={onClose}
      className={`
        ${styles['toast-close-btn']}
        ${show ? styles.show : ''}
        ${fadeOut ? styles['fade-out'] : ''}
      `}
      aria-live='assertive'
      aria-atomic='true'
    >
      <ChecklistIcon className={styles.checklistIcon} />
      <span className={styles.message}>{message}</span>
    </button>
  );
};
