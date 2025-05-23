/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./superbaseClient";

interface AuthContextType {
  signUpNewUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: any }>;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: any }>;
  session: any;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<
    import("@supabase/supabase-js").Session | null
  >(null);

  // Sign up
  const signUpNewUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      username: username,
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error("Sign-in error:", error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // If no error, return success
      console.log("Sign-in success:", data);
      return { success: true, data }; // Return the user data
    } catch (err) {
      // Handle unexpected issues
      if (err instanceof Error) {
        console.error("Unexpected error during sign-in:", err.message);
      } else {
        console.error("Unexpected error during sign-in:", err);
      }
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange(
      (
        _event: import("@supabase/supabase-js").AuthChangeEvent,
        session: import("@supabase/supabase-js").Session | null
      ) => {
        setSession(session);
      }
    );
  }, []);

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signUpNewUser, signInUser, session, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
