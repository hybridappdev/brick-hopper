import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { LEVEL_COUNT, LEVEL_META } from '../constants/levels';
import { useApp } from '../context/AppContext';
import { ScreenShell } from '../ui/ScreenShell';

export function LevelPickerScreen() {
  const { unlockedLevelMaxIndex, startLevel, navigate } = useApp();

  return (
    <ScreenShell
      title="Levels"
      subtitle="Beat a level to unlock the next"
      onBack={() => navigate('intro')}
      scroll
    >
      <View style={styles.grid}>
        {LEVEL_META.map((meta, index) => {
          const unlocked = index <= unlockedLevelMaxIndex;
          const levelNumber = index + 1;

          return (
            <Pressable
              key={meta.id}
              disabled={!unlocked}
              onPress={() => startLevel(index)}
              style={({ pressed }) => [
                styles.card,
                !unlocked && styles.cardLocked,
                unlocked && pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.levelNum, !unlocked && styles.textMuted]}>
                  {levelNumber}
                </Text>
                {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
              </View>
              <Text style={[styles.cardTitle, !unlocked && styles.textMuted]}>
                {meta.title}
              </Text>
              <Text style={[styles.cardSubtitle, !unlocked && styles.textMuted]}>
                {unlocked ? meta.subtitle : 'Locked'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>
        {unlockedLevelMaxIndex + 1} of {LEVEL_COUNT} unlocked
      </Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  card: {
    width: '46%',
    minWidth: 150,
    backgroundColor: 'rgba(22, 33, 62, 0.92)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.platform,
  },
  cardLocked: {
    opacity: 0.5,
    borderColor: 'rgba(93, 211, 158, 0.15)',
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelNum: {
    color: COLORS.coin,
    fontSize: 22,
    fontWeight: '900',
  },
  lockIcon: {
    fontSize: 14,
  },
  cardTitle: {
    color: COLORS.scoreText,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: COLORS.scoreText,
    fontSize: 12,
    opacity: 0.6,
  },
  textMuted: {
    opacity: 0.45,
  },
  hint: {
    color: COLORS.scoreText,
    fontSize: 13,
    opacity: 0.55,
    marginTop: 16,
  },
});
