export interface LevelMeta {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 1 | 2 | 3;
}

export const LEVEL_META: LevelMeta[] = [
  { id: 'level-1', title: 'First Steps', subtitle: 'Learn the hop', difficulty: 1 },
  { id: 'level-2', title: 'Stepping Up', subtitle: 'Moving platforms', difficulty: 2 },
  { id: 'level-3', title: 'Sky Bridge', subtitle: 'Wide gaps', difficulty: 2 },
  { id: 'level-4', title: 'High Rise', subtitle: 'Tower climb', difficulty: 3 },
  { id: 'level-5', title: 'Summit', subtitle: 'Rising challenge', difficulty: 3 },
  { id: 'level-6', title: 'Crosswind', subtitle: 'Long spans', difficulty: 2 },
  { id: 'level-7', title: 'Spire', subtitle: 'Vertical zigzag', difficulty: 3 },
  { id: 'level-8', title: 'Gauntlet', subtitle: 'Final challenge', difficulty: 3 },
];
