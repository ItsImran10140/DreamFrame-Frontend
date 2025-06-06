/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../services/projectServices";
import type { Project, PaginationData } from "../types/SidebarTypes";

export const useSidebar = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchProjects = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects(page, limit);
      setProjects(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error("Failed to fetch projects:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      setLoading(true);
      const newProject = await createProject(projectData);
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err: any) {
      setError(err.message || "Failed to create project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    pagination,
    fetchProjects,
    createProject: handleCreateProject,
    deleteProject: handleDeleteProject,
  };
};
