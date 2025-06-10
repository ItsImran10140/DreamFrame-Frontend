import React from "react";
import VideoPreview from "../VideoPreview/VideoPreview";
import CodeExplanation from "../Explanation/CodeExplanation";
import type { Project, Video } from "../../types/projects";

interface VideoSectionProps {
  project: Project | null;
  loading: boolean;
  error: string | null;
  generatingCode: boolean;
  runningCode: boolean;
  onSaveVideos: (editedVideos: Video[]) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  project,
  loading,
  error,
  generatingCode,
  runningCode,
  onSaveVideos,
}) => {
  return (
    <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
      <div className="p-2 md:p-4 h-full">
        <h2 className="text-base md:text-lg font-semibold text-gray-400 mb-2">
          Video Preview
        </h2>
        <div className="h-screen overflow-y-scroll no-scrollbar">
          <VideoPreview
            loading={loading}
            error={error}
            project={project}
            handleSaveVideos={onSaveVideos}
            generatingCode={generatingCode}
            runningCode={runningCode}
          />
          <CodeExplanation project={project} />
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
