/** Ignore small tilt when the phone is roughly level (G). */
export const TILT_DEADZONE = 0.1;

/** Max map scroll speed at full tilt (px per 60Hz frame). */
export const TILT_SCROLL_SPEED = 5.5;

/** Clamp raw accelerometer x before normalizing. */
export const TILT_INPUT_CLAMP = 0.45;

/**
 * Converts accelerometer x (portrait) to -1…1 scroll intent.
 * Tilt right edge down → positive → scroll map right.
 */
export function tiltFromAccelerometer(x: number): number {
  const clamped = Math.max(-TILT_INPUT_CLAMP, Math.min(TILT_INPUT_CLAMP, x));
  if (Math.abs(clamped) < TILT_DEADZONE) {
    return 0;
  }

  const sign = clamped < 0 ? -1 : 1;
  const magnitude = (Math.abs(clamped) - TILT_DEADZONE) / (TILT_INPUT_CLAMP - TILT_DEADZONE);
  return sign * Math.min(1, magnitude);
}
