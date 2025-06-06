/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@monaco-editor/react";

const CodeEditor = ({
  loading,
  generatingCode,
  runningCode,
  responseLog,
  project,
  logContainerRef,
  handleCodeChange,
  handleEditorDidMount,
}: any) => {
  return (
    <div className="flex-1 overflow-hidden rounded-lg border-[0.75px] border-zinc-800/50  ">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-500"></div>
        </div>
      ) : generatingCode || runningCode ? (
        <div
          ref={logContainerRef}
          className="h-full bg-zinc-950 text-zinc-400 font-mono text-xs md:text-sm p-2 md:p-4 overflow-auto whitespace-pre-wrap "
        >
          {responseLog || "Waiting for response..."}
        </div>
      ) : (
        <Editor
          height="100%"
          width={"101%"}
          defaultLanguage="python"
          value={project?.code || ""}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="hc-black"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            automaticLayout: true,
            renderLineHighlight: "none",
            wordWrap: "on",
            padding: { top: 12 },
            lineNumbers: "on",
            roundedSelection: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
          }}
        />
      )}
    </div>
  );
};

export default CodeEditor;
