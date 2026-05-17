import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { getLevelStats, LEVEL_COUNT, LEVEL_META } from '../constants/levels';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ScreenShell } from '../ui/ScreenShell';
import {
  canShowContinueCampaign,
  getContinueCampaignLevel,
} from '../utils/campaignProgress';
import { formatElapsed } from '../utils/formatTime';

function DifficultyStars({ difficulty }: { difficulty: 1 | 2 | 3 }) {
  return (
    <Text style={styles.stars}>
      {[1, 2, 3].map((n) => (
        <Text key={n} style={n <= difficulty ? styles.starOn : styles.starOff}>
          ★
        </Text>
      ))}
    </Text>
  );
}

export function LevelPickerScreen() {
  const {
    unlockedLevelMaxIndex,
    levelRecords,
    startLevel,
    startCampaignFrom,
    navigate,
  } = useApp();

  const showContinue = canShowContinueCampaign(levelRecords, unlockedLevelMaxIndex);
  const continueLevel = getContinueCampaignLevel(levelRecords, unlockedLevelMaxIndex);

  return (
    <ScreenShell
      title="Levels"
      subtitle="Collect all coins, then reach the exit flag"
      onBack={() => navigate('intro')}
      scroll
    >
      {showContinue && (
        <PrimaryButton
          label={`Continue — Level ${continueLevel + 1}`}
          onPress={() => startCampaignFrom(continueLevel)}
          style={styles.continueBtn}
        />
      )}

      <View style={styles.grid}>
        {LEVEL_META.map((meta, index) => {
          const unlocked = index <= unlockedLevelMaxIndex;
          const levelNumber = index + 1;
          const record = levelRecords[index];
          const { coinCount } = getLevelStats(index);
          const completed = Boolean(record?.completed);

          return (
            <Pressable
              key={meta.id}
              disabled={!unlocked}
              onPress={() => startLevel(index)}
              style={({ pressed }) => [
                styles.card,
                !unlocked && styles.cardLocked,
                completed && styles.cardCompleted,
                unlocked && pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.levelNum, !unlocked && styles.textMuted]}>
                  {levelNumber}
                </Text>
                <View style={styles.headerRight}>
                  {completed && <Text style={styles.doneBadge}>✓</Text>}
                  {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
                </View>
              </View>

              <DifficultyStars difficulty={meta.difficulty} />

              <Text style={[styles.cardTitle, !unlocked && styles.textMuted]}>
                {meta.title}
              </Text>
              <Text style={[styles.cardSubtitle, !unlocked && styles.textMuted]}>
                {unlocked ? meta.subtitle : 'Locked'}
              </Text>

              {unlocked && (
                <View style={styles.statsRow}>
                  <Text style={styles.statText}>🪙 {coinCount}</Text>
                  <Text style={styles.statText}>🚩 exit</Text>
                </View>
              )}

              {unlocked && completed && record && (
                <Text style={styles.bestText}>
                  {record.bestTimeMs > 0 && (
                    <Text>⏱ {formatElapsed(record.bestTimeMs)}</Text>
                  )}
                  {record.bestScore > 0 && (
                    <Text>
                      {record.bestTimeMs > 0 ? ' · ' : ''}
                      {record.bestScore} pts
                    </Text>
                  )}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>
        {unlockedLevelMaxIndex + 1} of {LEVEL_COUNT} unlocked · 3 lives per run
      </Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  continueBtn: {
    marginBottom: 12,
    minWidth: 260,
  },
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
  cardCompleted: {
    borderColor: 'rgba(46, 204, 113, 0.45)',
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelNum: {
    color: COLORS.coin,
    fontSize: 22,
    fontWeight: '900',
  },
  doneBadge: {
    color: COLORS.goalActive,
    fontSize: 16,
    fontWeight: '800',
  },
  lockIcon: {
    fontSize: 14,
  },
  stars: {
    marginBottom: 4,
  },
  starOn: {
    color: COLORS.coin,
    fontSize: 11,
  },
  starOff: {
    color: 'rgba(234, 234, 234, 0.2)',
    fontSize: 11,
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  statText: {
    color: COLORS.scoreText,
    fontSize: 11,
    opacity: 0.55,
  },
  bestText: {
    color: COLORS.coin,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  textMuted: {
    opacity: 0.45,
  },
  hint: {
    color: COLORS.scoreText,
    fontSize: 13,
    opacity: 0.55,
    marginTop: 16,
    textAlign: 'center',
  },
});
