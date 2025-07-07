import { useEffect } from 'react';

export function useScrollRestoration(shouldWait = false): void {
  useEffect(() => {
    const SCROLL_KEY = 'scrollY';

    const restoreScroll = () => {
      const savedScrollY = sessionStorage.getItem(SCROLL_KEY);
      if (!shouldWait && savedScrollY !== null) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        sessionStorage.removeItem(SCROLL_KEY);
      }
    };

    const saveScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };

    restoreScroll();
    window.addEventListener('beforeunload', saveScroll);

    return () => {
      window.removeEventListener('beforeunload', saveScroll);
    };
  }, [shouldWait]);
}
