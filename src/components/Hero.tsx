/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import VideoEditor from "./VideoEditor";
import { processVideosFromApi } from "../utils/VideoHelpers";
import { Editor } from "@monaco-editor/react";
import { Send, Save } from "lucide-react";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/manim/project/95570fa0-6623-4f9f-9303-a0cd5270de95"
        );

        if (response.data?.videos) {
          response.data.videos = processVideosFromApi(response.data.videos);
        }
        setProject(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

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
      setSaveStatus("Saving code...");

      await axios.put(
        `http://localhost:3000/api/manim/project/${project.id}`,
        project
      );

      setSaveStatus("Code saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Failed to save code:", err);
      setSaveStatus("Failed to save code. Please try again.");
      setTimeout(() => setSaveStatus(null), 5000);
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
    if (!prompt.trim() || !project) return;

    try {
      setSaveStatus("Processing prompt...");

      // Here you would send the prompt to your API
      // For now just show an alert
      alert(`Sending prompt: ${prompt}`);

      setPrompt("");
      setSaveStatus("Prompt sent successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Failed to process prompt:", err);
      setSaveStatus("Failed to process prompt. Please try again.");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-gray-200 overflow-hidden">
      {/* Status message */}
      {saveStatus && (
        <div className="absolute top-4 right-4 bg-zinc-800 text-green-400 px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
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
                Dream Frames
              </h2>
              <button
                onClick={handleSaveCode}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors duration-200"
              >
                <Save size={16} />
                Save Code
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden rounded-lg border border-zinc-700 shadow-xl">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-500"></div>
                </div>
              ) : (
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={project?.code || ""}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    automaticLayout: true,
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
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
                  className="w-full bg-zinc-800 border border-zinc-600 focus:border-indigo-500 rounded-lg px-4 py-3 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="What you want to create today..."
                />
              </div>
              <button
                onClick={handleSendPrompt}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <Send size={18} />
                SEND
              </button>
            </div>
          </div>
        </div>

        {/* Video Editor Section */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 h-full mt-2">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">
              Video Preview
            </h2>
            <div className="h-[calc(80%-2rem)] bg-zinc-800 rounded-lg border border-zinc-700 overflow-auto">
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
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="border-2 border-dashed border-zinc-600 rounded-lg p-12 text-center max-w-md">
                    <p className="text-zinc-400 mb-3">No videos available</p>
                    <p className="text-sm text-zinc-500">
                      Add videos to your project to see them here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
