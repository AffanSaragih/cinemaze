import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealItemProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const ScrollRevealItem: React.FC<ScrollRevealItemProps> = ({
  className,
  children,
  delay = 0.1,
  duration = 0.6,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false, // penting: agar bisa animasi ulang
    amount: 0.2, // 20% masuk viewport langsung animasi
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.95 }
      }
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
