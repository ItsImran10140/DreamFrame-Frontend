/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import { useUser } from "../../hooks/useUser";
import { formatDate } from "../../utils/formaters";
import SideBarList from "./components/SideBarList";
import Header from "./components/Header";
import PaginationButton from "./components/PaginationButton";
import ProfileDropDown from "./components/ProfileDropDown";
import UserProfile from "./components/UserProfile";
import { useProfileToggle } from "../../stores/store";

interface ProjectSidebarProps {
  onSelectProject: (projectId: string) => void;
  currentProjectId: string | null;
  onShowSettings: any;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  onSelectProject,
  currentProjectId,
  onShowSettings,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [toggleOpen, setToggleOpen] = useState(false);
  const { signOut }: any = UserAuth();
  const navigate = useNavigate();
  const { projects, loading, error, pagination, fetchProjects } = useSidebar();
  const { user } = useUser();

  const { isOpen: toggleOpen } = useProfileToggle();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Load projects on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(currentPage);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle pagination
  const handleNextPage = () => {
    if (pagination && currentPage < pagination.pages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProjects(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination && currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchProjects(prevPage);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const refresh = () => {
    window.location.href = "http://localhost:5173/hero";
  };

  const getUserInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || "U";
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
        <Header refresh={refresh} />
        {/* Project list */}
        <SideBarList
          loading={loading}
          projects={projects}
          error={error}
          onSelectProject={onSelectProject}
          currentProjectId={currentProjectId}
          formatDate={formatDate}
        />
        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <PaginationButton
            handlePrevPage={handlePrevPage}
            currentPage={currentPage}
            pagination={pagination}
            handleNextPage={handleNextPage}
          />
        )}
        {/* User profile dropdown */}
        {toggleOpen && (
          <ProfileDropDown
            user={user}
            getUserInitial={getUserInitial}
            handleSignOut={handleSignOut}
            onShowSettings={onShowSettings}
          />
        )}
        {/* User profile toggle */}
        <UserProfile
          // setToggleOpen={setToggleOpen}
          // toggleOpen={toggleOpen}
          getUserInitial={getUserInitial}
          user={user}
        />
      </div>
    </div>
  );
};

export default ProjectSidebar;
