# Brick Hopper

A portrait side-scrolling platformer built with **Expo** and **React Native**. Tilt your phone to explore while a brick auto-hops at the center of the screen. Collect every coin, reach the exit flag, stomp enemies from above, and use jump pads to clear eight levels.

## App flow

1. **Create profile** — name + brick color (first launch)
2. **Intro** — Play (full campaign), Levels (picker), High Scores, Settings
3. **Game** — 3 lives per run; collect coins then touch the exit flag to finish each level
4. **Level picker** — replay unlocked levels; see difficulty, best time, and score
5. **High scores** — top 10 campaign runs saved locally (AsyncStorage)

## How to play

| Action | Device | Web |
|--------|--------|-----|
| Explore the map | Tilt phone left / right | ← → arrow keys |
| Hop speed | Tap **Slow** / **Normal** / **Fast** (bottom) | Keys **1** / **2** / **3** |
| Move the brick | Stays at screen center (map scrolls under you) | Same |
| Hop | Automatic — timing varies with hop speed | Same |
| Stomp enemy | Land on top while falling | Same |
| Restart | Tap **Restart** (top right) | Same |

**Goal per level:** Collect **all coins**, then touch the **green exit flag** at the end. Land on enemies from above to defeat them (+25 pts). Side hits and falling off the world cost a life — you have **3 lives per run**. Lose all lives and the run ends (Retry or Main Menu).

**Campaign:** **Play** runs levels 1→8 with score and lives carried across levels. **Levels** lets you practice any unlocked stage individually.

## Getting started

**Requirements:** Node.js 18+, npm, and [Expo Go](https://expo.dev/go) on a physical device (recommended for tilt controls).

```bash
npm install
npm start
```

Then scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a simulator.

```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Browser (arrow-key fallback)
```

Tilt controls work best on a **real device** — simulators and web do not provide an accelerometer.

## Tech stack

- [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [React Native Game Engine](https://github.com/bberak/react-native-game-engine) — ECS-style update loop
- [Matter.js](https://brm.io/matter-js/) — 2D physics (platforms, player, sensors)
- [expo-sensors](https://docs.expo.dev/versions/latest/sdk/accelerometer/) — accelerometer tilt input
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — coin, hop, stomp, and hit feedback
- [@react-native-async-storage/async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/) — profile, settings, high scores, level progress

## Project structure

```
src/
├── GameEngine.tsx       # Session state, HUD, game loop wiring
├── constants/           # Tuning + level layout (level.ts … level8.ts)
│   └── levels/          # Registry (buildLevel, LEVEL_COUNT, meta)
├── entities/            # Player, Coin, Platform, Enemy, Goal, …
├── systems/             # Physics, collisions, patrol, movement, render
├── ui/                  # HUD, overlays, level picker
└── storage/             # AsyncStorage persistence
```

### Systems (update order)

1. **TimerSystem** — per-level elapsed time  
2. **AmbientSystem** — day/night + weather  
3. **CollisionSystem** — ground detection, coyote time  
4. **InteractionSystem** — coins, enemies, jump pads, exit goal  
5. **PatrolSystem** — moving platforms and enemies  
6. **CameraSystem** — horizontal scroll from tilt  
7. **MovementSystem** — brick locked to viewport center, auto-hop  
8. **PhysicsSystem** — Matter.js step  
9. **RenderSystem** — world → screen positions  

Level data lives in `src/constants/level.ts` through `level8.ts`, registered in `src/constants/levels/index.ts`.

## Configuration

| File | Purpose |
|------|---------|
| `src/constants/world.ts` | Lives per run, fall respawn distance |
| `src/constants/hop.ts` | Auto-hop intervals and impulse |
| `src/constants/coin.ts` | Pickup radius and score value |
| `src/constants/enemy.ts` | Patrol speed, stomp score |
| `src/constants/levels/meta.ts` | Level titles and difficulty |

## License

Private project — all rights reserved unless otherwise specified.
