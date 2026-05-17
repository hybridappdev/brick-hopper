import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

const SOUND_SOURCES = {
  coin: require('../../assets/sounds/coin.wav'),
  hop: require('../../assets/sounds/hop.wav'),
  stomp: require('../../assets/sounds/stomp.wav'),
  hit: require('../../assets/sounds/hit.wav'),
  win: require('../../assets/sounds/win.wav'),
} as const;

type SoundKey = keyof typeof SOUND_SOURCES;

let soundEnabled = true;
let initPromise: Promise<void> | null = null;
const players: Partial<Record<SoundKey, AudioPlayer>> = {};

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

async function ensureInitialized(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  if (!initPromise) {
    initPromise = (async () => {
      await setAudioModeAsync({ playsInSilentMode: true });
      for (const key of Object.keys(SOUND_SOURCES) as SoundKey[]) {
        players[key] = createAudioPlayer(SOUND_SOURCES[key]);
      }
    })();
  }
  await initPromise;
}

function playSound(key: SoundKey): void {
  if (Platform.OS === 'web' || !soundEnabled) {
    return;
  }

  void ensureInitialized().then(() => {
    const player = players[key];
    if (!player) {
      return;
    }
    player.seekTo(0);
    player.play();
  });
}

export function preloadSounds(): void {
  void ensureInitialized();
}

export function playCoinSound(): void {
  playSound('coin');
}

export function playHopSound(): void {
  playSound('hop');
}

export function playStompSound(): void {
  playSound('stomp');
}

export function playHitSound(): void {
  playSound('hit');
}

export function playWinSound(): void {
  playSound('win');
}

export function releaseSounds(): void {
  for (const key of Object.keys(players) as SoundKey[]) {
    players[key]?.release();
    delete players[key];
  }
  initPromise = null;
}
