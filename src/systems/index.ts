import { CameraSystem } from './CameraSystem';
import { CollisionSystem } from './CollisionSystem';
import { PatrolSystem } from './PatrolSystem';
import { InteractionSystem } from './InteractionSystem';
import { MovementSystem } from './MovementSystem';
import { PhysicsSystem } from './PhysicsSystem';
import { RenderSystem } from './RenderSystem';

export {
  PhysicsSystem,
  MovementSystem,
  CameraSystem,
  CollisionSystem,
  PatrolSystem,
  InteractionSystem,
  RenderSystem,
};

/** Order: camera scroll → brick at center → physics → render. */
export const GAME_SYSTEMS = [
  CollisionSystem,
  InteractionSystem,
  PatrolSystem,
  CameraSystem,
  MovementSystem,
  PhysicsSystem,
  RenderSystem,
];
