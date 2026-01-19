
import React, { useState, useMemo } from 'react';
import { VALIDATION_MESSAGES } from '../constants';

interface CompletionScreenProps {
  username: string;
  sessionsCount: number;
  onReset: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ username, sessionsCount, onReset }) => {
  const [rated, setRated] = useState(false);

  const message = useMemo(() => {
    const randomMsg = VALIDATION_MESSAGES[Math.floor(Math.random() * VALIDATION_MESSAGES.length)];
    return randomMsg.replace('{username}', username).replace('{sessions}', sessionsCount.toString());
  }, [username, sessionsCount]);

  if (rated) {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center animate-in fade-in duration-500">
              <div className="text-8xl mb-8 animate-bounce">👋</div>
              <h1 className="text-4xl font-black mb-4">See You Next Time!</h1>
              <p className="text-xl text-slate-400">Your brain is happy. Your code is happy.</p>
              <button 
                onClick={onReset}
                className="mt-12 text-slate-500 hover:text-white underline underline-offset-4"
              >
                  Restart Session
              </button>
          </div>
      );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-50 via-blue-50 to-purple-50 p-6 animate-in fade-in duration-1000">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-xl rounded-[4rem] shadow-2xl p-16 flex flex-col items-center text-center space-y-12">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-inner scale-125">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            {message}
          </h1>
          <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
            Taking breaks is a superpower. You've proven that today. Your learning is now more sustainable.
          </p>
        </div>

        <div className="w-full pt-8 border-t border-slate-200">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Rate your session vibe</p>
          <div className="flex justify-center items-center space-x-6">
            <button 
              onClick={() => setRated(true)}
              className="group flex flex-col items-center space-y-2 hover:scale-110 transition p-4 rounded-3xl hover:bg-emerald-50"
            >
              <span className="text-5xl grayscale group-hover:grayscale-0 transition">😊</span>
              <span className="text-sm font-bold text-slate-600">Great</span>
            </button>
            <button 
              onClick={() => setRated(true)}
              className="group flex flex-col items-center space-y-2 hover:scale-110 transition p-4 rounded-3xl hover:bg-slate-50"
            >
              <span className="text-5xl grayscale group-hover:grayscale-0 transition">😐</span>
              <span className="text-sm font-bold text-slate-600">IDK</span>
            </button>
            <button 
              onClick={() => setRated(true)}
              className="group flex flex-col items-center space-y-2 hover:scale-110 transition p-4 rounded-3xl hover:bg-red-50"
            >
              <span className="text-5xl grayscale group-hover:grayscale-0 transition">😞</span>
              <span className="text-sm font-bold text-slate-600">Worst</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
