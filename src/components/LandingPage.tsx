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
      <div className="relative min-h-screen overflow-hidden bg-black pb-32 ">
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
              className="text-[200px] font-title2 mb-[-50px] tracking-widest"
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
      <div className="h-[1170px] bg-black relative flex flex-col justify-center items-center ">
        <div className="absolute z-30 top-0 left-0 h-full w-full bg-gradient-radial-at-b from-orange-300/80 to-transparent blur-2xl"></div>
        <div className=" absolute z-40 w-[80%] h-[90%] bottom-0 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            {/* <p>Boost your rankings with AI.</p> */}
            <ShinyText
              text="Unlock your"
              disabled={false}
              speed={3}
              className="text-[70px] w-[650px] mb-[-30px] font-semibold text-center"
            />
            <ShinyText
              text="Imagination with AI"
              disabled={false}
              speed={3}
              className="text-[70px] w-[650px] mb-[30px] font-semibold text-center"
            />
          </div>
          <div>
            <p className="text-zinc-300 text-[18px] text-center mb-10">
              Elevate your site’s visibility effortlessly with AI, <br /> where
              smart technology meets user-friendly SEO tools.
            </p>
          </div>
          <div className="mb-10">
            <Link to="/signup">
              <button className="border border-zinc-200/30 hover:bg-zinc-400/40 hover:border-zinc-300/60  text-zinc-400 hover:text-zinc-300 font-semibold py-2 px-6 rounded-full transition-colors">
                Get Started
              </button>
            </Link>
          </div>
          <div className="rounded-t-3xl h-full w-[95%] bg-black/60 shadow-[0_-25px_50px_theme('colors.orange.300')]">
            <div className="mx-4 mt-4 h-full">
              <img
                src="/saas.png"
                alt="saas"
                className="h-[97%] opacity-70 rounded-t-3xl"
              />
            </div>
          </div>
        </div>
        <div className="h-[80px] mb-[-15px] bg-gradient-to-t from-black to-black/20 absolute bottom-0 z-40 w-full blur-lg"></div>
        <div className="bg-black h-[700px] absolute z-40 bottom-0 mb-[-697px] w-full text-white">
          <div>IMRAN sHAH</div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
