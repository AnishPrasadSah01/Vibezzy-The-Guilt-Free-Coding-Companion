
import React from 'react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  username: string;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, disabled, username }) => {
  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${disabled ? 'bg-slate-100 opacity-70' : 'bg-white'}`}>
      <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="ml-4 font-mono text-sm text-slate-400">vibezzy_editor_{username.toLowerCase()}.txt</span>
        </div>
        {disabled && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>BREAK MODE ACTIVE</span>
          </div>
        )}
      </div>
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Resting time... Take a deep breath." : "// Write your ideas here..."}
        className="flex-grow p-8 font-mono text-lg outline-none resize-none bg-transparent placeholder-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-200"
      />
    </div>
  );
};

export default Editor;
