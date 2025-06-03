/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Clock, LogOut, Plus } from "lucide-react";
import { format } from "date-fns";
import { UserAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

type Video = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  isOutput: boolean;
  s3Key: string;
  s3Bucket: string;
  createdAt: string;
};

type Project = {
  id: string;
  prompt: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  videos: Video[];
};

type PaginationData = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type ProjectsResponse = {
  data: Project[];
  pagination: PaginationData;
};

interface ProjectSidebarProps {
  onSelectProject: (projectId: string) => void;
  currentProjectId: string | null;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  onSelectProject,
  currentProjectId,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const { signOut }: any = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch projects from API
  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get<ProjectsResponse>(
        `http://localhost:3000/api/manim/projects?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setProjects(response.data.data);
      setPagination(response.data.pagination);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Load projects on initial render
  useEffect(() => {
    fetchProjects();
  }, []);

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
    }
  };

  useEffect(() => {
    handleUserDetails();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch {
      return dateString;
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (pagination && currentPage < pagination.pages) {
      fetchProjects(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination && currentPage > 1) {
      fetchProjects(currentPage - 1);
    }
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const refesh = () => {
    window.location.href = "http://localhost:5173/hero";
  };

  return (
    <div
      className={`relative h-full transition-all duration-300 ease-in-out ${
        isOpen ? "w-60" : "w-4"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-0 top-4 transform translate-x-1/2 bg-zinc-800 rounded-full p-1 z-10 border border-zinc-700"
      >
        {isOpen ? (
          <ChevronLeft size={16} className="text-zinc-400" />
        ) : (
          <ChevronRight size={16} className="text-zinc-400" />
        )}
      </button>

      {/* Sidebar content */}
      <div
        className={`h-full bg-zinc-950/10 border-r border-zinc-800/40 flex flex-col ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-700/40 flex justify-between items-center">
          <h2 className="text-lg font-medium text-zinc-200">Projects</h2>
          <button
            onClick={refesh}
            className="p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
          >
            <Plus size={18} className="text-zinc-300" />
          </button>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto">
          {loading && !projects.length ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zinc-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-zinc-400 text-sm">{error}</div>
          ) : projects.length === 0 ? (
            <div className="p-4 text-zinc-500 text-sm">No projects found</div>
          ) : (
            <div className="py-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className={`px-4 py-1 cursor-pointer transition-colors duration-200 hover:bg-zinc-600/20 border-l-2 ${
                    project.id === currentProjectId
                      ? "border-zinc-400 bg-zinc-700/20"
                      : "border-transparent"
                  }`}
                >
                  <div className="text-zinc-200 font-semibold text-sm truncate mb-1">
                    {project.prompt}
                  </div>
                  <div className="flex items-center text-xs text-zinc-500">
                    <Clock size={12} className="mr-1" />
                    {formatDate(project.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="p-3 border-t border-zinc-800 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-zinc-500">
              Page {currentPage} of {pagination.pages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === pagination.pages}
              className={`p-1 rounded-md ${
                currentPage === pagination.pages
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {toggleOpen ? (
          <div
            className={`border-t border-r border-l p-2 bg-zinc-800/40  rounded-t-lg border-zinc-700/40 transition-all duration-300 ease-in-out ${
              toggleOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <div>
              <p className="text-[12px] text-zinc-400 p-1">{email}</p>
              <div className="flex items-center py-1">
                <div>
                  {/* <img src="" alt="" /> */}
                  <div className="rounded-full h-6 w-6 bg-neutral-500 flex justify-center items-center mx-2">
                    I
                  </div>
                </div>
                <div>
                  <p className="text-sm">{username}</p>
                  <p className="text-[11px]">Free Plan</p>
                </div>
              </div>
              <div className="h-[0.75px] bg-neutral-600/40"></div>
              <Link to={"/settings"}>
                <div className="my-3 text-sm text-zinc-300 rounded-md pl-2 py-1 cursor-pointer hover:bg-zinc-500/40">
                  <p>Settings</p>
                </div>
              </Link>
              <div>
                <div className="flex justify-between my-1">
                  <p className="text-sm text-zinc-300">Log Out</p>
                  <button
                    onClick={handleSignOut}
                    className="p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                  >
                    {/* <Plus size={18} className="text-red-500" /> */}
                    <LogOut size={18} className="p-[2px] text-zinc-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div
          onClick={() => setToggleOpen(!toggleOpen)}
          className="p-4 border-t border-zinc-700/40 flex justify-between items-center "
        >
          <div className="flex items-center border w-full p-2 border-zinc-500/30 rounded-lg cursor-pointer hover:bg-neutral-800/20 bg-zinc-800/40">
            <div className="bg-zinc-500 h-6 w-6 rounded-full flex justify-center items-center mr-2">
              I
            </div>
            <div>{username}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
