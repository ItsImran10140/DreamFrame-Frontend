/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

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
      name: "Video",
      trimStart: video.trimStart || 0,
      trimEnd: video.trimEnd || video.duration || 0,
    }));

    setVideos(processedVideos);
    console.log("====================================================");
    console.log("Processed Videos:", processedVideos);
    console.log("====================================================");
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

  return (
    <div className={`flex flex-col h-full`}>
      {/* Timeline Section */}
      <div className="p-2  border-t border-zinc-950">
        <div className="flex justify-between mb-1 "></div>
        <div className="flex-1 flex justify-center  items-center p-2 bg-black">
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
        <div className="p-2 bg-zinc-950  flex items-center gap-2 mx-2">
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
