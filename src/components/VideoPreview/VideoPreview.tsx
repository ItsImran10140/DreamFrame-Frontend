import VideoEditor from "./VideoEditor";

/* eslint-disable @typescript-eslint/no-explicit-any */
const VideoPreview = ({
  loading,
  error,
  project,
  handleSaveVideos,
  generatingCode,
  runningCode,
}: any) => {
  return (
    <div className="bg-zinc-800/40 rounded-lg border-[0.75px] border-zinc-800/40 mb-2 pb-2 md:mb-3 flex-shrink-0 overflow-hidden mt-2">
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-zinc-500 mb-2 md:mb-4"></div>
            <p className="text-gray-400 text-sm">Loading video editor...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-red-400 flex flex-col items-center">
            <p className="text-sm text-center px-4">{error}</p>
          </div>
        </div>
      ) : project?.videos && project.videos.length > 0 ? (
        <VideoEditor projectVideos={project.videos} onSave={handleSaveVideos} />
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
  );
};

export default VideoPreview;
