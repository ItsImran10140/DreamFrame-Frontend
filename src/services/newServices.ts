/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGet, apiPut } from "../apis/api";
import type { Project } from "../types/projects";

export const getProject = async (projectId: string): Promise<Project> => {
  return apiGet<Project>(`/manim/project/${projectId}`);
};

export const updateProjectCode = async (
  projectId: string,
  code: string
): Promise<any> => {
  return apiPut<any>(`/manim/update/project/${projectId}`, { code });
};

export const updateProjectVideos = async (
  projectId: string,
  project: Project
): Promise<Project> => {
  return apiPut<Project>(`/manim/project/${projectId}`, project);
};

export const generateCode = async (prompt: string): Promise<Response> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch("http://localhost:3000/api/manim/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate code");
  }

  return response;
};
