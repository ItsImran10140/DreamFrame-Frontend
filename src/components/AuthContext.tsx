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
  user: User | null;
  isAuthenticated: boolean;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const API_BASE_URL = "http://localhost:3000/api/manim";
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

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";
// import { supabase } from "./superbaseClient";

// interface AuthContextType {
//   signUpNewUser: (
//     email: string,
//     password: string
//   ) => Promise<{ success: boolean; data?: any; error?: any }>;
//   signInUser: (
//     email: string,
//     password: string
//   ) => Promise<{ success: boolean; data?: any; error?: any }>;
//   session: any;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
//   const [session, setSession] = useState<
//     import("@supabase/supabase-js").Session | null
//   >(null);

//   // Sign up
//   const signUpNewUser = async (email: string, password: string) => {
//     const { data, error } = await supabase.auth.signUp({
//       email: email.toLowerCase(),
//       password: password,
//     });

//     if (error) {
//       console.error("Error signing up: ", error);
//       return { success: false, error };
//     }

//     return { success: true, data };
//   };

//   // Sign in
//   const signInUser = async (email: string, password: string) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email.toLowerCase(),
//         password: password,
//       });

//       // Handle Supabase error explicitly
//       if (error) {
//         console.error("Sign-in error:", error.message); // Log the error for debugging
//         return { success: false, error: error.message }; // Return the error
//       }

//       // If no error, return success
//       console.log("Sign-in success:", data);
//       return { success: true, data }; // Return the user data
//     } catch (err) {
//       // Handle unexpected issues
//       if (err instanceof Error) {
//         console.error("Unexpected error during sign-in:", err.message);
//       } else {
//         console.error("Unexpected error during sign-in:", err);
//       }
//       return {
//         success: false,
//         error: "An unexpected error occurred. Please try again.",
//       };
//     }
//   };

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
//       setSession(data.session);
//     });

//     supabase.auth.onAuthStateChange(
//       (
//         _event: import("@supabase/supabase-js").AuthChangeEvent,
//         session: import("@supabase/supabase-js").Session | null
//       ) => {
//         setSession(session);
//       }
//     );
//   }, []);

//   // Sign out
//   async function signOut() {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Error signing out:", error);
//     }
//   }

//   return (
//     <AuthContext.Provider
//       value={{ signUpNewUser, signInUser, session, signOut }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const UserAuth = () => {
//   return useContext(AuthContext);
// };
