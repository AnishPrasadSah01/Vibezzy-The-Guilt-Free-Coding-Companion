
import React, { useState, useEffect } from 'react';
import { ProgressBlock } from '../types';
import { MOTIVATION_GIFS } from '../constants';

interface ProgressTrackerProps {
  blocks: ProgressBlock[];
  activeIndex: number;
  remainingSeconds: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ blocks, activeIndex, remainingSeconds }) => {
  const [gifIndex, setGifIndex] = useState(0);

  useEffect(() => {
    // Cycle GIFs every 12 seconds during focus
    const interval = setInterval(() => {
      setGifIndex(prev => (prev + 1) % MOTIVATION_GIFS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <h3 className="text-center font-bold text-slate-400 text-xs tracking-widest uppercase py-2">Flow Journey</h3>
      <div className="flex-grow flex flex-col space-y-2 relative overflow-y-auto pr-2 scrollbar-hide">
        {blocks.map((block, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isPending = idx > activeIndex;

          if (isCompleted) return null; // Blocks disappear once completed

          const percentFilled = isActive 
            ? ((block.duration - remainingSeconds) / block.duration) * 100 
            : 0;

          return (
            <div 
              key={block.id}
              className={`relative rounded-2xl border-2 transition-all duration-500 overflow-hidden flex flex-col justify-center items-center h-48
                ${isActive ? 'border-blue-400 shadow-md scale-105 z-10' : 'border-slate-100 opacity-30 grayscale'}
                ${block.type === 'FOCUS' ? 'bg-blue-50' : 'bg-emerald-50'}
              `}
            >
              {/* Fill Animation Background */}
              {isActive && (
                <div 
                  className={`absolute top-0 left-0 w-full timer-fill ${block.type === 'FOCUS' ? 'bg-blue-200' : 'bg-emerald-200'}`}
                  style={{ height: `${percentFilled}%` }}
                />
              )}

              {/* Overlay Content */}
              <div className="relative z-10 flex flex-col items-center text-center p-4">
                <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${block.type === 'FOCUS' ? 'text-blue-500' : 'text-emerald-500'}`}>
                  {block.type} BLOCK {block.sessionNum}
                </span>

                {isActive && block.type === 'FOCUS' && (
                  <div className="w-full mt-2">
                    <img 
                      src={MOTIVATION_GIFS[gifIndex]} 
                      alt="Motivation" 
                      className="w-full h-24 object-cover rounded-lg shadow-inner border border-white/50"
                    />
                  </div>
                )}
                
                {isActive && block.type === 'BREAK' && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center animate-bounce mb-2">
                        <span className="text-xl">🧘</span>
                    </div>
                  </div>
                )}

                {isActive && (
                  <span className="mt-2 text-2xl font-bold font-mono">
                    {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
