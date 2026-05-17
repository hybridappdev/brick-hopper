import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RendererProps } from '../types/ecs';

/**
 * Generic view-based renderer. Uses renderPosition from RenderSystem
 * so the camera offset is applied once per frame, not inside each entity.
 */
function EntityRendererComponent({
  renderPosition,
  position,
  sprite,
  entityType,
}: RendererProps) {
  const { x, y } = renderPosition ?? position;

  return (
    <View
      style={[
        styles.entity,
        entityType === 'coin' && styles.coin,
        entityType === 'enemy' && styles.enemy,
        entityType === 'jumpPad' && styles.jumpPad,
        {
          left: x - sprite.width / 2,
          top: y - sprite.height / 2,
          width: sprite.width,
          height: sprite.height,
          backgroundColor: sprite.color,
        },
      ]}
    />
  );
}

export const EntityRenderer = memo(EntityRendererComponent);

const styles = StyleSheet.create({
  entity: {
    position: 'absolute',
  },
  coin: {
    borderRadius: 999,
  },
  enemy: {
    borderRadius: 6,
  },
  jumpPad: {
    borderRadius: 4,
    opacity: 0.9,
  },
});
