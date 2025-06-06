import { LogOut } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ProfileDropDown = ({
  user,
  getUserInitial,
  handleSignOut,
  onShowSettings,
}: any) => {
  return (
    <div className="border-t border-r border-l p-2 bg-zinc-800/40 rounded-t-lg border-zinc-700/40 transition-all duration-300 ease-in-out">
      <div>
        <p className="text-[12px] text-zinc-400 p-1">{user?.email}</p>
        <div className="flex items-center py-1">
          <div className="rounded-full h-6 w-6 bg-neutral-500 flex justify-center items-center mx-2">
            {getUserInitial()}
          </div>
          <div>
            <p className="text-sm">{user?.username}</p>
            <p className="text-[11px]">Free Plan</p>
          </div>
        </div>
        <div className="h-[0.75px] bg-neutral-600/40"></div>

        {/* Updated Settings button - now calls onShowSettings instead of Link */}
        <div
          onClick={onShowSettings}
          className="my-3 text-sm text-zinc-300 rounded-md pl-2 py-1 cursor-pointer hover:bg-zinc-500/40"
        >
          <p>Settings</p>
        </div>

        <div className="flex justify-between my-1">
          <p className="text-sm text-zinc-300">Log Out</p>
          <button
            onClick={handleSignOut}
            className="p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
          >
            <LogOut size={18} className="p-[2px] text-zinc-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropDown;
