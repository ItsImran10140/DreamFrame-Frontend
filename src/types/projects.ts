/* eslint-disable @typescript-eslint/no-explicit-any */
export type Video = {
  id: string;
  name: string;
  url: string;
  duration?: number;
  trimStart?: number;
  trimEnd?: number;
};

export type Project = {
  code: string;
  videos: Video[];
  id: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  explanation?: string;
};

export type HeroState = {
  project: Project | null;
  jobId: string;
  loading: boolean;
  generatingCode: boolean;
  runningCode: boolean;
  error: string | null;
  saveStatus: string | null;
  prompt: string;
  responseLog: string;
};

export type ProjectResponse = {
  data: Project;
  videos?: any[];
};
