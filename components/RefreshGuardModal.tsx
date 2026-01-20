import React from "react";

interface RefreshGuardModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDownload: () => void;
  onSaveAndRefresh: () => void;
}

const RefreshGuardModal: React.FC<RefreshGuardModalProps> = ({
  isOpen,
  onCancel,
  onDownload,
  onSaveAndRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onCancel} />

      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800">Refresh options</h3>
          <p className="text-sm text-slate-500 mt-1">
            Your session is already being saved locally. Choose what to do next.
          </p>
        </div>

        <div className="p-6 space-y-3">
          <button
            type="button"
            onClick={onDownload}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl transition"
          >
            Download
          </button>

          <button
            type="button"
            onClick={onSaveAndRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl transition"
          >
            Save and refresh
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-2xl border border-slate-200 transition"
          >
            Cancel
          </button>

          <p className="text-xs text-slate-400 pt-2">
            Note: Browser refresh from the address bar may still show the
            default confirm dialog (browsers don’t allow custom buttons there).
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefreshGuardModal;
