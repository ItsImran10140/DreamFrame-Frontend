/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "./AuthContext";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { signOut }: any = UserAuth();
  const navigate = useNavigate();

  const handleUserDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/api/manim/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.user);
      setUsername(response.data.user.username);
      setEmail(response.data.user.email);
    } catch (error: any) {
      console.log(error);
      setError("Failed to load user details");
    }
  };

  useEffect(() => {
    handleUserDetails();
  }, []);

  const updateProfileHandler = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.put(
        "http://localhost:3000/api/manim/profile",
        {
          username,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage("Profile updated successfully!");
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to update profile");
      setLoading(false);
    }
  };

  const updatePasswordHandler = async () => {
    if (!currentPassword || !newPassword) {
      setError("Please fill in both password fields");
      return;
    }

    setPasswordLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.put(
        "http://localhost:3000/api/manim/password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setPasswordLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to update password");
      setPasswordLoading(false);
    }
  };

  const deleteAccountHandler = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.delete("http://localhost:3000/api/manim/account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Clear local storage and redirect to login or home page
      localStorage.removeItem("accessToken");
      setMessage("Account deleted successfully!");

      // You might want to redirect to login page here
      // window.location.href = "/login";
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-screen bg-neutral-900">
        <div className="h-12 flex items-center">
          <Link to={"/hero"}>
            <ArrowLeft className="text-zinc-300 ml-4" />
          </Link>
          <div className="text-white text-2xl m-4">Settings</div>
        </div>

        {/* Success/Error Messages */}
        {(message || error) && (
          <div className="flex justify-center px-3">
            <div
              className={`w-[600px] p-3 rounded-md mb-4 ${
                message
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "bg-red-500/20 text-red-400 border border-red-500/50"
              }`}
            >
              {message || error}
            </div>
          </div>
        )}

        <div className="flex justify-center p-3 h-[90vh]">
          <div className="w-[600px] bg-neutral-800 relative rounded-lg z-0 h-[95%]">
            <div className="absolute left-0 right-0 p-4 z-10 pt-6">
              {/* Update Profile Section */}
              <span className="text-zinc-300">Update Profile</span>
              <div>
                <input
                  className="w-full mt-2 mb-4 h-10 rounded-md p-2 bg-neutral-700 outline-none text-zinc-200"
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="w-full h-10 mb-2 rounded-md p-2 bg-neutral-700 outline-none text-zinc-200"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full rounded-md flex justify-center h-10 p-2 border text-zinc-300 border-zinc-400/50 mt-2 mb-4 cursor-pointer">
                <button
                  onClick={updateProfileHandler}
                  className="text-md cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Change Password Section */}
              <span className="text-zinc-300">Change Password</span>
              <div>
                <input
                  className="w-full mt-2 mb-4 h-10 rounded-md p-2 bg-neutral-700 outline-none text-zinc-200"
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="w-full h-10 rounded-md p-2 bg-neutral-700 outline-none text-zinc-200"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="w-full rounded-md flex justify-center h-10 p-2 border text-zinc-300 border-zinc-400/50 mt-4 cursor-pointer">
                <button
                  className="text-md"
                  onClick={updatePasswordHandler}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Change Password"}
                </button>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-neutral-400/10 my-2 mt-4"></div>

              {/* Logout Button */}
              <div className="w-full rounded-md flex justify-center h-10 p-2 border border-zinc-400/50 mt-4 cursor-pointer text-zinc-300">
                <button className="text-md" onClick={handleSignOut}>
                  LogOut
                </button>
              </div>

              {/* Delete Account Button */}
              <div className="w-full rounded-md flex justify-center h-10 p-2 border border-red-400 mt-4 cursor-pointer bg-red-400/20 text-neutral-900">
                <button
                  className="text-md text-red-400"
                  onClick={deleteAccountHandler}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
