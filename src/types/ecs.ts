import type Matter from 'matter-js';
import type { ComponentType } from 'react';

export type EntityType =
  | 'player'
  | 'platform'
  | 'enemy'
  | 'coin'
  | 'jumpPad'
  | 'decoration';

export interface PositionComponent {
  x: number;
  y: number;
}

export interface VelocityComponent {
  x: number;
  y: number;
}

export interface SpriteComponent {
  width: number;
  height: number;
  color: string;
}

export interface ColliderComponent {
  body: Matter.Body;
  isStatic: boolean;
}

/** Screen-space position computed by RenderSystem (avoids camera math in renderers). */
export interface RenderPositionComponent {
  x: number;
  y: number;
}

export interface RendererProps {
  position: PositionComponent;
  renderPosition?: RenderPositionComponent;
  sprite: SpriteComponent;
  entityType: EntityType;
  parallaxFactor?: number;
}

export interface PatrolComponent {
  minX: number;
  maxX: number;
  speed: number;
  direction: 1 | -1;
}

export interface GameEntity {
  entityType: EntityType;
  position: PositionComponent;
  velocity: VelocityComponent;
  sprite: SpriteComponent;
  /** Omitted for decoration entities (no physics body). */
  collider?: ColliderComponent;
  renderPosition?: RenderPositionComponent;
  renderer?: ComponentType<RendererProps>;
  /** Player-only: set by CollisionSystem when standing on a platform. */
  isGrounded?: boolean;
  /** Player-only: ms remaining for coyote-time hop after leaving ground. */
  coyoteMs?: number;
  /** Player-only: ms until another hop is allowed. */
  hopCooldownMs?: number;
  /** Player-only: ms accumulated toward the next auto-hop while grounded. */
  autoHopTimerMs?: number;
  /** Player-only: previous frame grounded state (for landing detection). */
  wasGrounded?: boolean;
  /** Player-only: last applied hop direction (detect aim changes). */
  lastHopDirection?: -1 | 0 | 1;
  /** Coin-only: point value when collected. */
  value?: number;
  /** Coin-only: removed from world after pickup. */
  collected?: boolean;
  /** Enemy / moving platform: horizontal patrol bounds. */
  patrol?: PatrolComponent;
  /** Jump pad: upward impulse applied on contact. */
  jumpForce?: number;
  /** Decoration: parallax scroll factor (0 = fixed, 1 = moves with world). */
  parallaxFactor?: number;
  /** Sunset background layer depth (sky vs hills). */
  layer?: 'sky' | 'hills';
}

export interface SpawnPoint {
  x: number;
  y: number;
  /** Camera x when checkpoint was saved (map scroll mode). */
  cameraX?: number;
}

/** 0 = short, 1 = medium, 2 = tall */
export type HopLevel = 0 | 1 | 2;

export interface InputState {
  /** -1…1 from accelerometer — scrolls the map horizontally. */
  tiltX: number;
  /** Vertical hop strength while exploring. */
  hopSpeed: HopLevel;
}

export type InputPatch =
  | Partial<InputState>
  | ((prev: InputState) => InputState);

export interface CameraState {
  /** Left edge of the viewport in world space. */
  x: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface PhysicsContext {
  engine: Matter.Engine;
  world: Matter.World;
  viewport: Viewport;
  input: InputState;
  camera: CameraState;
  score: number;
  playerSpawn: SpawnPoint;
  /** Last safe landing spot — used when falling off the map. */
  checkpoint: SpawnPoint;
  collisionHandlersRegistered: boolean;
  interactionHandlersRegistered: boolean;
  totalCoins: number;
  levelComplete: boolean;
}

export interface PhysicsEntity {
  physics: PhysicsContext;
}

export type EntityMap = Record<string, GameEntity | PhysicsEntity>;

export function isGameEntity(entity: GameEntity | PhysicsEntity): entity is GameEntity {
  return 'entityType' in entity;
}

export function isPhysicsEntity(entity: GameEntity | PhysicsEntity): entity is PhysicsEntity {
  return 'physics' in entity;
}
