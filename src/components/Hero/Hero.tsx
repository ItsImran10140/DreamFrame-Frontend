import React, { useState } from "react";
import ProjectSidebar from "../SideBar/ProjectSidebar";
import FloatingBlobBackground from "../../UI/backgroundGradient";
import SettingsComponent from "../settings/Settings";
import ProjectWorkspace from "./ProjectWorkSpace";
import { useProject } from "../../hooks/useProject";
import { useProfileToggle } from "../../stores/store";

const Hero: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { fetchProject, resetProject } = useProject();
  const { setOpen, isOpen } = useProfileToggle();

  const handleSelectProject = (projectId: string) => {
    fetchProject(projectId);
  };

  const handleNewProject = () => {
    resetProject();
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <FloatingBlobBackground className="">
      <div
        className="h-screen flex flex-col md:flex-row bg-black text-gray-200 overflow-hidden"
        onClick={() => {
          if (isOpen) {
            setOpen(false);
          }
        }}
      >
        <div className="w-full md:w-auto">
          <ProjectSidebar
            onSelectProject={handleSelectProject}
            currentProjectId={null}
            onShowSettings={handleShowSettings}
            onNewProject={handleNewProject}
          />
        </div>

        {showSettings ? (
          <div className="w-full flex flex-col">
            <SettingsComponent onClose={handleCloseSettings} />
          </div>
        ) : (
          <ProjectWorkspace />
        )}
      </div>
    </FloatingBlobBackground>
  );
};

export default Hero;
