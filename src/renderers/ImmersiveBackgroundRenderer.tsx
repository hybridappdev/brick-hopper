import React, { memo, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CELESTIAL, STAR_COUNT } from '../constants/ambient';
import { SUNSET_BACKGROUND } from '../constants/background';
import type { AmbientSnapshot, RendererProps } from '../types/ecs';
import { generateStars } from '../utils/stars';

interface ImmersiveBackgroundRendererProps extends RendererProps {
  layer?: 'sky' | 'hills';
  ambient?: AmbientSnapshot;
}

const STARS = generateStars(STAR_COUNT);

function ImmersiveBackgroundRendererComponent({
  renderPosition,
  sprite,
  layer = 'sky',
  ambient,
}: ImmersiveBackgroundRendererProps) {
  const x = renderPosition?.x ?? 0;
  const isSkyLayer = layer === 'sky';

  const starNodes = useMemo(() => {
    if (!isSkyLayer || !ambient) {
      return null;
    }

    const opacity = ambient.starOpacity;
    if (opacity < 0.05) {
      return null;
    }

    return STARS.map((star, index) => {
      const twinkle =
        0.55 +
        0.45 *
          Math.sin(ambient.timeOfDay * Math.PI * 8 + star.twinkleOffset + index * 0.3);
      return (
        <View
          key={index}
          style={[
            styles.star,
            {
              left: star.x * sprite.width,
              top: star.y * sprite.height,
              width: star.size,
              height: star.size,
              opacity: opacity * twinkle,
            },
          ]}
        />
      );
    });
  }, [ambient, isSkyLayer, sprite.height, sprite.width]);

  if (!ambient) {
    return (
      <View
        style={[styles.clip, { left: x, top: 0, width: sprite.width, height: sprite.height }]}
        pointerEvents="none"
      >
        <Image source={SUNSET_BACKGROUND} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  const sunLeft = ambient.celestialX * sprite.width - 28;
  const moonLeft = ambient.moonX * sprite.width - 20;
  const celestialTop = ambient.celestialY * sprite.height;

  return (
    <View
      style={[
        styles.clip,
        {
          left: x,
          top: 0,
          width: sprite.width,
          height: sprite.height,
          backgroundColor: ambient.skyColor,
        },
      ]}
      pointerEvents="none"
    >
      <Image
        source={SUNSET_BACKGROUND}
        style={[
          styles.image,
          layer === 'hills' && styles.imageHills,
          { opacity: 0.35 + ambient.daylight * 0.65 },
        ]}
        resizeMode="cover"
      />

      {isSkyLayer && (
        <>
          <View
            style={[
              styles.tint,
              {
                backgroundColor: ambient.tintColor,
                opacity: ambient.tintOpacity,
              },
            ]}
          />

          {ambient.sunOpacity > 0.05 && (
            <View
              style={[
                styles.celestialGlow,
                {
                  left: sunLeft - 20,
                  top: celestialTop - 20,
                  opacity: ambient.sunOpacity * 0.9,
                  backgroundColor: CELESTIAL.sunGlow,
                },
              ]}
            />
          )}

          {ambient.sunOpacity > 0.05 && (
            <View
              style={[
                styles.celestial,
                {
                  left: sunLeft,
                  top: celestialTop,
                  opacity: ambient.sunOpacity,
                  backgroundColor: CELESTIAL.sun,
                },
              ]}
            />
          )}

          {ambient.moonOpacity > 0.05 && (
            <>
              <View
                style={[
                  styles.celestialGlow,
                  styles.moonGlow,
                  {
                    left: moonLeft - 16,
                    top: celestialTop + 20,
                    opacity: ambient.moonOpacity * 0.85,
                    backgroundColor: CELESTIAL.moonGlow,
                  },
                ]}
              />
              <View
                style={[
                  styles.celestial,
                  styles.moon,
                  {
                    left: moonLeft,
                    top: celestialTop + 24,
                    opacity: ambient.moonOpacity,
                    backgroundColor: CELESTIAL.moon,
                  },
                ]}
              />
            </>
          )}

          {starNodes}
        </>
      )}
    </View>
  );
}

export const ImmersiveBackgroundRenderer = memo(ImmersiveBackgroundRendererComponent);

const styles = StyleSheet.create({
  clip: {
    position: 'absolute',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageHills: {
    position: 'absolute',
    width: '100%',
    height: '115%',
    top: -24,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
  },
  celestial: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  moon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  celestialGlow: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  moonGlow: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});
