/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

// Types
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  message: string;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface GoogleAuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  signUpNewUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  setGoogleAuth: (data: GoogleAuthResponse) => void;
  user: User | null;
  isAuthenticated: boolean;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
// const API_BASE_URL = "http://localhost:3000/api/manim";
const API_BASE_URL = "https://backendapi.dynamooai.org/api/manim";
const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
  USER: "user",
} as const;

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
        const userData = localStorage.getItem(TOKEN_KEYS.USER);

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Helper function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.USER);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Helper function to store auth data
  const storeAuthData = (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEYS.ACCESS, data.tokens.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, data.tokens.refreshToken);
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
  };

  // Helper function to store Google auth data
  const storeGoogleAuthData = (data: GoogleAuthResponse) => {
    localStorage.setItem(TOKEN_KEYS.ACCESS, data.token);
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
  };

  // Set Google authentication data
  const setGoogleAuth = (data: GoogleAuthResponse) => {
    storeGoogleAuthData(data);
  };

  // Sign up function
  const signUpNewUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.status === 201) {
        storeAuthData(response.data);
        return { success: true, data: response.data };
      }

      return { success: false, error: "Registration failed" };
    } catch (error: any) {
      console.error("Signup error:", error);

      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      } else if (error.request) {
        return {
          success: false,
          error: "Network error. Please check your connection.",
        };
      } else {
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        };
      }
    }
  };

  // Sign in function
  const signInUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.status === 200) {
        storeAuthData(response.data);
        return { success: true, data: response.data };
      }

      return { success: false, error: "Login failed" };
    } catch (error: any) {
      console.error("Signin error:", error);

      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      } else if (error.request) {
        return {
          success: false,
          error: "Network error. Please check your connection.",
        };
      } else {
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        };
      }
    }
  };

  // Sign out function
  const signOut = () => {
    clearAuthData();
  };

  const value: AuthContextType = {
    signUpNewUser,
    signInUser,
    setGoogleAuth,
    user,
    isAuthenticated,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

// Keep the old hook name for backward compatibility
export const UserAuth = useAuth;
