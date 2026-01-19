
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="relative p-12 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl flex flex-col items-center max-w-2xl text-center space-y-8 animate-in fade-in duration-700">
        <img 
          src="https://raw.githubusercontent.com/google/genai-toolbox/main/assets/logo.png" 
          alt="Vibezzy Logo" 
          className="w-48 h-48 object-contain mb-4 rounded-full shadow-lg border-4 border-white"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/200?random=1';
          }}
        />
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-slate-800 tracking-tight">Vibezzy</h1>
          <p className="text-xl text-slate-600 font-medium italic">The Guilt-Free Coding Companion</p>
        </div>

        <p className="text-lg text-slate-600 max-w-md">
          A therapeutic coding environment designed for healthy habits, mindful focus, and mandatory rest.
        </p>

        <div className="absolute bottom-[-100px] right-[-100px] md:bottom-12 md:right-12">
            <button 
              onClick={onStart}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition active:scale-95 hover:scale-105 flex items-center space-x-2"
            >
              <span className="text-lg">Let's Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
