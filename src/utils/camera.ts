import { CAMERA_EDGE_PADDING, WORLD_WIDTH } from '../constants';

export function getCameraXBounds(viewportWidth: number): { min: number; max: number } {
  const min = CAMERA_EDGE_PADDING;
  const max = Math.max(min, WORLD_WIDTH - viewportWidth - CAMERA_EDGE_PADDING);
  return { min, max };
}

export function clampCameraX(x: number, viewportWidth: number): number {
  const { min, max } = getCameraXBounds(viewportWidth);
  return Math.min(Math.max(x, min), max);
}

export function getWorldCenterX(cameraX: number, viewportWidth: number): number {
  return cameraX + viewportWidth / 2;
}
