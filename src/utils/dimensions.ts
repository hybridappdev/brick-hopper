import { Dimensions } from 'react-native';
import type { Viewport } from '../types/ecs';

/** Current window size (call when creating a game session). */
export function getWindowViewport(): Viewport {
  const { width, height } = Dimensions.get('window');
  return { width, height };
}
