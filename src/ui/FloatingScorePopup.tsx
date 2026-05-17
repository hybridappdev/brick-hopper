import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants';
import { COIN_VALUE } from '../constants/score';

const POPUP_LIFETIME_MS = 1000;

interface FloatingScorePopupProps {
  label?: string;
  anchorTop?: number;
  anchorCenterX?: number;
  onDone: () => void;
}

export function FloatingScorePopup({
  label = `+${COIN_VALUE}`,
  anchorTop = 88,
  anchorCenterX = 0,
  onDone,
}: FloatingScorePopupProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(8)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const onDoneRef = useRef(onDone);
  const finishedRef = useRef(false);
  onDoneRef.current = onDone;

  useEffect(() => {
    finishedRef.current = false;
    opacity.setValue(1);
    translateY.setValue(8);
    scale.setValue(0.5);

    const finish = () => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      onDoneRef.current();
    };

    const animation = Animated.parallel([
      Animated.timing(translateY, {
        toValue: -36,
        duration: 720,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.1,
          friction: 5,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 720,
        delay: 280,
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        finish();
      }
    });

    const timer = setTimeout(finish, POPUP_LIFETIME_MS);

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [opacity, translateY, scale]);

  return (
    <Animated.View
      style={[
        styles.popup,
        {
          top: anchorTop,
          left: anchorCenterX,
          opacity,
          transform: [{ translateY }, { scale }, { translateX: -28 }],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    zIndex: 15,
    elevation: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.45)',
  },
  label: {
    color: COLORS.coin,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
