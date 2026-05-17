import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RendererProps } from '../types/ecs';

/** Darkens the bottom of the screen so platforms read clearly (Mario-style). */
function GroundVignetteRendererComponent({ sprite, ambient }: RendererProps) {
  const wet =
    (ambient?.rainIntensity ?? 0) + (ambient?.stormIntensity ?? 0) * 0.5;
  const base = ambient?.vignetteColor ?? 'rgba(15, 26, 51, 0.35)';

  return (
    <View
      pointerEvents="none"
      style={[
        styles.vignette,
        {
          width: sprite.width,
          height: sprite.height,
          backgroundColor: base,
        },
      ]}
    >
      {wet > 0.08 && (
        <View
          style={[
            styles.wetSheen,
            { opacity: 0.12 + wet * 0.22 },
          ]}
        />
      )}
    </View>
  );
}

export const GroundVignetteRenderer = memo(GroundVignetteRendererComponent);

const styles = StyleSheet.create({
  vignette: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  wetSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(120, 150, 190, 0.55)',
  },
});
