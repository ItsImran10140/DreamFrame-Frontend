/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGet, apiPut } from "../apis/api";
import type { UserResponse } from "../types/SidebarTypes";

export const getUserProfile = async (): Promise<UserResponse> => {
  return apiGet<UserResponse>("/manim/profile");
};

export const updateUserProfile = async (data: any): Promise<UserResponse> => {
  return apiPut<UserResponse>("/manim/profile", data);
};
