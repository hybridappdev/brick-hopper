export interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  /** Per-drop opacity multiplier (0–1). */
  opacity: number;
  /** Background streaks are smaller, slower, and dimmer. */
  layer: 'bg' | 'fg';
  /** Horizontal sway amplitude. */
  drift: number;
}

export interface SnowFlake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
}

export interface CloudBlob {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateRainDrops(count: number, seed = 91): RainDrop[] {
  const rand = seededRand(seed);
  const bgCount = Math.floor(count * 0.55);
  const drops: RainDrop[] = [];

  for (let i = 0; i < count; i += 1) {
    const isBg = i < bgCount;
    drops.push({
      x: rand(),
      y: rand(),
      length: isBg ? 10 + rand() * 12 : 16 + rand() * 18,
      speed: isBg ? 0.5 + rand() * 0.45 : 0.75 + rand() * 0.85,
      width: isBg ? 1 : 1 + (rand() > 0.6 ? 1 : 0),
      opacity: isBg ? 0.35 + rand() * 0.35 : 0.55 + rand() * 0.4,
      layer: isBg ? 'bg' : 'fg',
      drift: (rand() - 0.5) * (isBg ? 0.2 : 0.45),
    });
  }
  return drops;
}

export function generateSnowFlakes(count: number, seed = 113): SnowFlake[] {
  const rand = seededRand(seed);
  const flakes: SnowFlake[] = [];
  for (let i = 0; i < count; i += 1) {
    flakes.push({
      x: rand(),
      y: rand(),
      size: 2 + Math.floor(rand() * 3),
      speed: 0.12 + rand() * 0.18,
      drift: (rand() - 0.5) * 0.35,
    });
  }
  return flakes;
}

export function generateCloudBlobs(count: number, seed = 67): CloudBlob[] {
  const rand = seededRand(seed);
  const clouds: CloudBlob[] = [];
  for (let i = 0; i < count; i += 1) {
    clouds.push({
      x: rand() * 0.85,
      y: rand() * 0.22,
      width: 120 + rand() * 180,
      height: 36 + rand() * 48,
      opacity: 0.25 + rand() * 0.2,
    });
  }
  return clouds;
}
