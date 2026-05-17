import React, { memo } from 'react';
import { AmbientSkyView } from '../components/AmbientSkyView';
import { DEFAULT_AMBIENCE } from '../constants/ambienceDefaults';
import type { AmbientSnapshot, RendererProps } from '../types/ecs';
import { computeAmbient } from '../utils/ambient';

interface ImmersiveBackgroundRendererProps extends RendererProps {
  layer?: 'sky' | 'hills';
  ambient?: AmbientSnapshot;
}

function ImmersiveBackgroundRendererComponent({
  renderPosition,
  sprite,
  layer = 'sky',
  ambient,
  ambience,
}: ImmersiveBackgroundRendererProps) {
  const x = renderPosition?.x ?? 0;
  const snapshot = ambient ?? computeAmbient(0, ambience ?? DEFAULT_AMBIENCE);

  return (
    <AmbientSkyView
      width={sprite.width}
      height={sprite.height}
      ambient={snapshot}
      layer={layer}
      left={x}
      weatherParticles={false}
    />
  );
}

export const ImmersiveBackgroundRenderer = memo(ImmersiveBackgroundRendererComponent);
