import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CLOUD_BLOB_COUNT,
  RAIN_DROP_COUNT,
  SNOW_FLAKE_COUNT,
} from '../constants/weather';
import type { AmbientSnapshot } from '../utils/ambient';
import {
  generateCloudBlobs,
  generateRainDrops,
  generateSnowFlakes,
} from '../utils/weatherParticles';

const RAIN_DROPS = generateRainDrops(RAIN_DROP_COUNT);
const SNOW_FLAKES = generateSnowFlakes(SNOW_FLAKE_COUNT);
const CLOUDS = generateCloudBlobs(CLOUD_BLOB_COUNT);

interface WeatherOverlayProps {
  width: number;
  height: number;
  ambient: AmbientSnapshot;
}

function rainDropPosition(
  drop: (typeof RAIN_DROPS)[number],
  index: number,
  width: number,
  height: number,
  animT: number,
  speedMul: number,
  stormIntensity: number,
): { x: number; y: number } {
  const layerMul = drop.layer === 'fg' ? 1.14 : 0.84;
  const travel = animT * drop.speed * speedMul * layerMul * height;
  const y =
    ((drop.y * height + travel) % (height + drop.length)) - drop.length;
  const gustX =
    Math.sin(animT * 1.15 + index * 0.65) * stormIntensity * width * 0.055;
  const swayX = Math.sin(animT * 0.85 + index) * drop.drift * width * 0.07;
  const x = drop.x * width + gustX + swayX;
  return { x, y };
}

function WeatherOverlayComponent({ width, height, ambient }: WeatherOverlayProps) {
  const {
    cloudCover,
    rainIntensity,
    snowIntensity,
    stormIntensity,
    weatherAnimMs,
  } = ambient;

  const animT = weatherAnimMs / 1000;
  const rainBoost = rainIntensity + stormIntensity * 0.35;
  const lightningFlash =
    stormIntensity > 0.35
      ? Math.max(0, Math.sin(animT * 4.2) * Math.sin(animT * 11.7) - 0.82) * 4.5
      : 0;

  const rainParams = useMemo(() => {
    const speedMul =
      (0.72 + rainBoost * 0.52 + stormIntensity * 0.38) *
      (lightningFlash > 0.55 ? 1.18 : 1);
    const windAngleDeg = 9 + rainBoost * 11 + stormIntensity * 7;
    const visibleCount = Math.max(
      4,
      Math.floor(RAIN_DROP_COUNT * (0.22 + rainBoost * 0.78)),
    );
    const baseOpacity = 0.12 + rainBoost * 0.5;
    return { speedMul, windAngleDeg, visibleCount, baseOpacity };
  }, [rainBoost, stormIntensity, lightningFlash]);

  const visibleDrops = RAIN_DROPS.slice(0, rainParams.visibleCount);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {cloudCover > 0.04 &&
        CLOUDS.map((cloud, index) => (
          <View
            key={`cloud-${index}`}
            style={[
              styles.cloud,
              {
                left: cloud.x * width + Math.sin(animT * 0.15 + index) * 12,
                top: cloud.y * height * 0.35,
                width: cloud.width,
                height: cloud.height,
                opacity: cloud.opacity * cloudCover,
              },
            ]}
          />
        ))}

      {rainBoost > 0.45 && (
        <View
          style={[
            styles.mist,
            { opacity: 0.06 + rainBoost * 0.2 + stormIntensity * 0.06 },
          ]}
        />
      )}

      {rainBoost > 0.04 &&
        visibleDrops.map((drop, index) => {
          const { x, y } = rainDropPosition(
            drop,
            index,
            width,
            height,
            animT,
            rainParams.speedMul,
            stormIntensity,
          );
          const streakOpacity =
            rainParams.baseOpacity * drop.opacity * (drop.layer === 'fg' ? 1.1 : 0.75);
          const color =
            stormIntensity > 0.4
              ? 'rgba(205, 225, 255, 0.9)'
              : 'rgba(175, 205, 240, 0.88)';

          return (
            <View
              key={`rain-${index}`}
              style={[
                styles.rainDrop,
                {
                  left: x,
                  top: y,
                  width: drop.width,
                  height: drop.length,
                  backgroundColor: color,
                  opacity: Math.min(0.92, streakOpacity),
                  transformOrigin: 'top center',
                  transform: [{ rotate: `${-rainParams.windAngleDeg}deg` }],
                },
              ]}
            />
          );
        })}

      {snowIntensity > 0.04 &&
        SNOW_FLAKES.map((flake, index) => {
          const y =
            ((flake.y * height + animT * flake.speed * height * 0.45) % (height + flake.size)) -
            flake.size;
          const x =
            flake.x * width + Math.sin(animT * 0.8 + index) * flake.drift * width * 0.08;
          return (
            <View
              key={`snow-${index}`}
              style={[
                styles.snowFlake,
                {
                  left: x,
                  top: y,
                  width: flake.size,
                  height: flake.size,
                  opacity: 0.35 + snowIntensity * 0.55,
                },
              ]}
            />
          );
        })}

      {lightningFlash > 0 && (
        <View
          style={[
            styles.lightning,
            { opacity: Math.min(0.45, lightningFlash * stormIntensity) },
          ]}
        />
      )}
    </View>
  );
}

export const WeatherOverlay = memo(WeatherOverlayComponent);

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(240, 245, 255, 0.9)',
    borderRadius: 48,
  },
  mist: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(160, 185, 210, 0.55)',
  },
  rainDrop: {
    position: 'absolute',
    borderRadius: 1,
  },
  snowFlake: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 2,
  },
  lightning: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(230, 240, 255, 0.9)',
  },
});
