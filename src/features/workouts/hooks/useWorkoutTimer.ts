import { useCallback, useEffect, useState } from "react";
import { formatWorkoutElapsed } from "@/shared/lib/workoutElapsed";

export function useWorkoutTimer(initialSeconds = 0) {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;
    const id = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  const toggleRunning = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(true);
  }, []);

  return {
    elapsedSeconds,
    elapsed: formatWorkoutElapsed(elapsedSeconds),
    isRunning,
    toggleRunning,
    reset,
    start,
  };
}
