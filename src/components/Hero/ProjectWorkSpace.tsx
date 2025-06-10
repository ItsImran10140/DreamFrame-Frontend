/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { useProject } from "../../hooks/useProject";
import { useCodeExecution } from "../../hooks/useCodeExecution";
import { usePromptGeneration } from "../../hooks/usePromptGeneration";
import { useStatusMessage } from "../../hooks/useStatusMessage";
import CodeSection from "../CodeEditor/CodeSection";
import VideoSection from "../VideoPreview/VideoSection";
import StatusMessage from "../StatusMessage/StatusMessage";
import type { Video } from "../../types/projects";
import { projectApi } from "../../services/projectApi";

const ProjectWorkspace: React.FC = () => {
  const { project, loading, error, fetchProject, updateProject } = useProject();
  const { runningCode, responseLog, editorRef, executeCode, appendToLog } =
    useCodeExecution();
  const { generatingCode, prompt, setPrompt, generateCode } =
    usePromptGeneration();
  const { message, showMessage } = useStatusMessage();

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [responseLog]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && project) {
      updateProject({ code: value });
    }
  };

  const handleSaveCode = async () => {
    if (!project) return;

    try {
      showMessage("Saving code and running animation...");
      await executeCode(project);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await fetchProject(project.id);
      showMessage("Code execution completed!");
    } catch (err) {
      showMessage(
        "Failed to save or run code. Please check console for errors.",
        5000
      );
    }
  };

  const handleSaveVideos = async (editedVideos: Video[]) => {
    if (!project) return;

    try {
      showMessage("Saving changes...");
      await projectApi.saveProjectVideos(project.id, editedVideos);

      const updatedProject = {
        ...project,
        videos: editedVideos.map((video) => ({
          ...video,
          url: project.videos.find((v) => v.id === video.id)?.url || video.url,
        })),
      };

      updateProject(updatedProject);
      showMessage("Changes saved successfully!");
    } catch (err) {
      console.error("Failed to save project:", err);
      showMessage("Failed to save changes. Please try again.", 5000);
    }
  };

  const handleSendPrompt = async () => {
    try {
      showMessage("Processing prompt...");

      const result = await generateCode(prompt);
      appendToLog(result?.fullResponse || "");

      if (result?.jobId) {
        showMessage("Generation complete! Loading project...");
        await fetchProject(result.jobId);
        showMessage("Project loaded successfully!");
      } else {
        showMessage("Generation complete, but could not extract project ID");
      }
    } catch (err: any) {
      showMessage("Failed to process prompt. Please try again.", 5000);
    }
  };

  return (
    <>
      <StatusMessage message={message} />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <CodeSection
          project={project}
          loading={loading}
          generatingCode={generatingCode}
          runningCode={runningCode}
          responseLog={responseLog}
          prompt={prompt}
          logContainerRef={logContainerRef}
          editorRef={editorRef}
          onCodeChange={handleCodeChange}
          onSaveCode={handleSaveCode}
          onEditorMount={handleEditorMount}
          onPromptChange={setPrompt}
          onSendPrompt={handleSendPrompt}
        />

        <VideoSection
          project={project}
          loading={loading}
          error={error}
          generatingCode={generatingCode}
          runningCode={runningCode}
          onSaveVideos={handleSaveVideos}
        />
      </div>
    </>
  );
};

export default ProjectWorkspace;
