import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-white">Settings</div>
        <div>
          <Link to={"/hero"}>
            <button className="text-white bg-neutral-600 py-2 px-4 rounded-md">
              Home Screen
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Settings;
