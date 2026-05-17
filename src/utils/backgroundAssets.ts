import { Image } from 'react-native';
import { SUNSET_BACKGROUND } from '../constants/background';

let preloadPromise: Promise<void> | null = null;

/** Warms the native image cache before backgrounds mount (reduces first-frame flicker). */
export function preloadBackgroundAssets(): Promise<void> {
  if (!preloadPromise) {
    preloadPromise = (async () => {
      const resolved = Image.resolveAssetSource(SUNSET_BACKGROUND);
      if (resolved?.uri) {
        await Image.prefetch(resolved.uri);
      }
    })().catch(() => {
      preloadPromise = null;
    });
  }
  return preloadPromise;
}
