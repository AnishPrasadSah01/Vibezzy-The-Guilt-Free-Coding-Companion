import React, { useEffect, useState, useCallback } from "react";
import { SceneType, UserSessionConfig } from "./types";
import WelcomeScreen from "./components/WelcomeScreen";
import ConfigScreen from "./components/ConfigScreen";
import MainEnvironment from "./components/MainEnvironment";
import CompletionScreen from "./components/CompletionScreen";
import { OptionalUploadedFile } from "./components/ConfigScreen";
import {
  clearPersistedAppState,
  loadPersistedAppState,
  savePersistedAppState,
  PersistedMainState,
} from "./persistence";

const App: React.FC = () => {
  const [scene, setScene] = useState<SceneType>("WELCOME");
  const [config, setConfig] = useState<UserSessionConfig | null>(null);
  const [initialMainState, setInitialMainState] =
    useState<PersistedMainState | null>(null);

  useEffect(() => {
    const persisted = loadPersistedAppState();
    if (!persisted) return;

    if (persisted.config) {
      setConfig(persisted.config);
    }

    if (persisted.scene === "MAIN") {
      setScene("MAIN");
      setInitialMainState(persisted.main ?? null);
    } else if (persisted.scene === "CONFIG") {
      setScene("CONFIG");
    } else if (persisted.scene === "COMPLETION") {
      setScene("COMPLETION");
    }
  }, []);

  useEffect(() => {
    if (scene !== "MAIN") return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Most browsers ignore the string, but setting returnValue triggers the prompt.
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [scene]);

  const startConfig = useCallback(() => {
    clearPersistedAppState();
    setConfig(null);
    setInitialMainState(null);
    setScene("CONFIG");
    savePersistedAppState({
      version: 1,
      scene: "CONFIG",
      config: null,
      main: null,
    });
  }, []);

  const goToWelcome = useCallback(() => {
    clearPersistedAppState();
    setConfig(null);
    setInitialMainState(null);
    setScene("WELCOME");
  }, []);

  const startCoding = useCallback(
    (newConfig: UserSessionConfig, uploaded?: OptionalUploadedFile) => {
      clearPersistedAppState();
      setConfig(newConfig);

      if (uploaded) {
        setInitialMainState({
          code: uploaded.content,
          activeBlockIndex: 0,
          remainingSeconds: newConfig.focusMinutes * 60,
          isBreakOpen: false,
          fileBaseName: uploaded.baseName,
          fileExtension: uploaded.extension,
          hasAutoDownloaded: false,
          lastTickMs: Date.now(),
        });
      } else {
        setInitialMainState(null);
      }

      setScene("MAIN");

      savePersistedAppState({
        version: 1,
        scene: "MAIN",
        config: newConfig,
        main: null,
      });
    },
    [],
  );

  const completeSessions = useCallback(() => {
    setScene("COMPLETION");
    savePersistedAppState({
      version: 1,
      scene: "COMPLETION",
      config,
      main: null,
    });
  }, [config]);

  const resetApp = useCallback(() => {
    clearPersistedAppState();
    window.location.reload();
  }, []);

  const persistMainState = useCallback(
    (main: PersistedMainState) => {
      savePersistedAppState({
        version: 1,
        scene: "MAIN",
        config,
        main,
      });
    },
    [config],
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-800">
      {scene === "WELCOME" && <WelcomeScreen onStart={startConfig} />}

      {scene === "CONFIG" && <ConfigScreen onStart={startCoding} />}

      {scene === "MAIN" && config && (
        <MainEnvironment
          config={config}
          onComplete={completeSessions}
          initialState={initialMainState}
          onPersist={persistMainState}
          onRestart={goToWelcome}
        />
      )}

      {scene === "COMPLETION" && config && (
        <CompletionScreen
          sessionsCount={config.sessionsCount}
          onReset={resetApp}
        />
      )}
    </div>
  );
};

export default App;
