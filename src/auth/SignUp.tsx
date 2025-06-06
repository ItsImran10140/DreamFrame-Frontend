// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link, useNavigate } from "react-router-dom";
import StarBorder from "../UI/border";
import SpotlightCard from "../UI/Card";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../apis/axios";

// Form validation helpers
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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/hero", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear errors when user starts typing
      if (error) setError("");
      if (validationErrors.length > 0) setValidationErrors([]);
    };

  // Form validation
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
        // Navigation will be handled by the useEffect when isAuthenticated changes
        navigate("/hero", { replace: true });
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

        // Update auth context directly
        setGoogleAuth({ token, user });

        // Navigate to hero page
        navigate("/hero", { replace: true });
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

  // Render validation errors
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
      {/* Video Background */}
      {/* <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/hv.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      <div className="relative z-20 flex bg-[#0C0C0C]/95 items-center justify-center min-h-screen text-white">
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
                    Sign In
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

// import { Link, useNavigate } from "react-router-dom";
// import StarBorder from "../UI/border";
// import SpotlightCard from "../UI/Card";
// import { useAuth } from "./AuthContext";
// import { useState, useEffect } from "react";
// import { useGoogleLogin } from "@react-oauth/google";
// import { googleAuth } from "./axios";

// // Form validation helpers
// const validateEmail = (email: string): boolean => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const validatePassword = (password: string): string[] => {
//   const errors: string[] = [];
//   if (password.length < 8) errors.push("At least 8 characters");
//   if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
//   if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
//   if (!/\d/.test(password)) errors.push("One number");
//   return errors;
// };

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [validationErrors, setValidationErrors] = useState<string[]>([]);

//   const { isAuthenticated, signUpNewUser } = useAuth();
//   const navigate = useNavigate();

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/hero", { replace: true });
//     }
//   }, [isAuthenticated, navigate]);

//   // Handle input changes
//   const handleInputChange =
//     (field: keyof typeof formData) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       setFormData((prev) => ({ ...prev, [field]: value }));

//       // Clear errors when user starts typing
//       if (error) setError("");
//       if (validationErrors.length > 0) setValidationErrors([]);
//     };

//   // Form validation
//   const validateForm = (): boolean => {
//     const errors: string[] = [];

//     if (!formData.username.trim()) {
//       errors.push("Username is required");
//     } else if (formData.username.trim().length < 2) {
//       errors.push("Username must be at least 2 characters");
//     }

//     if (!formData.email.trim()) {
//       errors.push("Email is required");
//     } else if (!validateEmail(formData.email)) {
//       errors.push("Please enter a valid email address");
//     }

//     if (!formData.password) {
//       errors.push("Password is required");
//     } else {
//       const passwordErrors = validatePassword(formData.password);
//       errors.push(...passwordErrors.map((err) => `Password must have: ${err}`));
//     }

//     setValidationErrors(errors);
//     return errors.length === 0;
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const result = await signUpNewUser(
//         formData.username,
//         formData.email,
//         formData.password
//       );

//       if (result.success) {
//         // Navigation will be handled by the useEffect when isAuthenticated changes
//         navigate("/hero", { replace: true });
//       } else {
//         setError(result.error || "Registration failed");
//       }
//     } catch (error: any) {
//       console.error("Signup error:", error);
//       setError("An unexpected error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleGoogleSignup = async () => {
//   // setError("Google signup is not implemented yet. Please use email signup.");
//   // TODO: Implement Google OAuth integration
//   // };

//   const responseGoogle = async (authResult: any) => {
//     try {
//       if (authResult["code"]) {
//         const result = await googleAuth(authResult["code"]);
//         // const { email, name } = result.data.user;
//         const token = result.data.token;
//         // const obj = token };
//         localStorage.setItem("accessToken", token);
//         console.log(token);
//         console.log(result.data.user);
//         navigate("/hero", { replace: true });
//       }
//     } catch (error: any) {
//       console.log("Error while requesting google code", error);
//     }
//   };
//   const googleSignUp = useGoogleLogin({
//     onSuccess: responseGoogle,
//     onError: responseGoogle,
//     flow: "auth-code",
//   });

//   // Render validation errors
//   const renderValidationErrors = () => {
//     if (validationErrors.length === 0) return null;

//     return (
//       <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
//         <ul className="list-disc list-inside space-y-1">
//           {validationErrors.map((error, index) => (
//             <li key={index}>{error}</li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Video Background */}
//       <video
//         className="absolute top-0 left-0 w-full h-full object-cover z-0"
//         autoPlay
//         loop
//         muted
//         playsInline
//         preload="auto"
//       >
//         <source src="/hv.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       <div className="relative z-20 flex bg-[#0C0C0C]/95 items-center justify-center min-h-screen text-white">
//         <form onSubmit={handleSignup} noValidate>
//           <SpotlightCard
//             className="custom-spotlight-card w-[500px] h-full"
//             spotlightColor="rgba(255, 255, 255, 0.25)"
//           >
//             <div className="">
//               <div className="flex justify-center mb-10">
//                 <h1 className="text-3xl font-semibold">Sign Up</h1>
//               </div>

//               {/* Validation Errors */}
//               {renderValidationErrors()}

//               {/* API Error Message */}
//               {error && (
//                 <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
//                   {error}
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <StarBorder
//                   as="div"
//                   className="w-full"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={handleInputChange("username")}
//                     value={formData.username}
//                     type="text"
//                     placeholder="Username"
//                     required
//                     minLength={2}
//                     maxLength={50}
//                     className="w-full h-10 rounded-xl bg-transparent px-3 outline-none placeholder-gray-400"
//                     disabled={loading}
//                   />
//                 </StarBorder>

//                 <StarBorder
//                   as="div"
//                   className="w-full"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={handleInputChange("email")}
//                     value={formData.email}
//                     type="email"
//                     placeholder="Email"
//                     required
//                     className="w-full h-10 rounded-xl bg-transparent px-3 outline-none placeholder-gray-400"
//                     disabled={loading}
//                   />
//                 </StarBorder>

//                 <StarBorder
//                   as="div"
//                   className="w-full"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={handleInputChange("password")}
//                     value={formData.password}
//                     type="password"
//                     placeholder="Password"
//                     required
//                     minLength={8}
//                     className="w-full h-10 rounded-xl bg-transparent px-3 outline-none placeholder-gray-400"
//                     disabled={loading}
//                   />
//                 </StarBorder>

//                 <div className="h-[0.75px] my-6 bg-zinc-400/10"></div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="border-[0.75px] border-neutral-700 w-full h-10 rounded-xl text-neutral-300 hover:text-neutral-100 hover:bg-neutral-300/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   {loading ? "Creating Account..." : "Sign Up"}
//                 </button>

//                 <div className="flex w-full justify-center items-center my-4">
//                   <div className="h-[0.75px] bg-zinc-400/10 flex-1"></div>
//                   <p className="mx-4 text-zinc-400/50 text-sm">Or</p>
//                   <div className="h-[0.75px] bg-zinc-400/10 flex-1"></div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={googleSignUp}
//                   disabled={loading}
//                   className="border w-full h-10 rounded-xl flex justify-center items-center bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <div className="flex items-center">
//                     <div className="w-5 h-5 mr-3">
//                       <img
//                         src="/google-icon.svg"
//                         alt="Google"
//                         className="h-full w-full"
//                       />
//                     </div>
//                     <span className="text-zinc-800 font-semibold">
//                       {loading ? "Please wait..." : "Continue with Google"}
//                     </span>
//                   </div>
//                 </button>
//               </div>

//               <div className="w-full flex justify-center items-center mt-6">
//                 <p className="text-neutral-500 text-sm">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="text-neutral-300 hover:text-neutral-100 underline transition-colors"
//                   >
//                     Sign In
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </SpotlightCard>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// ===========================================================================================

// import { Link, useNavigate } from "react-router-dom";
// import StarBorder from "../UI/border";
// import SpotlightCard from "../UI/Card";
// import { UserAuth } from "./AuthContext";
// import { useState } from "react";
// import axios from "axios";

// const SignUp = () => {
//   const [username, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { session, signUpNewUser }: any = UserAuth();
//   console.log(session);
//   const navigate = useNavigate();

//   const handleSighup = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Register user with your backend
//       const response = await axios.post(
//         "http://localhost:3000/api/manim/register",
//         {
//           username: username,
//           email: email,
//           password: password,
//         }
//       );

//       if (response.status === 201) {
//         // Store tokens in localStorage (or consider using a more secure method)
//         localStorage.setItem("accessToken", response.data.tokens.accessToken);
//         localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
//         localStorage.setItem("user", JSON.stringify(response.data.user));

//         // Navigate to hero page on success
//         navigate("/hero");
//       }
//       navigate("/hero");
//     } catch (error: any) {
//       console.error("Signup error:", error);

//       if (error.response) {
//         // Server responded with an error status
//         setError(error.response.data.message || "Registration failed");
//         console.log("Error response:", error);
//       } else if (error.request) {
//         // Request was made but no response received
//         setError("Network error. Please check your connection.");
//       } else {
//         // Something else happened
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignup = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       // Use Supabase for Google OAuth
//       const result = await signUpNewUser("", ""); // You'll need to modify this for Google OAuth
//       if (result.success) {
//         navigate("/hero");
//       } else {
//         setError(result.error || "Google signup failed");
//       }
//     } catch (error) {
//       setError("Google signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Video Background */}
//       <video
//         className="absolute top-0 left-0 w-full h-full object-cover z-0"
//         autoPlay
//         loop
//         muted
//         playsInline
//         preload="auto"
//       >
//         <source src="/hv.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <div className="relative z-20 flex bg-[#0C0C0C]/95 items-center justify-center min-h-screen text-white">
//         <form onSubmit={handleSighup}>
//           <SpotlightCard
//             className="custom-spotlight-card w-[500px] h-full"
//             spotlightColor="rgba(255, 255, 255, 0.25)"
//           >
//             <div className="">
//               <div className=" flex justify-center mb-10 ">
//                 <h1 className="text-3xl">Sign Up</h1>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
//                   {error}
//                 </div>
//               )}

//               <div>
//                 <StarBorder
//                   as="button"
//                   className=" w-full mb-2"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={(e) => setUserName(e.target.value)}
//                     value={username}
//                     type="text"
//                     placeholder="Name"
//                     required
//                     className="w-full h-10 rounded-xl bg-transparent  px-3 outline-none"
//                   />
//                 </StarBorder>
//                 <StarBorder
//                   as="button"
//                   className=" w-full mb-2"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={(e) => setEmail(e.target.value)}
//                     value={email}
//                     type="email"
//                     placeholder="Email"
//                     required
//                     className="w-full h-10 rounded-xl bg-transparent px-3 outline-none"
//                   />
//                 </StarBorder>

//                 <StarBorder
//                   as="button"
//                   className=" w-full mb-2"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={(e) => setPassword(e.target.value)}
//                     value={password}
//                     type="password"
//                     placeholder="Password"
//                     required
//                     minLength={8}
//                     className="w-full h-10  rounded-xl bg-transparent  px-3 outline-none"
//                   />
//                 </StarBorder>

//                 <div className="h-[0.75px] my-3 bg-zinc-400/10"></div>
//                 <div>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="border-[0.75px] border-neutral-700 w-full h-10 rounded-xl mt-2 text-neutral-300 hover:text-neutral-400 hover:bg-neutral-300/20 disabled:opacity-50"
//                   >
//                     {loading ? "Signing Up..." : "Sign Up"}
//                   </button>
//                 </div>
//                 <div className="flex w-full justify-center items-center my-2">
//                   <div className="h-[0.75px] bg-zinc-400/10 w-[95%]"></div>
//                   <p className="mx-6 text-zinc-400/10">Or</p>
//                   <div className="h-[0.75px] bg-zinc-400/10 w-[95%]"></div>
//                 </div>
//                 <div>
//                   <button
//                     type="button"
//                     onClick={handleGoogleSignup}
//                     disabled={loading}
//                     className="border w-full h-10 rounded-xl mt-8 flex justify-center items-center bg-neutral-100 disabled:opacity-50"
//                   >
//                     <div className="flex">
//                       <div className="w-5 mr-3">
//                         <img
//                           src="/google-icon.svg"
//                           alt="Google Icons"
//                           className="h-full w-full"
//                         />
//                       </div>
//                       <div className="text-zinc-800 font-semibold">
//                         {loading ? "Signing up..." : "Signup with Google"}
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//               <div className="w-full flex justify-center items-center my-4">
//                 <div className="flex">
//                   <p className="text-neutral-500 mr-2">
//                     Already have a account :{" "}
//                   </p>
//                   <Link to="/login">
//                     <button className="text-neutral-300">Login</button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </SpotlightCard>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// =====================================================================================

// import { Link, useNavigate } from "react-router-dom";
// import StarBorder from "../UI/border";
// import SpotlightCard from "../UI/Card";
// import { UserAuth } from "./AuthContext";
// import { useState } from "react";
// import axios from "axios";

// const SignUp = () => {
//   const [username, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { session, signUpNewUser }: any = UserAuth();
//   console.log(session);
//   const navigate = useNavigate();

//   const handleSighup = async (e: any) => {
//     setLoading(true);
//     e.preventDefault();
//     await axios.post("http://localhost:3000/api/manim/register", {
//       data: {
//         username: username,
//         email: email,
//         password: password,
//       },
//     });
//     navigate("/hero");
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Video Background */}
//       <video
//         className="absolute top-0 left-0 w-full h-full object-cover z-0"
//         autoPlay
//         loop
//         muted
//         playsInline
//         preload="auto"
//       >
//         <source src="/hv.mp4" type="video/mp4" />
//         {/* Fallback message instead of broken image */}
//         Your browser does not support the video tag.
//       </video>
//       <div className="relative z-20 flex bg-[#0C0C0C]/95 items-center justify-center min-h-screen text-white">
//         <form onSubmit={handleSighup}>
//           <SpotlightCard
//             className="custom-spotlight-card w-[500px] h-full"
//             spotlightColor="rgba(255, 255, 255, 0.25)"
//           >
//             <div className="">
//               <div className=" flex justify-center mb-10 ">
//                 <h1 className="text-3xl">Sign Up</h1>
//               </div>
//               <div>
//                 <StarBorder
//                   as="button"
//                   className=" w-full mb-2"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={(e) => setUserName(e.target.value)}
//                     value={username}
//                     type="text"
//                     placeholder="Name"
//                     className="w-full h-10 rounded-xl bg-transparent  px-3 outline-none"
//                   />
//                 </StarBorder>
//                 <StarBorder
//                   as="button"
//                   className=" w-full mb-2"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={(e) => setEmail(e.target.value)}
//                     value={email}
//                     type="text"
//                     placeholder="Email"
//                     className="w-full h-10 rounded-xl bg-transparent px-3 outline-none"
//                   />
//                 </StarBorder>

//                 <StarBorder
//                   as="button"
//                   className=" w-full mb-2"
//                   color="white"
//                   speed="5s"
//                 >
//                   <input
//                     onChange={(e) => setPassword(e.target.value)}
//                     value={password}
//                     type="password"
//                     placeholder="Password"
//                     className="w-full h-10  rounded-xl bg-transparent  px-3 outline-none"
//                   />
//                 </StarBorder>

//                 <div className="h-[0.75px] my-3 bg-zinc-400/10"></div>
//                 <div>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="border-[0.75px] border-neutral-700 w-full h-10 rounded-xl mt-2 text-neutral-300 hover:text-neutral-400 hover:bg-neutral-300/20 disabled:opacity-50"
//                   >
//                     {loading ? "Signing Up..." : "Sign Up"}
//                   </button>
//                 </div>
//                 <div className="flex w-full justify-center items-center my-2">
//                   <div className="h-[0.75px] bg-zinc-400/10 w-[95%]"></div>
//                   <p className="mx-6 text-zinc-400/10">Or</p>
//                   <div className="h-[0.75px] bg-zinc-400/10 w-[95%]"></div>
//                 </div>
//                 <div>
//                   <button
//                     type="button"
//                     onClick={() => "#"}
//                     disabled={loading}
//                     className="border w-full h-10 rounded-xl mt-8 flex justify-center items-center bg-neutral-100 disabled:opacity-50"
//                   >
//                     <div className="flex">
//                       <div className="w-5 mr-3">
//                         <img
//                           src="/google-icon.svg"
//                           alt="Google Icons"
//                           className="h-full w-full"
//                         />
//                       </div>
//                       <div className="text-zinc-800 font-semibold">
//                         {loading ? "Signing up..." : "Signup with Google"}
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//               <div className="w-full flex justify-center items-center my-4">
//                 <div className="flex">
//                   <p className="text-neutral-500 mr-2">
//                     Already have a account :{" "}
//                   </p>
//                   <Link to="/login">
//                     <button className="text-neutral-300">Login</button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </SpotlightCard>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
