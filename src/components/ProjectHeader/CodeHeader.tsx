/* eslint-disable @typescript-eslint/no-explicit-any */

import { Play } from "lucide-react";

const CodeHeader = ({
  project,
  handleSaveCode,
  generatingCode,
  runningCode,
}: any) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div className="truncate w-[400px]">
        <h2 className="text-base md:text-lg font-semibold text-zinc-400 truncate">
          {project && `- ${project.prompt}`}
        </h2>
      </div>
      <button
        onClick={handleSaveCode}
        disabled={!project || generatingCode || runningCode}
        className={`bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs md:text-sm px-2 md:px-4 py-1 md:py-1.5 rounded-md flex items-center gap-1 md:gap-2 transition-colors duration-200${
          !project || generatingCode || runningCode
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {runningCode ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-t-[0.75px] border-b-[0.75px] border-zinc-500"></div>
            <span className="hidden md:inline">Running...</span>
            <span className="inline md:hidden">Run...</span>
          </>
        ) : (
          <>
            <Play size={16} className="hidden md:inline" />
            <Play size={14} className="inline md:hidden" />
            <span className="hidden md:inline ">Save & Run</span>
            <span className="inline md:hidden">Run</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CodeHeader;
