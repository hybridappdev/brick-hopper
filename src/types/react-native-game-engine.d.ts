declare module 'react-native-game-engine' {
  import type { ComponentType, ReactNode } from 'react';
  import type { StyleProp, ViewStyle } from 'react-native';

  export interface TimeState {
    current: number;
    delta: number;
    previous: number;
    previousDelta: number;
  }

  export interface GameEngineUpdateEventOptionType {
    touches: unknown[];
    screen: { width: number; height: number };
    layout: { width: number; height: number };
    time: TimeState;
    dispatch: (event: { type: string; [key: string]: unknown }) => void;
    events: { type: string; [key: string]: unknown }[];
  }

  export type SystemFunction<TEntities extends Record<string, unknown>> = (
    entities: TEntities,
    args: GameEngineUpdateEventOptionType,
  ) => TEntities;

  export interface GameEngineEvent {
    type: string;
    [key: string]: unknown;
  }

  export interface GameEngineProps {
    style?: StyleProp<ViewStyle>;
    systems?: SystemFunction<Record<string, unknown>>[];
    entities?: Record<string, unknown>;
    running?: boolean;
    onEvent?: (event: GameEngineEvent) => void;
    children?: ReactNode;
  }

  export const GameEngine: ComponentType<GameEngineProps>;
}
