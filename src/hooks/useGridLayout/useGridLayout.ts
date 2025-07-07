import { useEffect, useRef, useState } from 'react';

export function useGridLayout<T = HTMLElement>() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(1);
  const [lastRowIndices, setLastRowIndices] = useState<number[]>([]);

  const calculateCols = () => {
    const wrapper = gridRef.current;
    if (!wrapper) return 1;
    const style = window.getComputedStyle(wrapper);
    const columns = style.getPropertyValue('grid-template-columns');
    return columns.split(' ').length || 1;
  };

  const calculateGrid = () => {
    const wrapper = gridRef.current;
    if (!wrapper) return;

    const movieCards = Array.from(wrapper.children).filter(
      (el) =>
        !(el as HTMLElement).classList.contains('grow') &&
        !(el as HTMLElement).classList.contains('loadMoreWrapper')
    ) as HTMLElement[];

    const rowsMap = new Map<number, number[]>();

    movieCards.forEach((card, index) => {
      const top = card.offsetTop;
      if (!rowsMap.has(top)) rowsMap.set(top, []);
      rowsMap.get(top)!.push(index);
    });

    const allTops = Array.from(rowsMap.keys());
    const maxTop = Math.max(...allTops);
    const lastRow = rowsMap.get(maxTop) || [];

    setLastRowIndices(lastRow);
  };

  useEffect(() => {
    const updateLayout = () => {
      const currentCols = calculateCols();
      setCols(currentCols);
      requestAnimationFrame(calculateGrid);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return {
    gridRef,
    cols,
    lastRowIndices,
    recalculateGrid: () => requestAnimationFrame(calculateGrid),
  };
}
