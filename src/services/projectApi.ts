import axios from "axios";
import type { Project, Video } from "../types/projects";
import { processVideosFromApi } from "../utils/VideoHelpers";

const BASE_URL = "https://backendapi.dynamooai.org/api/manim";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const projectApi = {
  async fetchProject(projectId: string): Promise<Project> {
    const response = await axios.get(`${BASE_URL}/project/${projectId}`, {
      headers: getAuthHeaders(),
    });

    if (response.data?.videos) {
      response.data.videos = processVideosFromApi(response.data.videos);
    }

    return response.data;
  },

  async executeCode(projectId: string, code: string) {
    return await axios.put(
      `${BASE_URL}/update/project/${projectId}`,
      { code },
      { headers: getAuthHeaders() }
    );
  },

  async saveProjectVideos(projectId: string, videos: Video[]) {
    const currentProject = await this.fetchProject(projectId);

    const updatedProject = {
      ...currentProject,
      videos: videos.map((video) => ({
        ...video,
        url:
          currentProject.videos.find((v) => v.id === video.id)?.url ||
          video.url,
      })),
    };

    return await axios.put(`${BASE_URL}/project/${projectId}`, updatedProject, {
      headers: getAuthHeaders(),
    });
  },
};
