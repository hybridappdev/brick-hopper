# Brick Hopper

A portrait side-scrolling platformer built with **Expo** and **React Native**. Tilt your phone to explore while a brick auto-hops at the center of the screen. Collect every coin across two levels, stomp enemies from above, and use jump pads to reach the end.

## App flow

1. **Create profile** — name + brick color (first launch)
2. **Intro** — Play, High Scores, Settings
3. **Game** — Menu (save run) or Restart; level complete → Next Level / Main Menu
4. **High scores** — top 10 runs saved locally (AsyncStorage)

## How to play

| Action | Device | Web |
|--------|--------|-----|
| Explore the map | Tilt phone left / right | ← → arrow keys |
| Hop speed | Tap **Slow** / **Normal** / **Fast** (bottom) | Keys **1** / **2** / **3** |
| Move the brick | Stays at screen center (map scrolls under you) | Same |
| Hop | Automatic — timing varies with hop speed | Same |
| Stomp enemy | Land on top while falling | Same |
| Restart | Tap **Restart** (top right) | Same |

**Goal:** Collect all coins in each level. Land on enemies from above to defeat them (+25 pts). Touch an enemy from the side or fall off the world and you respawn at the last safe landing (checkpoint). Beat Level 1, then tap **Next Level** to continue with your score carried over.

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
- [@react-native-async-storage/async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/) — profile, settings, high scores

## Project structure

```
src/
├── GameEngine.tsx       # Session state, HUD, game loop wiring
├── App.tsx              # Root layout + safe area
├── constants/           # Tuning (hop, tilt, level layout, colors)
│   └── levels/          # Level registry (buildLevel, LEVEL_COUNT)
├── components/          # ECS components (Position, Velocity, Collider, Sprite)
├── entities/            # Entity factories (Player, Coin, Platform, …)
├── systems/             # Per-frame logic (physics, camera, collisions, render)
├── renderers/           # Visual layers (entities, parallax, sunset background)
├── ui/                  # TiltControls, HopSpeedControls, overlays, restart
├── utils/               # Camera, coins, respawn, stomp, level bootstrap
└── types/               # ECS and engine typings
```

### Systems (update order)

1. **TimerSystem** — per-level elapsed time  
2. **AmbientSystem** — day/night + seasonal sky (continuous across levels)  
3. **CollisionSystem** — ground detection, coyote time  
4. **InteractionSystem** — coins, enemies (stomp or hurt), jump pads  
5. **PatrolSystem** — moving platforms and enemies  
6. **CameraSystem** — horizontal scroll from tilt  
7. **MovementSystem** — brick locked to viewport center, auto-hop  
8. **PhysicsSystem** — Matter.js step  
9. **RenderSystem** — world → screen positions via camera offset  

The sky cycles through **dawn → day → dusk → night** (~90s) and **spring → summer → autumn → winter** (~6 min) with tint overlays, stars, and sun/moon on the parallax sunset artwork. Tune cycles in `src/constants/ambient.ts`.

Level data: `src/constants/level.ts` (Level 1) and `src/constants/level2.ts` (Level 2), loaded via `src/constants/levels/index.ts`. Start coins are placed on the viewport-center path so they stay collectible across screen sizes.

## Configuration

Key tuning files:

| File | Purpose |
|------|---------|
| `src/constants/tilt.ts` | Dead zone, scroll speed |
| `src/constants/hop.ts` | Auto-hop intervals and impulse |
| `src/constants/coin.ts` | Pickup radius and score value |
| `src/constants/enemy.ts` | Patrol speed, stomp score, bounce |
| `src/constants/world.ts` | World size, camera bounds |
| `src/constants/level.ts` | Level 1 layout |
| `src/constants/level2.ts` | Level 2 layout |

## License

Private project — all rights reserved unless otherwise specified.
