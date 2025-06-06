/* eslint-disable @typescript-eslint/no-explicit-any */
import { Send } from "lucide-react";

const PromptInput = ({
  prompt,
  setPrompt,
  generatingCode,
  runningCode,
  handleSendPrompt,
}: any) => {
  return (
    <div className="p-2 md:p-4 md:pt-2">
      <div className="flex items-center">
        <div className="relative flex-1">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !generatingCode &&
              !runningCode &&
              handleSendPrompt()
            }
            disabled={generatingCode || runningCode}
            className={`w-full bg-zinc-900/20 border-[0.75px] border-zinc-800/40 rounded-l-3xl px-3 md:px-4 py-1.5 text-gray-200 placeholder:text-gray-400 focus:outline-none text-sm md:text-md ${
              generatingCode || runningCode
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            placeholder="What you want to create today..."
          />
        </div>
        <button
          onClick={handleSendPrompt}
          disabled={generatingCode || runningCode}
          className={`bg-zinc-800/40 hover:bg-zinc-800 cursor-pointer text-white px-3 md:px-4 py-[8px] md:py-[9px] rounded-r-3xl flex border-[0.75px] border-zinc-800/40 items-center justify-center transition-colors duration-200 ${
            generatingCode || runningCode ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {generatingCode ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Send size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
