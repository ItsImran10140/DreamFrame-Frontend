/* eslint-disable @typescript-eslint/no-explicit-any */

import { useProfileToggle } from "../../../stores/store";

const UserProfile = ({
  // setToggleOpen,
  // toggleOpen,
  getUserInitial,
  user,
}: any) => {
  const { toggle } = useProfileToggle();

  return (
    // () => setToggleOpen(!toggleOpen)
    <div
      onClick={toggle}
      className="p-4 border-t border-zinc-700/40 flex justify-between items-center cursor-pointer"
    >
      <div className="flex items-center border w-full p-2 border-zinc-500/30 rounded-lg hover:bg-neutral-800/20 bg-zinc-800/40">
        <div className="bg-zinc-500 h-6 w-6 rounded-full flex justify-center items-center mr-2">
          {getUserInitial()}
        </div>
        <div>{user?.username}</div>
      </div>
    </div>
  );
};

export default UserProfile;
