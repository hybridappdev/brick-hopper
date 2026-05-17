import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SUNSET_BACKGROUND } from '../constants/background';
import type { RendererProps } from '../types/ecs';

interface SunsetBackgroundRendererProps extends RendererProps {
  layer?: 'sky' | 'hills';
}

function SunsetBackgroundRendererComponent({
  renderPosition,
  sprite,
  layer = 'sky',
}: SunsetBackgroundRendererProps) {
  const x = renderPosition?.x ?? 0;

  return (
    <View
      style={[
        styles.clip,
        {
          left: x,
          top: 0,
          width: sprite.width,
          height: sprite.height,
        },
      ]}
      pointerEvents="none"
    >
      <Image
        source={SUNSET_BACKGROUND}
        style={[
          styles.image,
          layer === 'hills' && styles.imageHills,
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

export const SunsetBackgroundRenderer = memo(SunsetBackgroundRendererComponent);

const styles = StyleSheet.create({
  clip: {
    position: 'absolute',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  /** Slight vertical crop + scale for the “near” parallax layer. */
  imageHills: {
    position: 'absolute',
    width: '100%',
    height: '115%',
    top: -24,
  },
});
