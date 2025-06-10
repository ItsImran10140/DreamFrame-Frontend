/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// const BASE_URL = "http://localhost:3000/api";
const BASE_URL = "https://backendapi.dynamooai.org/api";

const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return api;
};

const apiClient = createApiClient();

export const apiGet = async <T>(url: string, params?: any): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url, { params });
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.put(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url);
  return response.data;
};
