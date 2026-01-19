
import React, { useState } from 'react';
import { UserSessionConfig } from '../types';

interface ConfigScreenProps {
  onStart: (config: UserSessionConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onStart }) => {
  const [username, setUsername] = useState('');
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [sessionsCount, setSessionsCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter your name to personalize your vibe!");
    onStart({
      username,
      focusMinutes,
      breakMinutes,
      sessionsCount,
    });
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-6">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-100"
      >
        <h2 className="text-3xl font-bold text-slate-800 border-b pb-4">Set Your Vibe</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-500">Your Name</label>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="How should we call you?"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-500">Focus Session</label>
            <select 
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400"
            >
              <option value={1}>1 min (demo)</option>
              <option value={25}>25 min</option>
              <option value={60}>60 min</option>
              <option value={120}>120 min</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-500">Break Duration</label>
            <select 
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400"
            >
              <option value={1}>1 min (demo)</option>
              <option value={5}>5 min</option>
              <option value={10}>10 min</option>
              <option value={25}>25 min</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-500">How many rounds?</label>
          <select 
            value={sessionsCount}
            onChange={(e) => setSessionsCount(Number(e.target.value))}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400"
          >
            <option value={1}>1 Session</option>
            <option value={2}>2 Sessions</option>
            <option value={3}>3 Sessions</option>
          </select>
          <p className="text-xs text-slate-400 italic">Each session = Focus block + Break block</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition active:scale-95 hover:scale-105"
          >
            Start Coding
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigScreen;
