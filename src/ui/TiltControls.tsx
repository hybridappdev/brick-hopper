import { Accelerometer } from 'expo-sensors';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { tiltFromAccelerometer } from '../constants/tilt';
import type { InputPatch } from '../types/ecs';

interface TiltControlsProps {
  onInputChange: (patch: InputPatch) => void;
  enabled?: boolean;
}

const UPDATE_INTERVAL_MS = 32;

/** Drives map scroll from device tilt; arrow keys on web. */
export function TiltControls({ onInputChange, enabled = true }: TiltControlsProps) {
  useEffect(() => {
    if (!enabled) {
      onInputChange((p) => ({ ...p, tiltX: 0 }));
      return;
    }

    if (Platform.OS === 'web') {
      const keys = { left: false, right: false };

      const applyKeys = () => {
        let tiltX = 0;
        if (keys.left) tiltX = -1;
        if (keys.right) tiltX = 1;
        onInputChange((p) => ({ ...p, tiltX }));
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowRight') keys.right = true;
        applyKeys();
      };

      const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
        applyKeys();
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);

      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        onInputChange((p) => ({ ...p, tiltX: 0 }));
      };
    }

    Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);

    const subscription = Accelerometer.addListener(({ x }) => {
      const tiltX = tiltFromAccelerometer(x);
      onInputChange((p) => ({ ...p, tiltX }));
    });

    return () => {
      subscription.remove();
      onInputChange((p) => ({ ...p, tiltX: 0 }));
    };
  }, [enabled, onInputChange]);

  return null;
}
