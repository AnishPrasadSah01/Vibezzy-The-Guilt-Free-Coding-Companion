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
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(
    config.focusMinutes * 60,
  );
  const [isBreakOpen, setIsBreakOpen] = useState(false);

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
    const safeUsername = (config.username || "coder")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "");

    const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
    const fileName = `vibezzy_${safeUsername || "coder"}_${stamp}.txt`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [config.username]);

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

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          goToNextBlock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBlockIndex, goToNextBlock]);

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
        />
      </div>

      <div className="w-1/5 h-full bg-white overflow-hidden">
        <ProgressTracker
          blocks={blocks}
          activeIndex={activeBlockIndex}
          remainingSeconds={remainingSeconds}
        />
      </div>

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
