/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download } from "lucide-react";

type VideoType = {
  id: string;
  name: string;
  url: string;
  duration?: number;
  trimStart?: number;
  trimEnd?: number;
};

type VideoEditorProps = {
  projectVideos: VideoType[];
  onSave?: (editedVideos: VideoType[]) => void;
};

const VideoEditor = ({ projectVideos = [] }: VideoEditorProps) => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playMode, setPlayMode] = useState<"single" | "all">("single");

  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processedVideos = projectVideos.map((video, index) => ({
      ...video,
      id: video.id || `video-${index}`,
      name: video.name || "Video",
      trimStart: video.trimStart || 0,
      trimEnd: video.trimEnd || video.duration || 0,
    }));

    setVideos(processedVideos);
    console.log("Processed Videos:", processedVideos);
    if (processedVideos.length > 0) {
      setSelectedVideo(processedVideos[0].id);
    }
  }, [projectVideos]);

  const handleLoadedMetadata = (id: string, duration: number) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, duration } : v)));
  };

  const handleVideoEnd = () => {
    if (playMode === "all") {
      const currentIndex = videos.findIndex((v) => v.id === selectedVideo);

      if (currentIndex < videos.length - 1) {
        const nextVideo = videos[currentIndex + 1];
        setSelectedVideo(nextVideo.id);

        if (videoRef.current) {
          videoRef.current.src = nextVideo.url;
          videoRef.current.play().catch(console.error);
        }
      } else {
        setIsPlaying(false);
        setCurrentTime(videos.reduce((acc, v) => acc + (v.duration || 0), 0));
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current || !selectedVideo) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const getVideoMimeTypeAndExtension = async (
    url: string
  ): Promise<{ mimeType: string; extension: string }> => {
    try {
      const headResponse = await fetch(url, { method: "HEAD" });
      const contentType = headResponse.headers.get("content-type");

      if (contentType) {
        const mimeToExtension: Record<string, string> = {
          "video/mp4": "mp4",
          "video/webm": "webm",
          "video/ogg": "ogg",
          "video/avi": "avi",
          "video/mov": "mov",
          "video/quicktime": "mov",
          "video/x-msvideo": "avi",
        };

        const extension = mimeToExtension[contentType] || "mp4";
        return { mimeType: contentType, extension };
      }
    } catch (error) {
      console.warn("Could not determine content type from headers:", error);
    }

    try {
      const urlPath = url.split("?")[0];
      const pathExtension = urlPath.split(".").pop()?.toLowerCase();

      if (
        pathExtension &&
        ["mp4", "webm", "ogg", "avi", "mov"].includes(pathExtension)
      ) {
        return {
          mimeType: `video/${
            pathExtension === "mov" ? "quicktime" : pathExtension
          }`,
          extension: pathExtension,
        };
      }
    } catch (error) {
      console.warn("Could not extract extension from URL:", error);
    }

    return { mimeType: "video/mp4", extension: "mp4" };
  };

  const handleDownload = async () => {
    if (!selectedVideo) return;

    const currentVideo = videos.find((v) => v.id === selectedVideo);
    if (!currentVideo) return;

    try {
      const { mimeType, extension } = await getVideoMimeTypeAndExtension(
        currentVideo.url
      );

      const response = await fetch(currentVideo.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const typedBlob = new Blob([blob], { type: mimeType });

      const url = window.URL.createObjectURL(typedBlob);
      const link = document.createElement("a");
      link.href = url;

      const cleanName =
        currentVideo.name.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim() || "video";
      link.download = `${cleanName}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      console.log(`Downloaded: ${cleanName}.${extension}`);
    } catch (error) {
      console.error("Error downloading video:", error);

      try {
        const { extension } = await getVideoMimeTypeAndExtension(
          currentVideo.url
        );
        const cleanName =
          currentVideo.name.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim() || "video";

        const tempLink = document.createElement("a");
        tempLink.href = currentVideo.url;
        tempLink.download = `${cleanName}.${extension}`;
        tempLink.target = "_blank";
        tempLink.rel = "noopener noreferrer";

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        window.open(currentVideo.url, "_blank");
      }
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || videos.length === 0) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const totalDuration = videos.reduce((acc, v) => acc + (v.duration || 0), 0);
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * totalDuration;

    let cumulative = 0;
    for (const video of videos) {
      const videoDuration = video.duration || 0;
      if (newTime <= cumulative + videoDuration) {
        setSelectedVideo(video.id);
        setCurrentTime(newTime);
        setPlayMode("single");

        if (videoRef.current) {
          const videoTime = newTime - cumulative;
          videoRef.current.currentTime = Math.min(videoTime, videoDuration);
          if (isPlaying) videoRef.current.play();
        }
        break;
      }
      cumulative += videoDuration;
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !selectedVideo) return;

    const currentVideo = videos.find((v) => v.id === selectedVideo);
    if (!currentVideo) return;

    const videoIndex = videos.findIndex((v) => v.id === selectedVideo);
    const previousVideosDuration = videos
      .slice(0, videoIndex)
      .reduce((acc, v) => acc + (v.duration || 0), 0);

    const currentVideoTime = videoRef.current.currentTime;
    const globalTime = previousVideosDuration + currentVideoTime;

    setCurrentTime(globalTime);
  };

  const currentVideoData = videos.find((v) => v.id === selectedVideo);

  return (
    <div className={`flex flex-col h-full`}>
      {/* Timeline Section */}
      <div className="p-2 border-t border-zinc-950">
        <div className="flex justify-between mb-1">
          {/* Video title and download button */}
          <div className="flex items-center gap-2">
            {currentVideoData && (
              <>
                <span className="text-sm text-gray-300">
                  {currentVideoData.name}
                </span>
                <button
                  onClick={handleDownload}
                  className="p-1 rounded-full hover:bg-zinc-700 text-gray-300 hover:text-white transition-colors"
                  title="Download current video"
                  disabled={!selectedVideo}
                >
                  <Download size={16} />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center p-2 bg-black">
          {selectedVideo ? (
            <video
              ref={videoRef}
              src={videos.find((v) => v.id === selectedVideo)?.url}
              className="max-h-full max-w-full"
              onLoadedMetadata={(e) => {
                const video = videos.find((v) => v.id === selectedVideo);
                video &&
                  handleLoadedMetadata(video.id, e.currentTarget.duration);
              }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="text-gray-400 text-sm">No video selected</div>
          )}
        </div>
      </div>

      {/* Video Player Section */}
      <div className="flex-1 flex flex-col">
        {/* Controls */}
        <div className="p-2 bg-zinc-950 flex items-center gap-2 mx-2">
          <div className="flex gap-1">
            <button
              onClick={togglePlay}
              className="p-1 rounded-full hover:bg-zinc-700"
              disabled={!selectedVideo}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
          <div
            ref={timelineRef}
            className="flex-1 h-2 bg-zinc-700 rounded overflow-hidden cursor-pointer"
            onClick={handleTimelineClick}
          >
            <div
              className="bg-zinc-600 h-full transition-all duration-100"
              style={{
                width: `${
                  (currentTime /
                    videos.reduce((acc, v) => acc + (v.duration || 0), 0)) *
                  100
                }%`,
              }}
            />
          </div>
          <div className="text-xs">
            {formatTime(currentTime)} /{" "}
            {formatTime(videos.reduce((acc, v) => acc + (v.duration || 0), 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default VideoEditor;
