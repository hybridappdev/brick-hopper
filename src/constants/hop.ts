export interface HopImpulse {
  vy: number;
  vx: number;
}

/** Gentle arcs — tuned for easy coin collection. */
export const HOP_IMPULSES: Record<0 | 1 | 2, HopImpulse> = {
  0: { vy: -10, vx: 3.8 },
  1: { vy: -12.5, vx: 5.5 },
  2: { vy: -14.5, vx: 7 },
};

export const HOP_VERTICAL_IMPULSE: Record<0 | 1 | 2, number> = {
  0: -10,
  1: -12.5,
  2: -14.5,
};

export const HOP_GROUND_FRICTION = 0.4;
export const HOP_AIR_DRAG = 0.005;

/** Comfortable auto-hop rhythm (ms between hops while grounded). */
export const AUTO_HOP_INTERVAL_MS: Record<0 | 1 | 2, number> = {
  0: 1050,
  1: 820,
  2: 600,
};

export const AUTO_HOP_LAND_BOOST = 0.7;
