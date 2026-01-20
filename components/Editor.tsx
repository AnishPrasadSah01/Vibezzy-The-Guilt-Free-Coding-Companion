import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  fileBaseName: string;
  onFileBaseNameChange: (name: string) => void;
  fileExtension: "txt" | "md";
  onFileExtensionChange: (ext: "txt" | "md") => void;
  onDownload: () => void;
  onOpenRefreshMenu: () => void;
  onRestart: () => void;
}

type EditorViewMode = "EDIT" | "SPLIT" | "PREVIEW";

const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  disabled,
  fileBaseName,
  onFileBaseNameChange,
  fileExtension,
  onFileExtensionChange,
  onDownload,
  onOpenRefreshMenu,
  onRestart,
}) => {
  const [viewMode, setViewMode] = useState<EditorViewMode>("EDIT");

  const canPreview = fileExtension === "md";

  // If user switches to .txt, force edit-only mode.
  useEffect(() => {
    if (!canPreview && viewMode !== "EDIT") setViewMode("EDIT");
  }, [canPreview, viewMode]);

  const markdownComponents = useMemo(() => {
    return {
      h1: (props: any) => (
        <h1 className="text-3xl font-bold mt-0 mb-4" {...props} />
      ),
      h2: (props: any) => (
        <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
      ),
      h3: (props: any) => (
        <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />
      ),
      p: (props: any) => <p className="my-3 leading-relaxed" {...props} />,
      a: (props: any) => (
        <a
          className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
          target="_blank"
          rel="noreferrer"
          {...props}
        />
      ),
      ul: (props: any) => <ul className="list-disc pl-6 my-3" {...props} />,
      ol: (props: any) => <ol className="list-decimal pl-6 my-3" {...props} />,
      li: (props: any) => <li className="my-1" {...props} />,
      blockquote: (props: any) => (
        <blockquote
          className="border-l-4 border-slate-200 pl-4 italic text-slate-600 my-4"
          {...props}
        />
      ),
      hr: (props: any) => <hr className="my-6 border-slate-200" {...props} />,
      code: ({ inline, className, children, ...props }: any) => {
        if (inline) {
          return (
            <code
              className="font-mono text-sm bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded"
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <code className={`font-mono text-sm ${className || ""}`} {...props}>
            {children}
          </code>
        );
      },
      pre: (props: any) => (
        <pre
          className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-auto my-4"
          {...props}
        />
      ),
      table: (props: any) => (
        <div className="overflow-auto my-4">
          <table
            className="min-w-full text-sm border border-slate-200"
            {...props}
          />
        </div>
      ),
      th: (props: any) => (
        <th
          className="text-left bg-slate-50 border border-slate-200 px-3 py-2 font-semibold"
          {...props}
        />
      ),
      td: (props: any) => (
        <td className="border border-slate-200 px-3 py-2" {...props} />
      ),
    };
  }, []);

  return (
    <div
      className={`h-full flex flex-col transition-colors duration-500 ${disabled ? "bg-slate-100 opacity-70" : "bg-white"}`}
    >
      <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="ml-4 font-mono text-sm text-slate-400">
            {disabled ? (
              `${fileBaseName}.${fileExtension}`
            ) : (
              <span className="inline-flex items-center space-x-1">
                <input
                  value={fileBaseName}
                  onChange={(e) => onFileBaseNameChange(e.target.value)}
                  className="w-72 max-w-[45vw] font-mono text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="File name"
                />
                <select
                  value={fileExtension}
                  onChange={(e) => {
                    const next = e.target.value === "txt" ? "txt" : "md";
                    onFileExtensionChange(next);
                    if (next === "txt") setShowPreview(false);
                  }}
                  className="text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="File extension"
                >
                  <option value="txt">.txt</option>
                  <option value="md">.md</option>
                </select>
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {canPreview && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setViewMode("EDIT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  viewMode === "EDIT"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setViewMode("SPLIT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  viewMode === "SPLIT"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode("PREVIEW")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  viewMode === "PREVIEW"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Preview
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
            >
              Download
            </button>
            <button
              type="button"
              onClick={onOpenRefreshMenu}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
            >
              Restart
            </button>
          </div>

          {disabled && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>BREAK MODE ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow min-h-0 flex">
        {(viewMode === "EDIT" || viewMode === "SPLIT" || !canPreview) && (
          <div
            className={`${viewMode === "SPLIT" && canPreview ? "w-1/2 border-r border-slate-200" : "w-full"} h-full`}
          >
            <textarea
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={
                disabled
                  ? "Resting time... Take a deep breath."
                  : fileExtension === "md"
                    ? "Write Markdown here… e.g. **bold**, # headings, - lists"
                    : "Write plain text here…"
              }
              className="h-full w-full p-8 font-mono text-lg outline-none resize-none bg-transparent placeholder-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-200"
            />
          </div>
        )}

        {canPreview && (viewMode === "PREVIEW" || viewMode === "SPLIT") && (
          <div
            className={`${viewMode === "SPLIT" ? "w-1/2" : "w-full"} h-full overflow-auto p-8 bg-white scrollbar-thin scrollbar-thumb-slate-200`}
          >
            {value.trim().length === 0 ? (
              <div className="text-slate-400">
                Markdown preview will appear here.
              </div>
            ) : (
              <div className="text-slate-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {value}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
