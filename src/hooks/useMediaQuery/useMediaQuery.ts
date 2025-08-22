import { useEffect, useState } from "react";

/**
 * Detect if a CSS media query matches (desktop/mobile aware logic in React).
 * Example: useMediaQuery("(min-width: 768px)")
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // initial sync
    setMatches(mql.matches);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
