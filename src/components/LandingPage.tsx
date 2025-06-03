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
    <>
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-contain z-0"
          autoPlay
          loop
          muted
          playsInline
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          preload="auto"
        >
          <source src="/hero_main.mp4" type="video/mp4" />
          {/* Fallback message instead of broken image */}
          Your browser does not support the video tag.
        </video>

        {/* Content on top of video */}
        <div className="relative z-20 flex  items-center justify-center min-h-screen text-white">
          <div className="text-center   mt-[350px] px-4">
            <ShinyText
              text="Dynamo"
              disabled={false}
              speed={3}
              className="text-[200px] font-title2 mb-[-50px] tracking-[70px]"
            />
            <p className="text-[17px] mt-6 mb-8 max-w-3xl mx-auto text-zinc-300/60">
              An AI-powered tool that converts natural language descriptions
              directly into Python Manim code and renders professional
              mathematical animations automatically.
            </p>
            <Link to="/signup">
              <button className="border border-zinc-200/30 hover:bg-zinc-400/40 hover:border-zinc-300/60  text-zinc-400 hover:text-zinc-300 font-semibold py-2 px-6 rounded-full transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
      <section></section>
    </>
  );
};

export default LandingPage;
