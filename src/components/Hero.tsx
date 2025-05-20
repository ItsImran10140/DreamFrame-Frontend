/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @typescript-eslint/no-unused-expressions */
// // /* eslint-disable @typescript-eslint/no-unused-vars */

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import VideoEditor from "./VideoEditor";
import ProjectSidebar from "./ProjectSidebar";
import { processVideosFromApi } from "../utils/VideoHelpers";
import { Editor } from "@monaco-editor/react";
import { Send, Play } from "lucide-react";

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
};

const Hero = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [, setJobId] = useState<string>("");
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
        `http://localhost:3000/api/manim/project/${projectId}`
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
      // Properly format the data as expected by the API
      const response = await axios.put(
        `http://localhost:3000/api/manim/update/project/${project.id}`,
        { code: project.code },
        {
          headers: {
            "Content-Type": "application/json",
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
        updatedProject
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

      // Make a request to generate Manim code with streaming response
      const response = await fetch("http://localhost:3000/api/manim/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <div className="h-screen flex bg-zinc-950 text-gray-200 overflow-hidden">
      {/* Sidebar */}
      <ProjectSidebar
        onSelectProject={handleSelectProject}
        currentProjectId={project?.id || null}
      />

      {/* Status message */}
      {saveStatus && (
        <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
          {saveStatus}
        </div>
      )}

      <div className="flex flex-1">
        {/* Code Editor Section */}
        <div className="w-1/2 border-r border-zinc-700 flex flex-col">
          <div className="h-[85%] p-4 pb-2 flex flex-col">
            {/* Editor Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-200">
                Dream Frames {project && `- ${project.prompt}`}
              </h2>
              <button
                onClick={handleSaveCode}
                disabled={!project || generatingCode || runningCode}
                className={`bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-sm px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors duration-200 ${
                  !project || generatingCode || runningCode
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {runningCode ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Save & Run
                  </>
                )}
              </button>
            </div>

            {/* Monaco Editor or Response Log */}
            <div className="flex-1 overflow-hidden rounded-lg border border-zinc-900 shadow-2xl">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-500"></div>
                </div>
              ) : generatingCode || runningCode ? (
                <div
                  ref={logContainerRef}
                  className="h-full bg-zinc-950 text-zinc-400 font-mono text-sm p-4 overflow-auto whitespace-pre-wrap"
                >
                  {responseLog || "Waiting for response..."}
                </div>
              ) : (
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={project?.code || ""}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  theme="hc-black"
                  options={{
                    minimap: { enabled: true },
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
          <div className="p-4 pt-2">
            <div className="flex items-center ">
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
                  className={`w-full bg-zinc-900 border border-zinc-800  rounded-l-3xl px-4 py-1 text-gray-200 placeholder:text-gray-400 focus:outline-none text-md  ${
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
                className={`bg-zinc-800 hover:bg-zinc-900 cursor-pointer text-white px-4  py-[10px] rounded-r-3xl flex items-center  gap-2 transition-colors duration-200 ${
                  generatingCode || runningCode
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {generatingCode ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Send className="mr-2" size={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Video Editor Section */}
        <div className="w-1/2 flex flex-col ">
          <div className="p-4 h-full mt-2 ">
            <h2 className="text-lg font-semibold text-gray-200 mb-2 ">
              Video Preview
            </h2>
            <div className="border border-red-400 h-screen overflow-y-scroll">
              <div className="b-2 bg-zinc-900/50 rounded-lg border border-zinc-400 pb-3">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                      <p className="text-gray-400">Loading video editor...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-400 flex flex-col items-center">
                      <span className="text-red-500 text-5xl mb-4">!</span>
                      <p>{error}</p>
                    </div>
                  </div>
                ) : project?.videos && project.videos.length > 0 ? (
                  <VideoEditor
                    projectVideos={project.videos}
                    onSave={handleSaveVideos}
                  />
                ) : (
                  <div className="flex flex-col  items-center justify-center h-[75vh]">
                    <div className="border-2 border-dashed border-zinc-600 rounded-lg p-12 text-center max-w-md">
                      <p className="text-zinc-400 mb-3">No videos available</p>
                      <p className="text-sm text-zinc-500">
                        {generatingCode || runningCode
                          ? "Generating video, please wait..."
                          : "Enter a prompt to generate a Manim animation"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="border mt-2 rounded-lg">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Dignissimos non, excepturi praesentium explicabo veniam dolore
                  ipsa magni sunt sed similique, ab soluta, nam sapiente fugit
                  error tempore maxime sit quibusdam fuga omnis ullam recusandae
                  quia voluptates doloribus? Labore nihil error tenetur cum!
                  Autem quis, earum quaerat reiciendis enim deserunt modi!
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Debitis nihil fugit ex laborum accusantium minima expedita sit
                  animi nisi hic sed id reiciendis nostrum quibusdam illo nobis
                  aut amet soluta a voluptas, dolores inventore. Dolorum eveniet
                  sunt nostrum ut laudantium velit. Nisi id nulla, ut esse vel
                  fugiat voluptates velit cum, illo a deserunt sed, sunt ipsam
                  voluptate rerum? Temporibus? Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Distinctio voluptatum sed
                  voluptatem corrupti architecto. Quae nihil deleniti odit vel
                  praesentium natus deserunt. Eius, qui provident? Corporis
                  suscipit similique dolorum libero, nemo quo iste ab mollitia!
                  Totam consequatur amet, dolore voluptatem alias ex commodi
                  impedit minima perspiciatis aliquam dolorum provident facilis
                  recusandae modi id laborum soluta enim nostrum! Non ut eaque,
                  dolore reprehenderit distinctio soluta aliquid natus repellat
                  similique impedit repellendus molestiae, blanditiis
                  perferendis fugiat, quis recusandae harum! Itaque, quo iusto?
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Illum ullam in qui odit necessitatibus ipsam minima deleniti
                  velit, distinctio commodi aut unde quis suscipit perspiciatis
                  laborum aspernatur sequi nostrum. Quaerat totam earum possimus
                  molestias dolorem, omnis praesentium est ipsam quidem magni
                  doloribus aut minima repellendus itaque iste placeat at
                  tempore deserunt. Iure fugit, maiores obcaecati omnis
                  praesentium nulla dolorum incidunt quae. Voluptate praesentium
                  magni corporis similique dignissimos, nisi recusandae et.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
