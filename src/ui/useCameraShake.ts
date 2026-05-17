import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

const SHAKE_OFFSETS = [-10, 8, -6, 4, -2, 0];

export function useCameraShake() {
  const shakeX = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    shakeX.stopAnimation();
    shakeX.setValue(0);

    Animated.sequence(
      SHAKE_OFFSETS.map((offset) =>
        Animated.timing(shakeX, {
          toValue: offset,
          duration: 40,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [shakeX]);

  return { shakeX, triggerShake };
}
