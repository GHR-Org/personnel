/* eslint-disable prefer-const */
// hooks/useFakeLoading.ts
import { useEffect, useState } from "react";

export function useFakeLoading(duration = 1000): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [duration]);

  return progress;
}
