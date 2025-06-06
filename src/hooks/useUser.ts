/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getUserProfile } from "../services/userServices";
import type { User } from "../types/SidebarTypes";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserProfile();
      setUser(response.user);
    } catch (err: any) {
      console.error("Failed to fetch user profile:", err);
      setError(err.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    user,
    loading,
    error,
    fetchUserProfile,
  };
};
