/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from "lucide-react";

interface HeaderProps {
  onNewProject: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject }) => {
  return (
    <div className="p-4 border-b border-zinc-700/40 flex justify-between items-center">
      <h2 className="text-lg font-medium text-zinc-200">Projects</h2>
      <button
        onClick={onNewProject}
        className="p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
      >
        <Plus size={18} className="text-zinc-300" />
      </button>
    </div>
  );
};

export default Header;
