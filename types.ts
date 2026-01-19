
export type SceneType = 'WELCOME' | 'CONFIG' | 'MAIN' | 'COMPLETION';

export type BlockType = 'FOCUS' | 'BREAK';

export interface UserSessionConfig {
  username: string;
  focusMinutes: number;
  breakMinutes: number;
  sessionsCount: number;
}

export interface ProgressBlock {
  id: string;
  type: BlockType;
  index: number;
  duration: number; // in seconds
  sessionNum: number;
}
