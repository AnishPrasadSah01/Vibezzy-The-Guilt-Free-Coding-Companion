import React from "react";

interface RestartConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDownload: () => void;
  onRestart: () => void;
}

const RestartConfirmModal: React.FC<RestartConfirmModalProps> = ({
  isOpen,
  onCancel,
  onDownload,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onCancel} />

      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800">
            Restart session?
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            This will reset the timer and start a new focus session.
          </p>
        </div>

        <div className="p-6 space-y-3">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            Your work is saved locally, but restart will not download a file. If
            you want a copy, click Download first.
          </div>

          <button
            type="button"
            onClick={onDownload}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl transition"
          >
            Download
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-2xl transition"
          >
            Restart (don’t download)
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-2xl border border-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestartConfirmModal;
