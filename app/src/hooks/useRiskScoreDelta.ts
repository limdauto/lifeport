'use client';

import { useEffect, useRef, useState } from 'react';

export function useRiskScoreDelta(score: number) {
  const prevScore = useRef(score);
  const [delta, setDelta] = useState<number | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const diff = score - prevScore.current;
    if (diff !== 0) {
      setDelta(diff);
      setDirection(diff > 0 ? 'up' : 'down');
      const t = setTimeout(() => {
        setDelta(null);
        setDirection(null);
      }, 2400);
      prevScore.current = score;
      return () => clearTimeout(t);
    }
  }, [score]);

  return { delta, direction };
}
