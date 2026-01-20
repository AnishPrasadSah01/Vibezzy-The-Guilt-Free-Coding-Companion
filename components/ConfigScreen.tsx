import React, { useState } from "react";
import { UserSessionConfig } from "../types";

export interface OptionalUploadedFile {
  baseName: string;
  extension: "txt" | "md";
  content: string;
}

interface ConfigScreenProps {
  onStart: (
    config: UserSessionConfig,
    uploadedFile?: OptionalUploadedFile,
  ) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onStart }) => {
  const [focusPreset, setFocusPreset] = useState<
    "1" | "25" | "60" | "120" | "custom"
  >("25");
  const [breakPreset, setBreakPreset] = useState<
    "1" | "5" | "10" | "25" | "custom"
  >("5");
  const [sessionsPreset, setSessionsPreset] = useState<
    "1" | "2" | "3" | "custom"
  >("1");

  const [customFocus, setCustomFocus] = useState("25");
  const [customBreak, setCustomBreak] = useState("5");
  const [customSessions, setCustomSessions] = useState("1");

  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<OptionalUploadedFile | null>(
    null,
  );

  const parsePositiveInt = (raw: string) => {
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return null;
    if (n <= 0) return null;
    return n;
  };

  const resolveConfig = (): UserSessionConfig | null => {
    const focusMinutes =
      focusPreset === "custom"
        ? parsePositiveInt(customFocus)
        : Number(focusPreset);
    const breakMinutes =
      breakPreset === "custom"
        ? parsePositiveInt(customBreak)
        : Number(breakPreset);
    const sessionsCount =
      sessionsPreset === "custom"
        ? parsePositiveInt(customSessions)
        : Number(sessionsPreset);

    if (!focusMinutes) {
      setError("Focus minutes must be a positive number.");
      return null;
    }
    if (!breakMinutes) {
      setError("Break minutes must be a positive number.");
      return null;
    }
    if (!sessionsCount) {
      setError("Sessions count must be a positive number.");
      return null;
    }

    if (focusMinutes > 8 * 60) {
      setError("Focus session is too long (max 480 minutes).");
      return null;
    }
    if (breakMinutes > 8 * 60) {
      setError("Break session is too long (max 480 minutes).");
      return null;
    }
    if (sessionsCount > 50) {
      setError("Too many sessions (max 50).");
      return null;
    }

    setError(null);
    return {
      focusMinutes,
      breakMinutes,
      sessionsCount,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config = resolveConfig();
    if (!config) return;
    onStart(config, uploadedFile ?? undefined);
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) {
      setUploadedFile(null);
      return;
    }

    const name = file.name || "";
    const lower = name.toLowerCase();
    const extension: "txt" | "md" | null = lower.endsWith(".md")
      ? "md"
      : lower.endsWith(".txt")
        ? "txt"
        : null;

    if (!extension) {
      setError("Only .txt and .md files are supported.");
      setUploadedFile(null);
      return;
    }

    if (file.size > 2_000_000) {
      setError("File is too large (max 2MB).");
      setUploadedFile(null);
      return;
    }

    const baseName = name.replace(/\.(txt|md)$/i, "") || "vibezzy_editor";
    const reader = new FileReader();

    reader.onerror = () => {
      setError("Could not read the selected file.");
      setUploadedFile(null);
    };

    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      setError(null);
      setUploadedFile({ baseName, extension, content });
    };

    reader.readAsText(file);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-100"
      >
        <h2 className="text-3xl font-bold text-slate-800 border-b pb-4">
          Set Your Vibe
        </h2>

        {error && (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-500">
              Focus Session
            </label>
            <select
              value={focusPreset}
              onChange={(e) => setFocusPreset(e.target.value as any)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400"
            >
              <option value={"1"}>1 min (demo)</option>
              <option value={"25"}>25 min</option>
              <option value={"60"}>60 min</option>
              <option value={"120"}>120 min</option>
              <option value={"custom"}>Custom…</option>
            </select>

            {focusPreset === "custom" && (
              <input
                type="number"
                min={1}
                step={1}
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                placeholder="Enter minutes"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-500">
              Break Duration
            </label>
            <select
              value={breakPreset}
              onChange={(e) => setBreakPreset(e.target.value as any)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400"
            >
              <option value={"1"}>1 min (demo)</option>
              <option value={"5"}>5 min</option>
              <option value={"10"}>10 min</option>
              <option value={"25"}>25 min</option>
              <option value={"custom"}>Custom…</option>
            </select>

            {breakPreset === "custom" && (
              <input
                type="number"
                min={1}
                step={1}
                value={customBreak}
                onChange={(e) => setCustomBreak(e.target.value)}
                placeholder="Enter minutes"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-500">
            Optional: upload an existing file
          </label>

          <input
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          {uploadedFile && (
            <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <span className="font-mono">
                Loaded: {uploadedFile.baseName}.{uploadedFile.extension}
              </span>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="text-slate-500 hover:text-slate-900 underline underline-offset-4"
              >
                Remove
              </button>
            </div>
          )}

          <p className="text-xs text-slate-400 italic">
            If provided, it will preload the editor.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-500">
            How many rounds?
          </label>
          <select
            value={sessionsPreset}
            onChange={(e) => setSessionsPreset(e.target.value as any)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400"
          >
            <option value={"1"}>1 Session</option>
            <option value={"2"}>2 Sessions</option>
            <option value={"3"}>3 Sessions</option>
            <option value={"custom"}>Custom…</option>
          </select>

          {sessionsPreset === "custom" && (
            <input
              type="number"
              min={1}
              step={1}
              value={customSessions}
              onChange={(e) => setCustomSessions(e.target.value)}
              placeholder="Enter number of sessions"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          )}
          <p className="text-xs text-slate-400 italic">
            Each session = Focus block + Break block
          </p>
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
