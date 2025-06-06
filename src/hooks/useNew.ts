/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import {
  getProject,
  updateProjectCode,
  updateProjectVideos,
  generateCode,
} from "../services/newServices";
import { processVideosFromApi } from "../utils/VideoHelpers";
import type { Video, HeroState } from "../types/projects";

export const useHero = () => {
  const [state, setState] = useState<HeroState>({
    project: null,
    jobId: "",
    loading: false,
    generatingCode: false,
    runningCode: false,
    error: null,
    saveStatus: null,
    prompt: "",
    responseLog: "",
  });

  const editorRef = useRef<any>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const updateState = (updates: Partial<HeroState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const fetchProject = async (projectId: string) => {
    try {
      updateState({ loading: true, error: null });

      const response = await getProject(projectId);

      if (response?.videos) {
        response.videos = processVideosFromApi(response.videos).map(
          (video: any) => ({
            ...video,
            name: video.name ?? "",
          })
        );
      }

      updateState({ project: response });

      // Update URL with the project ID for sharing or reloading
      const url = new URL(window.location.href);
      url.searchParams.set("projectId", projectId);
      window.history.pushState({}, "", url.toString());
    } catch (err: any) {
      console.error("Failed to fetch project:", err);
      updateState({ error: "Failed to load project data" });
    } finally {
      updateState({ loading: false });
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Focus the editor when mounted
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && state.project) {
      updateState({
        project: { ...state.project, code: value },
      });
    }
  };

  const handleSaveCode = async () => {
    if (!state.project) return;

    try {
      updateState({
        saveStatus: "Saving code and running animation...",
        runningCode: true,
        responseLog: "Starting code execution...\n",
      });

      // Save the code - backend will automatically rerun it
      const response = await updateProjectCode(
        state.project.id,
        state.project.code
      );

      // Add the response to the log if available
      if (response?.data) {
        updateState({
          responseLog:
            state.responseLog + JSON.stringify(response.data, null, 2) + "\n",
        });
      }

      // Wait a moment for the backend to process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Refresh the project to get updated videos
      await fetchProject(state.project.id);

      updateState({ saveStatus: "Code execution completed!" });
      setTimeout(() => updateState({ saveStatus: null }), 3000);
    } catch (err: any) {
      console.error("Failed to save or run code:", err);
      updateState({
        saveStatus:
          "Failed to save or run code. Please check console for errors.",
        responseLog:
          state.responseLog +
          "\nError: Failed to execute code. Please check your syntax.\n",
      });
      setTimeout(() => updateState({ saveStatus: null }), 5000);
    } finally {
      updateState({ runningCode: false });
    }
  };

  const handleSaveVideos = async (editedVideos: Video[]) => {
    if (!state.project) return;

    try {
      updateState({ saveStatus: "Saving changes..." });

      const updatedProject = {
        ...state.project,
        videos: editedVideos.map((video) => ({
          ...video,
          url:
            state.project!.videos.find((v: any) => v.id === video.id)?.url ||
            video.url,
        })),
      };

      await updateProjectVideos(state.project.id, updatedProject);

      updateState({
        project: updatedProject,
        saveStatus: "Changes saved successfully!",
      });
      setTimeout(() => updateState({ saveStatus: null }), 3000);
    } catch (err: any) {
      console.error("Failed to save project:", err);
      updateState({ saveStatus: "Failed to save changes. Please try again." });
      setTimeout(() => updateState({ saveStatus: null }), 5000);
    }
  };

  const handleSendPrompt = async () => {
    if (!state.prompt.trim()) return;

    try {
      updateState({
        generatingCode: true,
        responseLog: "",
        saveStatus: "Processing prompt...",
      });

      // Make a request to generate Manim code with streaming response
      const response = await generateCode(state.prompt);

      // Process the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let extractedJobId = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          updateState({ responseLog: state.responseLog + text });

          // Extract job ID from the response
          const jobIdMatch = text.match(/Job ID: ([0-9a-f-]+)/);
          if (jobIdMatch && jobIdMatch[1]) {
            extractedJobId = jobIdMatch[1];
            updateState({ jobId: extractedJobId });
          }
        }
      }

      // Once the streaming is done and we have a job ID, fetch the project
      if (extractedJobId) {
        updateState({ saveStatus: "Generation complete! Loading project..." });
        await fetchProject(extractedJobId);
        updateState({ saveStatus: "Project loaded successfully!" });
      } else {
        updateState({
          saveStatus: "Generation complete, but could not extract project ID",
        });
      }

      updateState({ prompt: "" });
      setTimeout(() => updateState({ saveStatus: null }), 3000);
    } catch (err: any) {
      console.error("Failed to process prompt:", err);
      updateState({
        saveStatus: "Failed to process prompt. Please try again.",
      });
      setTimeout(() => updateState({ saveStatus: null }), 5000);
    } finally {
      updateState({ generatingCode: false });
    }
  };

  const setPrompt = (prompt: string) => {
    updateState({ prompt });
  };

  return {
    ...state,
    editorRef,
    logContainerRef,
    fetchProject,
    handleEditorDidMount,
    handleCodeChange,
    handleSaveCode,
    handleSaveVideos,
    handleSendPrompt,
    setPrompt,
  };
};
