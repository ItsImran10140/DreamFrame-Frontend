// /* eslint-disable @typescript-eslint/no-unused-vars */

export type Video = {
  id: string;
  name?: string;
  url?: string;
  duration?: number;
  trimStart?: number;
  trimEnd?: number;
};

export const processVideosFromApi = (videos: Video[] = []): Video[] => {
  return videos.map((video, index) => ({
    ...video,
    url: video.url || `http://localhost:3000/api/manim/video/${video.id}`,
    name: video.name || `Video ${index + 1}`,
    trimStart: video.trimStart || 0,
    trimEnd: video.trimEnd || video.duration || 0,
  }));
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
