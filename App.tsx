
import React, { useState, useCallback } from 'react';
import { SceneType, UserSessionConfig } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import ConfigScreen from './components/ConfigScreen';
import MainEnvironment from './components/MainEnvironment';
import CompletionScreen from './components/CompletionScreen';

const App: React.FC = () => {
  const [scene, setScene] = useState<SceneType>('WELCOME');
  const [config, setConfig] = useState<UserSessionConfig | null>(null);

  const startConfig = useCallback(() => {
    setScene('CONFIG');
  }, []);

  const startCoding = useCallback((newConfig: UserSessionConfig) => {
    setConfig(newConfig);
    setScene('MAIN');
  }, []);

  const completeSessions = useCallback(() => {
    setScene('COMPLETION');
  }, []);

  const resetApp = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-800">
      {scene === 'WELCOME' && (
        <WelcomeScreen onStart={startConfig} />
      )}
      
      {scene === 'CONFIG' && (
        <ConfigScreen onStart={startCoding} />
      )}

      {scene === 'MAIN' && config && (
        <MainEnvironment 
          config={config} 
          onComplete={completeSessions}
        />
      )}

      {scene === 'COMPLETION' && config && (
        <CompletionScreen 
          username={config.username} 
          sessionsCount={config.sessionsCount}
          onReset={resetApp} 
        />
      )}
    </div>
  );
};

export default App;
