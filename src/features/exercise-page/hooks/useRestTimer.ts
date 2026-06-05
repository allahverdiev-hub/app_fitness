import { useCallback, useEffect, useState } from "react";

export function useRestTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (remaining === null || remaining <= 0) return undefined;
    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [remaining === null]);

  const startRest = useCallback((seconds: number) => {
    if (seconds > 0) setRemaining(seconds);
  }, []);

  const skipRest = useCallback(() => {
    setRemaining(null);
  }, []);

  const isResting = remaining !== null && remaining > 0;

  return { remaining, isResting, startRest, skipRest };
}
