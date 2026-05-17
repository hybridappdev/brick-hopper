import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CELESTIAL, STAR_COUNT } from '../constants/ambient';
import { SUNSET_BACKGROUND } from '../constants/background';
import type { AmbientSnapshot } from '../utils/ambient';
import { generateStars } from '../utils/stars';
import { getWeatherBackgroundWash } from '../utils/weather';
import { WeatherOverlay } from './WeatherOverlay';

const STARS = generateStars(STAR_COUNT);

interface AmbientSkyViewProps {
  width: number;
  height: number;
  ambient: AmbientSnapshot;
  layer?: 'sky' | 'hills';
  left?: number;
  /** Screen-fixed particles are drawn by menu preview; in-game uses sky layer. */
  weatherParticles?: boolean;
}

function AmbientSkyViewComponent({
  width,
  height,
  ambient,
  layer = 'sky',
  left = 0,
  weatherParticles = false,
}: AmbientSkyViewProps) {
  const isSkyLayer = layer === 'sky';
  const sunLeft = ambient.celestialX * width - 28;
  const moonLeft = ambient.moonX * width - 20;
  const celestialTop = ambient.celestialY * height;
  const wash = getWeatherBackgroundWash(
    {
      cloudCover: ambient.cloudCover,
      rainIntensity: ambient.rainIntensity,
      snowIntensity: ambient.snowIntensity,
      stormIntensity: ambient.stormIntensity,
    },
    layer,
  );
  const imageOpacity = (0.35 + ambient.daylight * 0.65) * wash.imageOpacityScale;
  const starFieldOpacity = ambient.starOpacity;

  return (
    <View
      style={[
        styles.clip,
        {
          left,
          top: 0,
          width,
          height,
          backgroundColor: ambient.skyColor,
        },
      ]}
      pointerEvents="none"
      collapsable={false}
    >
      <Image
        source={SUNSET_BACKGROUND}
        style={[
          styles.image,
          layer === 'hills' && styles.imageHills,
          { opacity: imageOpacity },
        ]}
        resizeMode="cover"
        fadeDuration={0}
      />

      {wash.washOpacity > 0.02 && (
        <View
          style={[
            styles.weatherWash,
            {
              backgroundColor: wash.washColor,
              opacity: wash.washOpacity,
            },
          ]}
        />
      )}

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

          {STARS.map((star, index) => {
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
                    left: star.x * width,
                    top: star.y * height,
                    width: star.size,
                    height: star.size,
                    opacity: starFieldOpacity * twinkle,
                  },
                ]}
              />
            );
          })}

          {weatherParticles && (
            <WeatherOverlay width={width} height={height} ambient={ambient} />
          )}
        </>
      )}
    </View>
  );
}

export const AmbientSkyView = memo(AmbientSkyViewComponent);

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
  weatherWash: {
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
