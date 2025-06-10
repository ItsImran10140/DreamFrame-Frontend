/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import ProjectSidebar from "./SideBar/ProjectSidebar";
import { processVideosFromApi } from "../utils/VideoHelpers";
import FloatingBlobBackground from "../UI/backgroundGradient";
import CodeHeader from "./ProjectHeader/CodeHeader";
import CodeEditor from "./CodeEditor/CodeEditor";
import PromptInput from "./PromptInput/PromptInput";
import VideoPreview from "./VideoPreview/VideoPreview";
import CodeExplanation from "./Explanation/CodeExplanation";
import type { Project, Video } from "../types/projects";
import { useProfileToggle } from "../stores/store";
import SettingsComponent from "./settings/Settings";

const Hero = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [jobId, setJobId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingCode, setGeneratingCode] = useState<boolean>(false);
  const [runningCode, setRunningCode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [responseLog, setResponseLog] = useState<string>("");
  const editorRef = useRef<any>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Function to fetch project by ID
  const fetchProject = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backendapi.dynamooai.org/api/manim/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data?.videos) {
        response.data.videos = processVideosFromApi(response.data.videos);
      }
      setProject(response.data);
      setError(null);

      // Update URL with the project ID for sharing or reloading
      const url = new URL(window.location.href);
      url.searchParams.set("projectId", projectId);
      window.history.pushState({}, "", url.toString());
    } catch (err) {
      console.error("Failed to fetch project:", err);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  // Function to reset all data for a new project
  const resetForNewProject = () => {
    // Reset all state variables to their initial values
    setProject(null);
    setJobId("");
    setLoading(false);
    setGeneratingCode(false);
    setRunningCode(false);
    setError(null);
    setSaveStatus(null);
    setPrompt("");
    setResponseLog("");

    // Clear the editor content if it exists
    if (editorRef.current) {
      editorRef.current.setValue("");
    }

    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete("projectId");
    window.history.pushState({}, "", url.toString());

    // Optional: Show a brief status message
    setSaveStatus("Ready for new project!");
    setTimeout(() => setSaveStatus(null), 2000);
  };

  // Initial load - can be removed or used with a default project ID
  useEffect(() => {
    // Only fetch if you have a default project or jobId from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdFromUrl = urlParams.get("projectId");

    if (projectIdFromUrl) {
      fetchProject(projectIdFromUrl);
    }
  }, []);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [responseLog]);

  // Handle editor mounting
  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;

    // Focus the editor when mounted
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && project) {
      setProject({ ...project, code: value });
    }
  };

  const handleSaveCode = async () => {
    if (!project) return;

    try {
      setSaveStatus("Saving code and running animation...");
      setRunningCode(true);
      setResponseLog("Starting code execution...\n");

      // Save the code - backend will automatically rerun it
      const response = await axios.put(
        `https://backendapi.dynamooai.org/api/manim/update/project/${project.id}`,
        { code: project.code },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Add the response to the log if available
      if (response?.data) {
        setResponseLog(
          (prev) => prev + JSON.stringify(response.data, null, 2) + "\n"
        );
      }

      // Wait a moment for the backend to process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Refresh the project to get updated videos
      await fetchProject(project.id);

      setSaveStatus("Code execution completed!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Failed to save or run code:", err);
      setSaveStatus(
        "Failed to save or run code. Please check console for errors."
      );
      setResponseLog(
        (prev) =>
          prev + "\nError: Failed to execute code. Please check your syntax.\n"
      );
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setRunningCode(false);
    }
  };

  const handleSaveVideos = async (editedVideos: Video[]) => {
    if (!project) return;

    try {
      setSaveStatus("Saving changes...");
      const updatedProject = {
        ...project,
        videos: editedVideos.map((video) => ({
          ...video,
          url: project.videos.find((v) => v.id === video.id)?.url || video.url,
        })),
      };

      await axios.put(
        `https://backendapi.dynamooai.org/api/manim/project/${project.id}`,
        updatedProject,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setProject(updatedProject);
      setSaveStatus("Changes saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Failed to save project:", err);
      setSaveStatus("Failed to save changes. Please try again.");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;

    try {
      setGeneratingCode(true);
      setResponseLog("");
      setSaveStatus("Processing prompt...");

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setSaveStatus("You must be logged in to generate code.");
        return;
      }

      // Make a request to generate Manim code with streaming response
      const response = await fetch(
        "https://backendapi.dynamooai.org/api/manim/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: prompt }),
        }
      );

      // Process the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let extractedJobId = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          setResponseLog((prev) => prev + text);

          // Extract job ID from the response
          const jobIdMatch = text.match(/Job ID: ([0-9a-f-]+)/);
          if (jobIdMatch && jobIdMatch[1]) {
            extractedJobId = jobIdMatch[1];
            setJobId(extractedJobId);
          }
        }
      }

      // Once the streaming is done and we have a job ID, fetch the project
      if (extractedJobId) {
        setSaveStatus("Generation complete! Loading project...");
        await fetchProject(extractedJobId);
        console.log(jobId);
        setSaveStatus("Project loaded successfully!");
      } else {
        setSaveStatus("Generation complete, but could not extract project ID");
      }

      setPrompt("");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Failed to process prompt:", err);
      setSaveStatus("Failed to process prompt. Please try again.");
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setGeneratingCode(false);
    }
  };

  // Handle selecting a project from the sidebar
  const handleSelectProject = (projectId: string) => {
    fetchProject(projectId);
  };

  // Function to toggle settings view
  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const { setOpen, isOpen } = useProfileToggle();

  return (
    <FloatingBlobBackground className="">
      <div
        className="h-screen flex flex-col md:flex-row bg-black text-gray-200 overflow-hidden "
        onClick={() => {
          if (isOpen) {
            setOpen(false);
          }
        }}
      >
        {/* Sidebar */}
        <div className="w-full md:w-auto">
          <ProjectSidebar
            onSelectProject={handleSelectProject}
            currentProjectId={project?.id || null}
            onShowSettings={handleShowSettings}
            onNewProject={resetForNewProject}
          />
        </div>
        {/* Status message */}
        {saveStatus && (
          <div className="fixed top-4 right-4 bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            {saveStatus}
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden ">
          {showSettings ? (
            //             // Settings Component
            <div className="w-full flex flex-col">
              <SettingsComponent onClose={handleCloseSettings} />
            </div>
          ) : (
            <>
              {/* Code Editor Section */}
              <div className="w-full md:w-1/2 border-r-[0.75px] border-zinc-700/40 flex flex-col">
                <div className="h-[70vh] md:h-[95%] p-2 md:p-4 md:pb-2 flex flex-col">
                  {/* Editor Header */}
                  <CodeHeader
                    project={project}
                    handleSaveCode={handleSaveCode}
                    generatingCode={generatingCode}
                    runningCode={runningCode}
                  />
                  {/* Monaco Editor or Response Log */}
                  <CodeEditor
                    loading={loading}
                    generatingCode={generatingCode}
                    runningCode={runningCode}
                    responseLog={responseLog}
                    project={project}
                    logContainerRef={logContainerRef}
                    handleCodeChange={handleCodeChange}
                    handleEditorDidMount={handleEditorDidMount}
                  />
                </div>
                {/* Input area for prompt */}
                <PromptInput
                  prompt={prompt}
                  setPrompt={setPrompt}
                  generatingCode={generatingCode}
                  runningCode={runningCode}
                  handleSendPrompt={handleSendPrompt}
                />
              </div>

              {/* Video Editor Section */}
              <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
                <div className="p-2 md:p-4 h-full">
                  <h2 className="text-base md:text-lg font-semibold text-gray-400 mb-2">
                    Video Preview
                  </h2>
                  <div className="h-screen overflow-y-scroll no-scrollbar">
                    {/* Video editor container */}
                    <VideoPreview
                      loading={loading}
                      error={error}
                      project={project}
                      handleSaveVideos={handleSaveVideos}
                      generatingCode={generatingCode}
                      runningCode={runningCode}
                    />
                    {/* Explanation section */}
                    <CodeExplanation project={project} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </FloatingBlobBackground>
  );
};

export default Hero;
