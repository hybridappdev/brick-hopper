import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RendererProps } from '../types/ecs';

/** Darkens the bottom of the screen so platforms read clearly (Mario-style). */
function GroundVignetteRendererComponent({ sprite, ambient }: RendererProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.vignette,
        {
          width: sprite.width,
          height: sprite.height,
          backgroundColor: ambient?.vignetteColor ?? 'rgba(15, 26, 51, 0.35)',
        },
      ]}
    />
  );
}

export const GroundVignetteRenderer = memo(GroundVignetteRendererComponent);

const styles = StyleSheet.create({
  vignette: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});
