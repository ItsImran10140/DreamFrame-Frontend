import { useState, useEffect } from "react";
import type { Project } from "../types/projects";
import { projectApi } from "../services/projectApi";

export const useProject = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      const projectData = await projectApi.fetchProject(projectId);
      setProject(projectData);
      updateUrl(projectId);
    } catch (err) {
      console.error("Failed to fetch project:", err);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const updateUrl = (projectId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("projectId", projectId);
    window.history.pushState({}, "", url.toString());
  };

  const resetProject = () => {
    setProject(null);
    setError(null);
    clearUrl();
  };

  const clearUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("projectId");
    window.history.pushState({}, "", url.toString());
  };

  const updateProject = (updates: Partial<Project>) => {
    if (project) {
      setProject({ ...project, ...updates });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdFromUrl = urlParams.get("projectId");

    if (projectIdFromUrl) {
      fetchProject(projectIdFromUrl);
    }
  }, []);

  return {
    project,
    loading,
    error,
    fetchProject,
    resetProject,
    updateProject,
  };
};
