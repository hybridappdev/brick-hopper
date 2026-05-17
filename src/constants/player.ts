import Matter from 'matter-js';

export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 56;

export const PLAYER_PHYSICS = {
  friction: 0.01,
  frictionAir: 0.004,
  frictionStatic: 0.1,
  restitution: 0,
  density: 0.001,
  inertia: Infinity,
  label: 'player',
} as const satisfies Matter.IChamferableBodyDefinition;
