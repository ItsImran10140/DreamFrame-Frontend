/* eslint-disable @typescript-eslint/no-explicit-any */
import { Clock } from "lucide-react";
import { Riple } from "react-loading-indicators";

const SideBarList = ({
  loading,
  projects,
  error,
  onSelectProject,
  currentProjectId,
  formatDate,
}: any) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {loading && !projects.length ? (
        <div className="flex items-center justify-center h-32">
          <Riple color="#dddddd" size="small" text="" textColor="" />
        </div>
      ) : error ? (
        <div className="p-4 text-zinc-400 text-sm">{error}</div>
      ) : projects.length === 0 ? (
        <div className="p-4 text-zinc-500 text-sm">No projects found</div>
      ) : (
        <div className="py-2">
          {projects.map((project: any) => (
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
  );
};

export default SideBarList;
