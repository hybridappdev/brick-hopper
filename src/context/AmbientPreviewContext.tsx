import React, { createContext, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AmbientSkyView } from '../components/AmbientSkyView';
import { WeatherOverlay } from '../components/WeatherOverlay';
import type { AmbienceSettings } from '../constants/ambienceDefaults';
import { DEFAULT_AMBIENCE } from '../constants/ambienceDefaults';
import {
  getMenuPreviewClockSpeed,
  getMenuPreviewWeatherClockSpeed,
} from '../constants/ambientPreview';
import { useAmbientClock } from '../hooks/useAmbientClock';
import { useSmoothedAmbient } from '../hooks/useSmoothedAmbient';
import type { AmbientSnapshot } from '../utils/ambient';
import { preloadBackgroundAssets } from '../utils/backgroundAssets';

interface AmbientPreviewContextValue {
  ambient: AmbientSnapshot;
}

const AmbientPreviewContext = createContext<AmbientPreviewContextValue | null>(null);

export function useAmbientPreview(): AmbientPreviewContextValue | null {
  return useContext(AmbientPreviewContext);
}

interface AmbientPreviewProviderProps {
  width: number;
  height: number;
  ambience?: AmbienceSettings;
  children: React.ReactNode;
}

export function AmbientPreviewProvider({
  width,
  height,
  ambience = DEFAULT_AMBIENCE,
  children,
}: AmbientPreviewProviderProps) {
  const speed = getMenuPreviewClockSpeed(ambience);
  const weatherSpeed = getMenuPreviewWeatherClockSpeed(ambience);
  const clockMs = useAmbientClock({ speed, running: speed > 0 });
  const weatherClockMs = useAmbientClock({ speed: weatherSpeed, running: weatherSpeed > 0 });
  const ambient = useSmoothedAmbient(clockMs, ambience, weatherClockMs);

  useEffect(() => {
    void preloadBackgroundAssets();
  }, []);

  return (
    <AmbientPreviewContext.Provider value={{ ambient }}>
      <View style={styles.backdrop} collapsable={false} pointerEvents="none">
        <AmbientSkyView
          width={width}
          height={height}
          ambient={ambient}
          layer="sky"
          weatherParticles={false}
        />
        <AmbientSkyView
          width={width}
          height={height}
          ambient={ambient}
          layer="hills"
          weatherParticles={false}
        />
        <WeatherOverlay width={width} height={height} ambient={ambient} />
      </View>
      {children}
    </AmbientPreviewContext.Provider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
