import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  once?: boolean;
  threshold?: number;
}

export const useScrollReveal = ({ once = true, threshold = 0.1 }: UseScrollRevealOptions = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            if (el) observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [once, threshold]);

  return { ref, isVisible };
};
