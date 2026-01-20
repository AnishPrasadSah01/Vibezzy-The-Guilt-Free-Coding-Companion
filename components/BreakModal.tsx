import React, { useState } from "react";
import { PHYSICAL_ACTIVITIES, MENTAL_REFRESHERS, MEMES } from "../constants";

interface BreakModalProps {
  remainingSeconds: number;
  onFinished: () => void;
}

type BreakStage = "CHOOSE" | "ACTIVITY" | "MENTAL" | "MEME";

const BreakModal: React.FC<BreakModalProps> = ({
  remainingSeconds,
  onFinished,
}) => {
  const [stage, setStage] = useState<BreakStage>("CHOOSE");
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  const randomIndex = (size: number) => Math.floor(Math.random() * size);

  const nextContent = () => {
    if (stage === "ACTIVITY") {
      setCurrentContentIndex(randomIndex(PHYSICAL_ACTIVITIES.length));
      return;
    }
    if (stage === "MENTAL") {
      setCurrentContentIndex(randomIndex(MENTAL_REFRESHERS.length));
      return;
    }
    if (stage === "MEME") {
      setCurrentContentIndex(randomIndex(MEMES.length));
      return;
    }
  };

  const startStage = (newStage: BreakStage) => {
    setStage(newStage);
    const poolSize =
      newStage === "ACTIVITY"
        ? PHYSICAL_ACTIVITIES.length
        : newStage === "MENTAL"
          ? MENTAL_REFRESHERS.length
          : newStage === "MEME"
            ? MEMES.length
            : 0;
    if (poolSize > 0) setCurrentContentIndex(randomIndex(poolSize));
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col p-10 animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-800">Mindful Break</h2>
          <div className="px-6 py-2 bg-emerald-500 text-white rounded-full font-mono font-bold shadow-lg">
            {Math.floor(remainingSeconds / 60)}:
            {(remainingSeconds % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center min-h-[300px]">
          {stage === "CHOOSE" && (
            <div className="grid grid-cols-3 gap-6 w-full">
              <button
                onClick={() => startStage("ACTIVITY")}
                className="group flex flex-col items-center p-8 border-4 border-emerald-100 hover:border-emerald-400 rounded-3xl transition-all hover:scale-105 hover:bg-emerald-50"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition">
                  🏃‍♂️
                </div>
                <h3 className="text-xl font-bold text-slate-700">Body Move</h3>
                <p className="text-slate-400 text-sm mt-2 text-center">
                  Quick physical recharge for your energy
                </p>
              </button>

              <button
                onClick={() => startStage("MENTAL")}
                className="group flex flex-col items-center p-8 border-4 border-violet-100 hover:border-violet-400 rounded-3xl transition-all hover:scale-105 hover:bg-violet-50"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition">
                  🧠
                </div>
                <h3 className="text-xl font-bold text-slate-700">Mind Reset</h3>
                <p className="text-slate-400 text-sm mt-2 text-center">
                  Quick mental refresher prompts
                </p>
              </button>

              <button
                onClick={() => startStage("MEME")}
                className="group flex flex-col items-center p-8 border-4 border-blue-100 hover:border-blue-400 rounded-3xl transition-all hover:scale-105 hover:bg-blue-50"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition">
                  🎭
                </div>
                <h3 className="text-xl font-bold text-slate-700">Brain Fuel</h3>
                <p className="text-slate-400 text-sm mt-2 text-center">
                  Random coding memes to boost mood
                </p>
              </button>
            </div>
          )}

          {stage === "ACTIVITY" && (
            <div className="text-center animate-in slide-in-from-bottom duration-300">
              <div className="text-slate-800 text-3xl font-medium leading-relaxed max-w-md mx-auto italic">
                "{PHYSICAL_ACTIVITIES[currentContentIndex]}"
              </div>
            </div>
          )}

          {stage === "MENTAL" && (
            <div className="text-center animate-in slide-in-from-bottom duration-300">
              <div className="text-slate-800 text-3xl font-medium leading-relaxed max-w-md mx-auto italic">
                "{MENTAL_REFRESHERS[currentContentIndex]}"
              </div>
            </div>
          )}

          {stage === "MEME" && (
            <div className="w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
              <img
                src={MEMES[currentContentIndex]}
                alt="Coding Meme"
                className="max-h-[400px] rounded-2xl shadow-xl object-contain border-4 border-white"
              />
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-between items-center">
          {stage !== "CHOOSE" && (
            <button
              onClick={() => setStage("CHOOSE")}
              className="text-slate-400 hover:text-slate-600 font-bold px-4"
            >
              Back to options
            </button>
          )}

          {stage !== "CHOOSE" && (
            <div className="ml-auto flex items-center space-x-3">
              <button
                onClick={() => startStage("ACTIVITY")}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                  stage === "ACTIVITY"
                    ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                }`}
              >
                Body
              </button>
              <button
                onClick={() => startStage("MENTAL")}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                  stage === "MENTAL"
                    ? "bg-violet-100 border-violet-200 text-violet-800"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                }`}
              >
                Mind
              </button>
              <button
                onClick={() => startStage("MEME")}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                  stage === "MEME"
                    ? "bg-blue-100 border-blue-200 text-blue-800"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                }`}
              >
                Meme
              </button>

              <button
                onClick={nextContent}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition active:scale-95"
              >
                Next
              </button>

              <button
                onClick={onFinished}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition active:scale-95"
              >
                Done & Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakModal;
