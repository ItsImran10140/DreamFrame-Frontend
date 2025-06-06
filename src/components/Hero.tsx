/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import ProjectSidebar from "../components/SideBar/ProjectSidebar";
import FloatingBlobBackground from "../UI/backgroundGradient";
import CodeHeader from "./ProjectHeader/CodeHeader";
import CodeEditor from "./CodeEditor/CodeEditor";
import PromptInput from "./PromptInput/PromptInput";
import VideoPreview from "./VideoPreview/VideoPreview";
import CodeExplanation from "./Explanation/CodeExplanation";
import SettingsComponent from "./settings/Settings"; // You'll need to create this
import { useHero } from "../hooks/useNew";
import { useProfileToggle } from "../stores/store";

const Hero = () => {
  const {
    project,
    loading,
    generatingCode,
    runningCode,
    error,
    saveStatus,
    prompt,
    responseLog,
    logContainerRef,
    fetchProject,
    handleEditorDidMount,
    handleCodeChange,
    handleSaveCode,
    handleSaveVideos,
    handleSendPrompt,
    setPrompt,
  } = useHero();

  // State to control whether settings is shown
  const [showSettings, setShowSettings] = useState(false);

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
    <FloatingBlobBackground>
      <div
        className="h-screen flex flex-col md:flex-row bg-black text-gray-200 overflow-hidden"
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
            onShowSettings={handleShowSettings} // Pass the settings handler
          />
        </div>

        {/* Status message */}
        {saveStatus && (
          <div className="fixed top-4 right-4 bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            {saveStatus}
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden ">
          {/* Conditionally render either the main content or settings */}
          {showSettings ? (
            // Settings Component
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
