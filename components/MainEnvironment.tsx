import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { UserSessionConfig, ProgressBlock } from "../types";
import Editor from "./Editor";
import ProgressTracker from "./ProgressTracker";
import BreakModal from "./BreakModal";
import {
  clearPersistedAppState,
  PersistedMainState,
  savePersistedAppState,
} from "../persistence";
import RefreshGuardModal from "./RefreshGuardModal";

interface MainEnvironmentProps {
  config: UserSessionConfig;
  onComplete: () => void;
  initialState?: PersistedMainState | null;
  onPersist?: (state: PersistedMainState) => void;
  onRestart?: () => void;
}

const MainEnvironment: React.FC<MainEnvironmentProps> = ({
  config,
  onComplete,
  initialState,
  onPersist,
  onRestart,
}) => {
  // Generate the linear sequence of blocks
  const blocks: ProgressBlock[] = useMemo(() => {
    const list: ProgressBlock[] = [];
    for (let i = 0; i < config.sessionsCount; i++) {
      list.push({
        id: `focus-${i}`,
        type: "FOCUS",
        index: list.length,
        duration: config.focusMinutes * 60,
        sessionNum: i + 1,
      });
      list.push({
        id: `break-${i}`,
        type: "BREAK",
        index: list.length,
        duration: config.breakMinutes * 60,
        sessionNum: i + 1,
      });
    }
    return list;
  }, [config]);

  const hydrateState = useCallback(
    (raw: PersistedMainState | null | undefined) => {
      const fallback: PersistedMainState = {
        code: "",
        activeBlockIndex: 0,
        remainingSeconds: config.focusMinutes * 60,
        isBreakOpen: false,
        fileBaseName: "vibezzy_editor",
        fileExtension: "md",
        hasAutoDownloaded: false,
        lastTickMs: Date.now(),
      };

      if (!raw) return { state: fallback, didComplete: false };

      const safeIndex = Number.isFinite(raw.activeBlockIndex)
        ? Math.max(0, Math.min(raw.activeBlockIndex, blocks.length - 1))
        : 0;
      let idx = safeIndex;
      let remaining = Number.isFinite(raw.remainingSeconds)
        ? Math.max(0, Math.floor(raw.remainingSeconds))
        : (blocks[idx]?.duration ?? fallback.remainingSeconds);

      const lastTickMs = Number.isFinite(raw.lastTickMs)
        ? raw.lastTickMs
        : Date.now();
      let elapsedSeconds = Math.floor((Date.now() - lastTickMs) / 1000);
      if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
        elapsedSeconds = 0;
      }

      while (elapsedSeconds > 0 && idx < blocks.length) {
        if (remaining <= 0) {
          idx += 1;
          if (idx >= blocks.length) break;
          remaining = blocks[idx].duration;
          continue;
        }

        if (elapsedSeconds >= remaining) {
          elapsedSeconds -= remaining;
          idx += 1;
          if (idx >= blocks.length) {
            remaining = 0;
            break;
          }
          remaining = blocks[idx].duration;
        } else {
          remaining -= elapsedSeconds;
          elapsedSeconds = 0;
        }
      }

      if (idx >= blocks.length) {
        return { state: fallback, didComplete: true };
      }

      const hydrated: PersistedMainState = {
        code: typeof raw.code === "string" ? raw.code : "",
        activeBlockIndex: idx,
        remainingSeconds: remaining,
        isBreakOpen: Boolean(raw.isBreakOpen),
        fileBaseName:
          typeof raw.fileBaseName === "string" && raw.fileBaseName.trim()
            ? raw.fileBaseName
            : fallback.fileBaseName,
        fileExtension:
          raw.fileExtension === "txt" || raw.fileExtension === "md"
            ? raw.fileExtension
            : fallback.fileExtension,
        hasAutoDownloaded: Boolean(raw.hasAutoDownloaded),
        lastTickMs: Date.now(),
      };

      return { state: hydrated, didComplete: false };
    },
    [blocks, config.focusMinutes],
  );

  const hydrated = useMemo(
    () => hydrateState(initialState),
    [hydrateState, initialState],
  );

  const [code, setCode] = useState(hydrated.state.code);
  const codeRef = useRef(hydrated.state.code);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(
    hydrated.state.hasAutoDownloaded,
  );
  const hasAdvancedThisBlockRef = useRef(false);

  const [activeBlockIndex, setActiveBlockIndex] = useState(
    hydrated.state.activeBlockIndex,
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    hydrated.state.remainingSeconds,
  );
  const [isBreakOpen, setIsBreakOpen] = useState(hydrated.state.isBreakOpen);

  const [fileBaseName, setFileBaseName] = useState(hydrated.state.fileBaseName);
  const [fileExtension, setFileExtension] = useState<"txt" | "md">(
    hydrated.state.fileExtension,
  );
  const [isRefreshGuardOpen, setIsRefreshGuardOpen] = useState(false);
  const fileBaseNameRef = useRef(fileBaseName);
  useEffect(() => {
    fileBaseNameRef.current = fileBaseName;
  }, [fileBaseName]);

  // Intercept refresh shortcuts to show custom options.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isRefreshShortcut =
        e.key === "F5" ||
        ((e.ctrlKey || e.metaKey) && (key === "r" || key === "f5"));

      if (!isRefreshShortcut) return;
      e.preventDefault();
      setIsRefreshGuardOpen(true);
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  const activeBlock = blocks[activeBlockIndex];

  useEffect(() => {
    if (!hydrated.didComplete) return;
    onComplete();
  }, [hydrated.didComplete, onComplete]);

  // Keep break modal consistent with block type
  useEffect(() => {
    if (activeBlock?.type === "BREAK" && isBreakOpen === false) return;
    if (activeBlock?.type === "FOCUS" && isBreakOpen) setIsBreakOpen(false);
  }, [activeBlock?.type, isBreakOpen]);

  // Persist session state (used to restore on refresh)
  useEffect(() => {
    if (!onPersist) return;
    onPersist({
      code,
      activeBlockIndex,
      remainingSeconds,
      isBreakOpen,
      fileBaseName,
      fileExtension,
      hasAutoDownloaded,
      lastTickMs: Date.now(),
    });
  }, [
    onPersist,
    code,
    activeBlockIndex,
    remainingSeconds,
    isBreakOpen,
    fileBaseName,
    fileExtension,
    hasAutoDownloaded,
  ]);

  const autoDownloadCodeAsMarkdown = useCallback(() => {
    if (hasAutoDownloaded) return;
    setHasAutoDownloaded(true);

    const content = codeRef.current ?? "";
    const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");

    const sanitizeFileBase = (raw: string) => {
      const withoutExt = (raw || "").trim().replace(/\.(txt|md)$/i, "");
      const noIllegalChars = withoutExt.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
      const collapsed = noIllegalChars.replace(/\s+/g, " ").trim();
      const safe = collapsed.replace(/[ .]+$/g, "").replace(/^[ .]+/g, "");
      return safe.slice(0, 80);
    };

    const base = sanitizeFileBase(fileBaseNameRef.current);
    const fileName = `${base || "vibezzy_session"}_${stamp}.${fileExtension}`;

    const mime = fileExtension === "md" ? "text/markdown" : "text/plain";
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [hasAutoDownloaded, fileExtension]);

  const downloadNow = useCallback(() => {
    const content = codeRef.current ?? "";
    const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");

    const sanitizeFileBase = (raw: string) => {
      const withoutExt = (raw || "").trim().replace(/\.(txt|md)$/i, "");
      const noIllegalChars = withoutExt.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
      const collapsed = noIllegalChars.replace(/\s+/g, " ").trim();
      const safe = collapsed.replace(/[ .]+$/g, "").replace(/^[ .]+/g, "");
      return safe.slice(0, 80);
    };

    const base = sanitizeFileBase(fileBaseNameRef.current);
    const fileName = `${base || "vibezzy_session"}_${stamp}.${fileExtension}`;

    const mime = fileExtension === "md" ? "text/markdown" : "text/plain";
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [fileExtension]);

  const saveAndRefresh = useCallback(() => {
    const main: PersistedMainState = {
      code,
      activeBlockIndex,
      remainingSeconds,
      isBreakOpen,
      fileBaseName,
      fileExtension,
      hasAutoDownloaded,
      lastTickMs: Date.now(),
    };

    savePersistedAppState({
      version: 1,
      scene: "MAIN",
      config,
      main,
    });

    window.location.reload();
  }, [
    activeBlockIndex,
    code,
    config,
    fileBaseName,
    fileExtension,
    hasAutoDownloaded,
    isBreakOpen,
    remainingSeconds,
  ]);

  const hardRefresh = useCallback(() => {
    clearPersistedAppState();
    const url = new URL(window.location.href);
    url.searchParams.set("hard", Date.now().toString());
    window.location.replace(url.toString());
  }, []);

  const restartSession = useCallback(() => {
    clearPersistedAppState();
    onRestart?.();
  }, [onRestart]);

  // Logic to move to next block
  const goToNextBlock = useCallback(() => {
    if (activeBlockIndex < blocks.length - 1) {
      const nextIdx = activeBlockIndex + 1;

      // Auto-download when the LAST focus block ends (right before the final break starts)
      const isLastFocusEnding =
        blocks[activeBlockIndex]?.type === "FOCUS" &&
        nextIdx === blocks.length - 1 &&
        blocks[nextIdx]?.type === "BREAK";
      if (isLastFocusEnding) autoDownloadCodeAsMarkdown();

      setActiveBlockIndex(nextIdx);
      setRemainingSeconds(blocks[nextIdx].duration);
      if (blocks[nextIdx].type === "BREAK") {
        setIsBreakOpen(true);
      } else {
        setIsBreakOpen(false);
      }
    } else {
      onComplete();
    }
  }, [activeBlockIndex, blocks, onComplete, autoDownloadCodeAsMarkdown]);

  // Ensure a block only advances once (prevents skipping blocks)
  useEffect(() => {
    hasAdvancedThisBlockRef.current = false;
  }, [activeBlockIndex]);

  // Timer Effect (pure decrement; block-advance handled in a separate effect)
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBlockIndex]);

  // Advance when timer hits zero (single-shot)
  useEffect(() => {
    if (remainingSeconds !== 0) return;
    if (hasAdvancedThisBlockRef.current) return;
    hasAdvancedThisBlockRef.current = true;
    goToNextBlock();
  }, [remainingSeconds, goToNextBlock]);

  const handleFinishBreak = () => {
    // If the user finishes break activity early (logic in modal)
    // Actually per specs, break continues in background, but this callback can handle close
    setIsBreakOpen(false);
  };

  const handleCodeChange = (val: string) => {
    codeRef.current = val;
    setCode(val);
  };

  return (
    <div className="flex h-full w-full relative">
      <RefreshGuardModal
        isOpen={isRefreshGuardOpen}
        onCancel={() => setIsRefreshGuardOpen(false)}
        onDownload={downloadNow}
        onSaveAndRefresh={saveAndRefresh}
        onHardRefresh={hardRefresh}
      />

      <div className="w-4/5 h-full border-r border-slate-200">
        <Editor
          value={code}
          onChange={handleCodeChange}
          disabled={activeBlock?.type === "BREAK"}
          fileBaseName={fileBaseName}
          onFileBaseNameChange={setFileBaseName}
          fileExtension={fileExtension}
          onFileExtensionChange={setFileExtension}
          onDownload={downloadNow}
          onOpenRefreshMenu={() => setIsRefreshGuardOpen(true)}
          onRestart={restartSession}
        />
      </div>

      <div className="w-1/5 h-full bg-white overflow-hidden">
        <ProgressTracker
          blocks={blocks}
          activeIndex={activeBlockIndex}
          remainingSeconds={remainingSeconds}
        />
      </div>

      {activeBlock?.type === "BREAK" && !isBreakOpen && (
        <button
          onClick={() => setIsBreakOpen(true)}
          className="absolute bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-full shadow-lg transform transition active:scale-95"
        >
          Open Refreshment
        </button>
      )}

      {isBreakOpen && activeBlock?.type === "BREAK" && (
        <BreakModal
          remainingSeconds={remainingSeconds}
          onFinished={handleFinishBreak}
        />
      )}
    </div>
  );
};

export default MainEnvironment;
