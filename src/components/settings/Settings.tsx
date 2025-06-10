/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { UserAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface SettingsComponentProps {
  onClose: () => void;
}

const SettingsComponent = ({ onClose }: SettingsComponentProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const { signOut }: any = UserAuth();

  const handleUserDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://backendapi.dynamooai.org/api/manim/profile",
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
        "https://backendapi.dynamooai.org/api/manim/profile",
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
        "https://backendapi.dynamooai.org/api/manim/password",
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
    setDeleteLoading(true);
    setError("");
    setMessage("");
    setShowDeleteDialog(false);

    try {
      await axios.delete("https://backendapi.dynamooai.org/api/manim/account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      localStorage.removeItem("accessToken");
      setMessage("Account deleted successfully!");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
      navigate("/");
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
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-black flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center border-b border-stone-700/40">
        <button onClick={onClose} className="p-2">
          <ArrowLeft className="text-zinc-300 ml-4" />
        </button>
        <div className="text-white text-2xl ml-2">Settings</div>
      </div>

      {/* Success/Error Messages */}
      {(message || error) && (
        <div className="flex justify-center px-3 pt-4">
          <div
            className={`w-full max-w-[600px] p-3 rounded-md mb-4 ${
              message
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
          >
            {message || error}
          </div>
        </div>
      )}

      {/* Settings Content */}
      <div className="flex justify-center mt-[-25px] items-center h-screen">
        <div className="w-full max-w-[600px] bg-zinc-800/40 rounded-lg p-6 border-[0.75px] border-zinc-700/40">
          {/* Update Profile Section */}
          <div className="mb-6">
            <span className="text-zinc-300 text-lg font-medium">
              Update Profile
            </span>
            <div className="mt-4">
              <input
                className="w-full mb-4 h-10 rounded-md p-2 bg-neutral-950 outline-none text-zinc-200"
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="w-full h-10 mb-4 rounded-md p-2 bg-neutral-950 outline-none text-zinc-200"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={updateProfileHandler}
                disabled={loading}
                className="w-full rounded-md h-10 border text-zinc-300 hover:text-stone-800 border-zinc-400/50 hover:bg-white/85 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="mb-6">
            <span className="text-zinc-300 text-lg font-medium">
              Change Password
            </span>
            <div className="mt-4">
              <input
                className="w-full mb-4 h-10 rounded-md p-2 bg-neutral-950 outline-none text-zinc-200"
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                className="w-full h-10 mb-4 rounded-md p-2 bg-neutral-950 outline-none text-zinc-200"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={updatePasswordHandler}
                disabled={passwordLoading}
                className="w-full rounded-md h-10 border text-zinc-300 hover:text-stone-800 border-zinc-400/50 hover:bg-white/85 transition-colors disabled:opacity-50"
              >
                {passwordLoading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-neutral-400/10 my-6"></div>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="w-full rounded-md h-10 border text-zinc-300 hover:text-stone-800 border-zinc-400/50 hover:bg-white/85 transition-colors disabled:opacity-50 mb-4"
          >
            Log Out
          </button>

          {/* Delete Account Button */}
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteLoading}
            className="w-full rounded-md h-10 border border-red-400 bg-red-400/20 text-red-400 hover:bg-red-400/30 transition-colors disabled:opacity-50"
          >
            {deleteLoading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md border border-zinc-700/50">
            <h3 className="text-white text-lg font-medium mb-4">
              Delete Account
            </h3>
            <p className="text-zinc-300 mb-6 leading-relaxed">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 rounded-md border border-zinc-400/50 text-zinc-300 hover:bg-zinc-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccountHandler}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsComponent;
