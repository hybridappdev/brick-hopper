import { useEffect, useRef, useState } from 'react';
import type { AmbienceSettings } from '../constants/ambienceDefaults';
import { DEFAULT_AMBIENCE } from '../constants/ambienceDefaults';
import { computeAmbient, type AmbientSnapshot } from '../utils/ambient';
import { smoothAmbient } from '../utils/smoothAmbient';

/** Eases rendered sky colors toward the target from `clockMs` (runs every frame). */
export function useSmoothedAmbient(
  clockMs: number,
  ambience: AmbienceSettings = DEFAULT_AMBIENCE,
  weatherClockMs?: number,
): AmbientSnapshot {
  const ambientOptions =
    weatherClockMs !== undefined ? { weatherClockMs } : undefined;
  const targetRef = useRef(computeAmbient(clockMs, ambience, ambientOptions));
  targetRef.current = computeAmbient(clockMs, ambience, ambientOptions);

  const [display, setDisplay] = useState(() => computeAmbient(clockMs, ambience, ambientOptions));
  const displayRef = useRef(display);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const next = smoothAmbient(displayRef.current, targetRef.current);
      displayRef.current = next;
      setDisplay(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return display;
}
