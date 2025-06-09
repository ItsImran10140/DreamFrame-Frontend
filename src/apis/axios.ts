/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// Create axios instance with base configuration
export const api = axios.create({
  // baseURL: "http://localhost:3000/api/manim",
  baseURL: "https://backendapi.dynamooai.org/api/manim",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(
            // "http://localhost:3000/api/manim/refresh",
            "https://backendapi.dynamooai.org/api/manim/refresh",
            { refreshToken }
          );

          if (response.data.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken);

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const googleAuth = (code: any) => api.get(`/google?code=${code}`);

export default api;
