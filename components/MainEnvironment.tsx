import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { UserSessionConfig, ProgressBlock, BlockType } from "../types";
import Editor from "./Editor";
import ProgressTracker from "./ProgressTracker";
import BreakModal from "./BreakModal";

interface MainEnvironmentProps {
  config: UserSessionConfig;
  onComplete: () => void;
}

const MainEnvironment: React.FC<MainEnvironmentProps> = ({
  config,
  onComplete,
}) => {
  const [code, setCode] = useState("");
  const codeRef = useRef("");
  const hasAutoDownloadedRef = useRef(false);
  const hasAdvancedThisBlockRef = useRef(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(
    config.focusMinutes * 60,
  );
  const [isBreakOpen, setIsBreakOpen] = useState(false);

  const [fileBaseName, setFileBaseName] = useState(
    `vibezzy_editor_${(config.username || "coder").toLowerCase()}`,
  );
  const fileBaseNameRef = useRef(fileBaseName);
  useEffect(() => {
    fileBaseNameRef.current = fileBaseName;
  }, [fileBaseName]);

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

  const activeBlock = blocks[activeBlockIndex];

  const autoDownloadCodeAsTxt = useCallback(() => {
    if (hasAutoDownloadedRef.current) return;
    hasAutoDownloadedRef.current = true;

    const content = codeRef.current ?? "";
    const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");

    const sanitizeFileBase = (raw: string) => {
      const withoutExt = (raw || "").trim().replace(/\.txt$/i, "");
      const noIllegalChars = withoutExt.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
      const collapsed = noIllegalChars.replace(/\s+/g, " ").trim();
      const safe = collapsed.replace(/[ .]+$/g, "").replace(/^[ .]+/g, "");
      return safe.slice(0, 80);
    };

    const base = sanitizeFileBase(fileBaseNameRef.current);
    const fileName = `${base || "vibezzy_session"}_${stamp}.txt`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, []);

  // Logic to move to next block
  const goToNextBlock = useCallback(() => {
    if (activeBlockIndex < blocks.length - 1) {
      const nextIdx = activeBlockIndex + 1;

      // Auto-download when the LAST focus block ends (right before the final break starts)
      const isLastFocusEnding =
        blocks[activeBlockIndex]?.type === "FOCUS" &&
        nextIdx === blocks.length - 1 &&
        blocks[nextIdx]?.type === "BREAK";
      if (isLastFocusEnding) {
        autoDownloadCodeAsTxt();
      }

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
  }, [activeBlockIndex, blocks, onComplete, autoDownloadCodeAsTxt]);

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
      <div className="w-4/5 h-full border-r border-slate-200">
        <Editor
          value={code}
          onChange={handleCodeChange}
          disabled={activeBlock?.type === "BREAK"}
          username={config.username}
          fileBaseName={fileBaseName}
          onFileBaseNameChange={setFileBaseName}
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
