import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { useApp } from '../context/AppContext';
import type { HighScoreEntry } from '../types/app';
import { ScreenShell } from '../ui/ScreenShell';
import { formatElapsed } from '../utils/formatTime';

export function HighScoresScreen() {
  const { highScores, navigate } = useApp();

  return (
    <ScreenShell title="High Scores" onBack={() => navigate('intro')}>
      {highScores.length === 0 ? (
        <Text style={styles.empty}>No runs yet. Complete a level to post a score!</Text>
      ) : (
        <FlatList
          data={highScores}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <ScoreRow entry={item} rank={index + 1} />
          )}
        />
      )}
    </ScreenShell>
  );
}

function ScoreRow({ entry, rank }: { entry: HighScoreEntry; rank: number }) {
  const date = new Date(entry.dateIso);
  const dateLabel = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.row}>
      <Text style={styles.rank}>#{rank}</Text>
      <View style={[styles.avatar, { backgroundColor: entry.avatarColor }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{entry.playerName}</Text>
        <Text style={styles.meta}>
          {formatElapsed(entry.totalTimeMs)}
          {entry.completedAllLevels ? ' · Completed' : ''}
          {' · '}
          {dateLabel}
        </Text>
      </View>
      <Text style={styles.score}>{entry.score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: COLORS.scoreText,
    fontSize: 15,
    opacity: 0.65,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  list: {
    width: '100%',
    maxWidth: 400,
    flexGrow: 0,
    maxHeight: '55%',
  },
  listContent: {
    gap: 8,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 33, 62, 0.88)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(93, 211, 158, 0.25)',
    gap: 10,
  },
  rank: {
    color: COLORS.coin,
    fontSize: 14,
    fontWeight: '800',
    width: 28,
  },
  avatar: {
    width: 28,
    height: 36,
    borderRadius: 4,
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.scoreText,
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    color: COLORS.scoreText,
    fontSize: 11,
    opacity: 0.55,
    marginTop: 2,
  },
  score: {
    color: COLORS.coin,
    fontSize: 18,
    fontWeight: '800',
  },
});
