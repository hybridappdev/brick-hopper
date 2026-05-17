/** Deterministic star field for the night sky (screen-space). */
export interface StarPoint {
  x: number;
  y: number;
  size: number;
  twinkleOffset: number;
}

export function generateStars(count: number, seed = 42): StarPoint[] {
  const stars: StarPoint[] = [];
  let s = seed;

  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rand(),
      y: rand() * 0.55,
      size: 1 + Math.floor(rand() * 2),
      twinkleOffset: rand() * Math.PI * 2,
    });
  }

  return stars;
}
