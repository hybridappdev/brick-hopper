/** Matter.js gravity scale (Earth-like feel in pixel space). */
export const GRAVITY_Y = 0.76;

/** Fixed physics step for deterministic simulation. */
export const PHYSICS_DELTA_MS = 1000 / 60;

/** Matter.js warns above ~16.67ms; clamp frame deltas to avoid instability. */
export const MAX_PHYSICS_DELTA_MS = PHYSICS_DELTA_MS;

/** Grace period after leaving a ledge where a hop still works (ms). */
export const COYOTE_TIME_MS = 180;

/** Minimum time between hops (ms). */
export const HOP_COOLDOWN_MS = 120;
