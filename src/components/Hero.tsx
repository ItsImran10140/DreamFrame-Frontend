/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import VideoEditor from "./VideoEditor";
import ProjectSidebar from "./ProjectSidebar";
import { processVideosFromApi } from "../utils/VideoHelpers";
import { Editor } from "@monaco-editor/react";
import { Send, Play } from "lucide-react";
import MarkdownExplanation from "../utils/MarkDown";
import FloatingBlobBackground from "../UI/backgroundGradient";

type Video = {
  id: string;
  name: string;
  url: string;
  duration?: number;
  trimStart?: number;
  trimEnd?: number;
};

type Project = {
  code: string;
  videos: Video[];
  id: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  explanation?: string;
};

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

  // Function to fetch project by ID
  const fetchProject = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/manim/project/${projectId}`,
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
  function handleEditorDidMount(editor: any, monaco: any) {
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
        `http://localhost:3000/api/manim/update/project/${project.id}`,
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
        `http://localhost:3000/api/manim/project/${project.id}`,
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
      const response = await fetch("http://localhost:3000/api/manim/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt }),
      });

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

  return (
    <FloatingBlobBackground className="">
      <div className="h-screen flex flex-col  md:flex-row bg-zinc-950/40 text-gray-200 overflow-hidden ">
        {/* <div className="flex h-screen flex-col md:flex-row bg-zinc-200/60 text-gray-200 overflow-hidden border w-full absolute z-10"> */}
        {/* Sidebar */}
        <div className="w-full md:w-auto">
          <ProjectSidebar
            onSelectProject={handleSelectProject}
            currentProjectId={project?.id || null}
          />
        </div>
        {/* Status message */}
        {saveStatus && (
          <div className="fixed top-4 right-4 bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            {saveStatus}
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden ">
          {/* Code Editor Section */}
          <div className="w-full md:w-1/2 border-r border-zinc-700 flex flex-col">
            <div className="h-[70vh] md:h-[95%] p-2 md:p-4 md:pb-2 flex flex-col">
              {/* Editor Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="truncate w-[400px]">
                  <h2 className="text-base md:text-lg font-semibold text-zinc-400 truncate">
                    Dynamo {project && `- ${project.prompt}`}
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
                      <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-t-2 border-b-2 border-white"></div>
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

              {/* Monaco Editor or Response Log */}
              <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800  ">
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
            </div>

            {/* Input area for prompt */}
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
                    className={`w-full bg-zinc-900/20 border border-zinc-800 rounded-l-3xl px-3 md:px-4 py-1.5 text-gray-200 placeholder:text-gray-400 focus:outline-none text-sm md:text-md ${
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
                  className={`bg-zinc-800/40 hover:bg-zinc-800 cursor-pointer text-white px-3 md:px-4 py-[8px] md:py-[9px] rounded-r-3xl flex border-[0.75px] border-zinc-600 items-center justify-center transition-colors duration-200 ${
                    generatingCode || runningCode
                      ? "opacity-50 cursor-not-allowed"
                      : ""
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
          </div>

          {/* Video Editor Section */}
          <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
            <div className="p-2 md:p-4 h-full">
              <h2 className="text-base md:text-lg font-semibold text-gray-400 mb-2">
                Video Preview
              </h2>
              <div className="h-screen overflow-y-scroll no-scrollbar">
                {/* Video editor container */}
                <div className="bg-zinc-900/50 rounded-lg border-[0.75px] border-zinc-800 mb-2 pb-2 md:mb-3 flex-shrink-0 overflow-hidden mt-2">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-indigo-500 mb-2 md:mb-4"></div>
                        <p className="text-gray-400 text-sm">
                          Loading video editor...
                        </p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-red-400 flex flex-col items-center">
                        <span className="text-red-500 text-3xl md:text-5xl mb-2 md:mb-4">
                          !
                        </span>
                        <p className="text-sm text-center px-4">{error}</p>
                      </div>
                    </div>
                  ) : project?.videos && project.videos.length > 0 ? (
                    <VideoEditor
                      projectVideos={project.videos}
                      onSave={handleSaveVideos}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                      <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 md:p-12 text-center max-w-md">
                        <p className="text-zinc-400 mb-2 md:mb-3 text-sm">
                          No videos available
                        </p>
                        <p className="text-xs md:text-sm text-zinc-500">
                          {generatingCode || runningCode
                            ? "Generating video, please wait..."
                            : "Enter a prompt to generate a Manim animation"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Explanation section */}
                <div className="flex-grow overflow-hidden rounded-lg border border-zinc-700 ">
                  <div className="h-full overflow-y-auto">
                    <MarkdownExplanation explanation={project?.explanation} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FloatingBlobBackground>
  );
};

export default Hero;
