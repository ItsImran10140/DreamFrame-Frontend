/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import CodeHeader from "../ProjectHeader/CodeHeader";
import CodeEditor from "../CodeEditor/CodeEditor";
import PromptInput from "../PromptInput/PromptInput";
import type { Project } from "../../types/projects";

interface CodeSectionProps {
  project: Project | null;
  loading: boolean;
  generatingCode: boolean;
  runningCode: boolean;
  responseLog: string;
  prompt: string;
  logContainerRef: React.RefObject<HTMLDivElement>;
  editorRef: React.RefObject<any>;
  onCodeChange: (value: string | undefined) => void;
  onSaveCode: () => void;
  onEditorMount: (editor: any) => void;
  onPromptChange: (value: string) => void;
  onSendPrompt: () => void;
}

const CodeSection: React.FC<CodeSectionProps> = ({
  project,
  loading,
  generatingCode,
  runningCode,
  responseLog,
  prompt,
  logContainerRef,
  onCodeChange,
  onSaveCode,
  onEditorMount,
  onPromptChange,
  onSendPrompt,
}) => {
  return (
    <div className="w-full md:w-1/2 border-r-[0.75px] border-zinc-700/40 flex flex-col">
      <div className="h-[70vh] md:h-[95%] p-2 md:p-4 md:pb-2 flex flex-col">
        <CodeHeader
          project={project}
          handleSaveCode={onSaveCode}
          generatingCode={generatingCode}
          runningCode={runningCode}
        />

        <CodeEditor
          loading={loading}
          generatingCode={generatingCode}
          runningCode={runningCode}
          responseLog={responseLog}
          project={project}
          logContainerRef={logContainerRef}
          handleCodeChange={onCodeChange}
          handleEditorDidMount={onEditorMount}
        />
      </div>

      <PromptInput
        prompt={prompt}
        setPrompt={onPromptChange}
        generatingCode={generatingCode}
        runningCode={runningCode}
        handleSendPrompt={onSendPrompt}
      />
    </div>
  );
};

export default CodeSection;
