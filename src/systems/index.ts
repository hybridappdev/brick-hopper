import { TimerSystem } from './TimerSystem';
import { AmbientSystem } from './AmbientSystem';
import { CameraSystem } from './CameraSystem';
import { CollisionSystem } from './CollisionSystem';
import { PatrolSystem } from './PatrolSystem';
import { InteractionSystem } from './InteractionSystem';
import { MovementSystem } from './MovementSystem';
import { PhysicsSystem } from './PhysicsSystem';
import { RenderSystem } from './RenderSystem';

export {
  TimerSystem,
  AmbientSystem,
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
  TimerSystem,
  AmbientSystem,
  CollisionSystem,
  InteractionSystem,
  PatrolSystem,
  CameraSystem,
  MovementSystem,
  PhysicsSystem,
  RenderSystem,
];
