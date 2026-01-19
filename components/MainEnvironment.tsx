
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserSessionConfig, ProgressBlock, BlockType } from '../types';
import Editor from './Editor';
import ProgressTracker from './ProgressTracker';
import BreakModal from './BreakModal';

interface MainEnvironmentProps {
  config: UserSessionConfig;
  onComplete: () => void;
}

const MainEnvironment: React.FC<MainEnvironmentProps> = ({ config, onComplete }) => {
  const [code, setCode] = useState('');
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(config.focusMinutes * 60);
  const [isBreakOpen, setIsBreakOpen] = useState(false);

  // Generate the linear sequence of blocks
  const blocks: ProgressBlock[] = useMemo(() => {
    const list: ProgressBlock[] = [];
    for (let i = 0; i < config.sessionsCount; i++) {
      list.push({
        id: `focus-${i}`,
        type: 'FOCUS',
        index: list.length,
        duration: config.focusMinutes * 60,
        sessionNum: i + 1,
      });
      list.push({
        id: `break-${i}`,
        type: 'BREAK',
        index: list.length,
        duration: config.breakMinutes * 60,
        sessionNum: i + 1,
      });
    }
    return list;
  }, [config]);

  const activeBlock = blocks[activeBlockIndex];

  // Logic to move to next block
  const goToNextBlock = useCallback(() => {
    if (activeBlockIndex < blocks.length - 1) {
      const nextIdx = activeBlockIndex + 1;
      setActiveBlockIndex(nextIdx);
      setRemainingSeconds(blocks[nextIdx].duration);
      if (blocks[nextIdx].type === 'BREAK') {
        setIsBreakOpen(true);
      } else {
        setIsBreakOpen(false);
      }
    } else {
      onComplete();
    }
  }, [activeBlockIndex, blocks, onComplete]);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
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

  return (
    <div className="flex h-full w-full relative">
      <div className="w-4/5 h-full border-r border-slate-200">
        <Editor 
          value={code} 
          onChange={setCode} 
          disabled={activeBlock?.type === 'BREAK'} 
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

      {isBreakOpen && activeBlock?.type === 'BREAK' && (
        <BreakModal 
          remainingSeconds={remainingSeconds} 
          onFinished={handleFinishBreak} 
        />
      )}
    </div>
  );
};

export default MainEnvironment;
