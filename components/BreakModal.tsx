
import React, { useState, useEffect } from 'react';
import { PHYSICAL_ACTIVITIES, MEMES } from '../constants';

interface BreakModalProps {
  remainingSeconds: number;
  onFinished: () => void;
}

type BreakStage = 'CHOOSE' | 'ACTIVITY' | 'MEME';

const BreakModal: React.FC<BreakModalProps> = ({ remainingSeconds, onFinished }) => {
  const [stage, setStage] = useState<BreakStage>('CHOOSE');
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // When time gets low, we just auto-close the modal handled by parent
  // But we need to respond to the "Next" / "Done" clicks
  const handleInteraction = () => {
    if (remainingSeconds < 60) {
      onFinished();
    } else {
      // Refresh current content
      if (stage === 'ACTIVITY') {
        setCurrentContentIndex(Math.floor(Math.random() * PHYSICAL_ACTIVITIES.length));
      } else {
        setCurrentContentIndex(Math.floor(Math.random() * MEMES.length));
      }
    }
  };

  const startStage = (newStage: BreakStage) => {
    setStage(newStage);
    const poolSize = newStage === 'ACTIVITY' ? PHYSICAL_ACTIVITIES.length : MEMES.length;
    setCurrentContentIndex(Math.floor(Math.random() * poolSize));
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col p-10 animate-in zoom-in duration-300">
        
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-slate-800">Mindful Break</h2>
            <div className="px-6 py-2 bg-emerald-500 text-white rounded-full font-mono font-bold shadow-lg">
                {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
            </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center min-h-[300px]">
          {stage === 'CHOOSE' && (
            <div className="grid grid-cols-2 gap-8 w-full">
              <button 
                onClick={() => startStage('ACTIVITY')}
                className="group flex flex-col items-center p-8 border-4 border-emerald-100 hover:border-emerald-400 rounded-3xl transition-all hover:scale-105 hover:bg-emerald-50"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition">🏃‍♂️</div>
                <h3 className="text-xl font-bold text-slate-700">Body Move</h3>
                <p className="text-slate-400 text-sm mt-2 text-center">Quick physical recharge for your energy</p>
              </button>
              
              <button 
                onClick={() => startStage('MEME')}
                className="group flex flex-col items-center p-8 border-4 border-blue-100 hover:border-blue-400 rounded-3xl transition-all hover:scale-105 hover:bg-blue-50"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition">🎭</div>
                <h3 className="text-xl font-bold text-slate-700">Brain Fuel</h3>
                <p className="text-slate-400 text-sm mt-2 text-center">Random coding memes to boost mood</p>
              </button>
            </div>
          )}

          {stage === 'ACTIVITY' && (
            <div className="text-center animate-in slide-in-from-bottom duration-300">
              <div className="text-slate-800 text-3xl font-medium leading-relaxed max-w-md mx-auto italic">
                "{PHYSICAL_ACTIVITIES[currentContentIndex]}"
              </div>
            </div>
          )}

          {stage === 'MEME' && (
            <div className="w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
              <img 
                src={MEMES[currentContentIndex]} 
                alt="Coding Meme" 
                className="max-h-[400px] rounded-2xl shadow-xl object-contain border-4 border-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/400/400?random=${currentContentIndex}`;
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-between items-center">
            {stage !== 'CHOOSE' && (
                <button 
                    onClick={() => setStage('CHOOSE')}
                    className="text-slate-400 hover:text-slate-600 font-bold px-4"
                >
                    Back to options
                </button>
            )}
            
            {stage !== 'CHOOSE' && (
                <button 
                  onClick={handleInteraction}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition active:scale-95 flex items-center space-x-2 ml-auto"
                >
                  <span>{remainingSeconds < 60 ? 'Done & Return' : 'Give me another!'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default BreakModal;
