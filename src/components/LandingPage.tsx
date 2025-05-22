/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import ShinyText from "../UI/HeroText";

const LandingPage = () => {
  const handleVideoError = (e: any) => {
    console.error("Video failed to load:", e);
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        preload="auto"
      >
        <source src="/hv.mp4" type="video/mp4" />
        {/* Fallback message instead of broken image */}
        Your browser does not support the video tag.
      </video>

      {/* Content on top of video */}
      <div className="relative z-20 flex bg-[#0C0C0C]/60 items-center justify-center min-h-screen text-white">
        <div className="text-center   mt-[-90px] px-4">
          <ShinyText
            text="Dynamo"
            disabled={false}
            speed={3}
            className="text-[200px] font-title mb-[-50px]"
          />
          <p className="text-[17px]  mb-8 max-w-2xl mx-auto text-zinc-300/80">
            An AI-powered tool that converts natural language descriptions
            directly into Python Manim code and renders professional
            mathematical animations automatically.
          </p>
          <Link to="/hero">
            <button className="bg-zinc-200 hover:bg-zinc-400  text-zinc-800 font-semibold py-2 px-6 rounded-full transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
