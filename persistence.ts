import { SceneType, UserSessionConfig } from "./types";

export const VIBEZZY_PERSIST_KEY = "vibezzy_state_v1";

export interface PersistedMainState {
  code: string;
  activeBlockIndex: number;
  remainingSeconds: number;
  isBreakOpen: boolean;
  fileBaseName: string;
  fileExtension: "txt" | "md";
  hasAutoDownloaded: boolean;
  lastTickMs: number;
}

export interface PersistedAppState {
  version: 1;
  scene: SceneType;
  config: UserSessionConfig | null;
  main: PersistedMainState | null;
}

const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null;

export const loadPersistedAppState = (): PersistedAppState | null => {
  try {
    const raw = localStorage.getItem(VIBEZZY_PERSIST_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) return null;
    if (parsed.version !== 1) return null;

    const scene = parsed.scene as SceneType;
    const config = (parsed.config ?? null) as UserSessionConfig | null;
    const mainRaw = (parsed.main ?? null) as any;
    const main: PersistedMainState | null = mainRaw
      ? {
          code: typeof mainRaw.code === "string" ? mainRaw.code : "",
          activeBlockIndex:
            typeof mainRaw.activeBlockIndex === "number" ? mainRaw.activeBlockIndex : 0,
          remainingSeconds:
            typeof mainRaw.remainingSeconds === "number" ? mainRaw.remainingSeconds : 0,
          isBreakOpen: Boolean(mainRaw.isBreakOpen),
          fileBaseName:
            typeof mainRaw.fileBaseName === "string" ? mainRaw.fileBaseName : "vibezzy_editor",
          fileExtension: mainRaw.fileExtension === "txt" || mainRaw.fileExtension === "md" ? mainRaw.fileExtension : "md",
          hasAutoDownloaded: Boolean(mainRaw.hasAutoDownloaded),
          lastTickMs: typeof mainRaw.lastTickMs === "number" ? mainRaw.lastTickMs : Date.now(),
        }
      : null;

    return {
      version: 1,
      scene,
      config,
      main,
    };
  } catch {
    return null;
  }
};

export const savePersistedAppState = (state: PersistedAppState) => {
  try {
    localStorage.setItem(VIBEZZY_PERSIST_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / privacy mode errors.
  }
};

export const clearPersistedAppState = () => {
  try {
    localStorage.removeItem(VIBEZZY_PERSIST_KEY);
  } catch {
    // Ignore
  }
};
