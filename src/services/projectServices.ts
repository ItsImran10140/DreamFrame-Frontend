import { apiGet, apiPost, apiPut, apiDelete } from "../apis/api";
import type { ProjectsResponse, Project } from "../types/SidebarTypes";

export const getProjects = async (
  page: number = 1,
  limit: number = 10
): Promise<ProjectsResponse> => {
  return apiGet<ProjectsResponse>("/manim/projects", { page, limit });
};

export const getProject = async (id: string): Promise<Project> => {
  return apiGet<Project>(`/manim/projects/${id}`);
};

export const createProject = async (
  data: Partial<Project>
): Promise<Project> => {
  return apiPost<Project>("/manim/projects", data);
};

export const updateProject = async (
  id: string,
  data: Partial<Project>
): Promise<Project> => {
  return apiPut<Project>(`/manim/projects/${id}`, data);
};

export const deleteProject = async (id: string): Promise<void> => {
  return apiDelete<void>(`/manim/projects/${id}`);
};
