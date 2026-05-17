import { useEffect, useState } from 'react';

interface UseAmbientClockOptions {
  /** Multiplier on real-time delta (28 ≈ full day in ~3s on menus). */
  speed: number;
  running?: boolean;
  initialMs?: number;
}

/** Monotonic ambient clock for menu previews and UI-driven skies. */
export function useAmbientClock({
  speed,
  running = true,
  initialMs = 0,
}: UseAmbientClockOptions): number {
  const [clockMs, setClockMs] = useState(initialMs);

  useEffect(() => {
    if (!running || speed <= 0) {
      return;
    }

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      setClockMs((prev) => prev + delta * speed);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);

  return clockMs;
}
