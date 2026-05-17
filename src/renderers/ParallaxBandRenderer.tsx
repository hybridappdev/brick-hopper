import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RendererProps } from '../types/ecs';

function ParallaxBandRendererComponent({
  renderPosition,
  sprite,
}: RendererProps) {
  const x = renderPosition?.x ?? 0;
  const y = renderPosition?.y ?? sprite.height / 2;

  return (
    <View
      style={[
        styles.band,
        {
          left: x,
          top: y,
          width: sprite.width,
          height: sprite.height,
          backgroundColor: sprite.color,
        },
      ]}
    />
  );
}

export const ParallaxBandRenderer = memo(ParallaxBandRendererComponent);

const styles = StyleSheet.create({
  band: {
    position: 'absolute',
  },
});
