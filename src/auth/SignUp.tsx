// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link, useNavigate } from "react-router-dom";
import StarBorder from "../UI/border";
import SpotlightCard from "../UI/Card";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../apis/axios";
import { ArrowLeft } from "lucide-react";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/\d/.test(password)) errors.push("One number");
  return errors;
};

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { isAuthenticated, signUpNewUser, setGoogleAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/new", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (error) setError("");
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.username.trim()) {
      errors.push("Username is required");
    } else if (formData.username.trim().length < 2) {
      errors.push("Username must be at least 2 characters");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!validateEmail(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.password) {
      errors.push("Password is required");
    } else {
      const passwordErrors = validatePassword(formData.password);
      errors.push(...passwordErrors.map((err) => `Password must have: ${err}`));
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signUpNewUser(
        formData.username,
        formData.email,
        formData.password
      );

      if (result.success) {
        navigate("/new", { replace: true });
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    setError("");

    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        const token = result.data.token;
        const user = result.data.user;

        setGoogleAuth({ token, user });

        navigate("/new", { replace: true });
      }
    } catch (error: any) {
      console.error("Error while requesting google code", error);
      setError("Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleSignUp = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google login error:", error);
      setError("Google authentication failed. Please try again.");
    },
    flow: "auth-code",
  });

  const renderValidationErrors = () => {
    if (validationErrors.length === 0) return null;

    return (
      <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
        <ul className="list-disc list-inside space-y-1">
          {validationErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-20 flex flex-col bg-[#0C0C0C]/95 items-center justify-center min-h-screen text-white">
        <div className="absolute top-0 px-4 w-full py-4">
          <ArrowLeft
            className="hover:bg-zinc-700/60 h-8 w-8 rounded-full p-[6px] cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <form onSubmit={handleSignup} noValidate>
          <SpotlightCard
            className="custom-spotlight-card w-[500px] h-full"
            spotlightColor="rgba(255, 255, 255, 0.25)"
          >
            <div className="">
              <div className="flex justify-center mb-10">
                <h1 className="text-3xl font-semibold">Sign Up</h1>
              </div>

              {/* Validation Errors */}
              {renderValidationErrors()}

              {/* API Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <StarBorder
                  as="div"
                  className="w-full"
                  color="white"
                  speed="5s"
                >
                  <input
                    onChange={handleInputChange("username")}
                    value={formData.username}
                    type="text"
                    placeholder="Username"
                    required
                    minLength={2}
                    maxLength={50}
                    className="w-full h-10 rounded-xl bg-transparent px-3 outline-none placeholder-gray-400"
                    disabled={loading}
                  />
                </StarBorder>

                <StarBorder
                  as="div"
                  className="w-full"
                  color="white"
                  speed="5s"
                >
                  <input
                    onChange={handleInputChange("email")}
                    value={formData.email}
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full h-10 rounded-xl bg-transparent px-3 outline-none placeholder-gray-400"
                    disabled={loading}
                  />
                </StarBorder>

                <StarBorder
                  as="div"
                  className="w-full"
                  color="white"
                  speed="5s"
                >
                  <input
                    onChange={handleInputChange("password")}
                    value={formData.password}
                    type="password"
                    placeholder="Password"
                    required
                    minLength={8}
                    className="w-full h-10 rounded-xl bg-transparent px-3 outline-none placeholder-gray-400"
                    disabled={loading}
                  />
                </StarBorder>

                <div className="h-[0.75px] my-6 bg-zinc-400/10"></div>

                <button
                  type="submit"
                  disabled={loading}
                  className="border-[0.75px] border-neutral-700 w-full h-10 rounded-xl text-neutral-300 hover:text-neutral-100 hover:bg-neutral-300/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <div className="flex w-full justify-center items-center my-4">
                  <div className="h-[0.75px] bg-zinc-400/10 flex-1"></div>
                  <p className="mx-4 text-zinc-400/50 text-sm">Or</p>
                  <div className="h-[0.75px] bg-zinc-400/10 flex-1"></div>
                </div>

                <button
                  type="button"
                  onClick={googleSignUp}
                  disabled={loading}
                  className="border w-full h-10 rounded-xl flex justify-center items-center bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3">
                      <img
                        src="/google-icon.svg"
                        alt="Google"
                        className="h-full w-full"
                      />
                    </div>
                    <span className="text-zinc-800 font-semibold">
                      {loading ? "Please wait..." : "Continue with Google"}
                    </span>
                  </div>
                </button>
              </div>

              <div className="w-full flex justify-center items-center mt-6">
                <p className="text-neutral-500 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-neutral-300 hover:text-neutral-100 underline transition-colors"
                  >
                    LogIn
                  </Link>
                </p>
              </div>
            </div>
          </SpotlightCard>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
