/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import ShinyText from "../../UI/HeroText";
import { OrbitalSlider } from "../../UI/OrbitalSlider";

const LandingPage = () => {
  const handleVideoError = (e: any) => {
    console.error("Video failed to load:", e);
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  const movieItems = [
    {
      id: 1,

      image: "/item1.png",
    },
    {
      id: 2,

      image: "/item8.png",
    },
    {
      id: 3,

      image: "/item2.png",
    },
    {
      id: 4,

      image: "/item3.png",
    },
    {
      id: 1,

      image: "/item4.png",
    },
    {
      id: 2,

      image: "/item5.png",
    },
    {
      id: 3,

      image: "/item6.png",
    },
    {
      id: 4,

      image: "/item7.png",
    },
  ];

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
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-radial-at-b from-orange-300/80 to-transparent blur-2xl"></div>
        <div className=" absolute z-10 w-[80%] h-[90%] bottom-0 flex flex-col justify-center items-center">
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
              className="text-[70px] w-[650px] mb-[5px] font-semibold text-center"
            />
          </div>
          <div>
            <p className="text-zinc-300/40 text-[18px] text-center mb-16">
              Elevate your site’s visibility effortlessly with AI, where smart
              technology meets user-friendly SEO tools.
            </p>
          </div>

          <div className="rounded-3xl h-full bg-black/60 shadow-[0_0_50px_theme('colors.orange.300')] flex justify-center">
            <div className="mx-4 mt-4 pb-2  h-full">
              <img
                src="/saas.png"
                alt="saas"
                className="h-[97%] opacity-70 rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black  flex justify-center text-white relative ">
        <div className="h-26   absolute z-10   w-full bg-gradient-radial-at-b from-orange-300/80 to-transparent">
          <div className="h-[900px]  flex items-center justify-center">
            <div className="h-full w-full flex justify-center   relative">
              <img src="/think_img.png" alt="think" className="h-full pt-60" />
              {/* banner */}
              <div className="absolute z-20   h-full w-full overflow-hidden flex justify-center items-center mt-[-150px]">
                <OrbitalSlider
                  items={movieItems}
                  radius={350}
                  speed={0.2}
                  cardWidth={250}
                  cardHeight={200}
                />
              </div>
              <div className="absolute z-30  bottom-0 w-full h-[320px] flex justify-between">
                <div className="w-[480px] px-2">
                  <p className="text-xl mb-2 text-center text-orange-300/80">
                    LLM Capability Description
                  </p>
                  <p className="text-center text-orange-200/60">
                    AI-Powered Code Generation Our advanced language model
                    understands natural language prompts and automatically
                    converts them into working Python Manim code. Simply
                    describe the animation you want - whether it's mathematical
                    visualizations, geometric transformations, or educational
                    diagrams - and the AI will generate the precise code needed
                    to bring your vision to life. The model is trained to
                    understand animation concepts, mathematical notation, and
                    Manim's syntax, making complex animation creation as simple
                    as having a conversation.
                  </p>
                </div>
                <div className="w-[480px] px-2  text-center ">
                  <p className="text-xl mb-2 text-center text-orange-300/80">
                    Manim Library Description
                  </p>
                  <p className="text-orange-200/60">
                    Manim (Mathematical Animation Engine) is a powerful Python
                    library originally created by Grant Sanderson (3Blue1Brown)
                    for producing high-quality mathematical animations. It
                    excels at creating smooth, precise visualizations of
                    mathematical concepts, geometric shapes, graphs, and
                    educational content. Manim renders animations as video
                    files, supporting everything from simple shape movements to
                    complex mathematical proofs and transformations. It's the
                    same tool used to create popular educational videos on
                    platforms like YouTube, making professional-grade
                    mathematical animations accessible to educators, students,
                    and content creators.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-stone-950 flex justify-end">
            <div className="w-[550px] flex gap-14 py-12 pl-4">
              <div>
                <p className="mb-2 text-stone-400">Product</p>
                <div className="font-thin text-stone-500 cursor-pointer">
                  Features
                  <br />
                  Integration
                  <br />
                  Updates
                  <br />
                  FAQ
                  <br />
                  Pricing
                </div>
              </div>
              <div>
                <p className="mb-2 text-stone-400">Company</p>
                <div className="font-thin text-stone-500 cursor-pointer">
                  About <br /> Blog <br /> Careers <br /> Manifesto <br /> Press{" "}
                  <br />
                  Contract
                </div>
              </div>
              <div>
                <p className="mb-2 text-stone-400">Resources</p>
                <div className="font-thin text-stone-500 cursor-pointer">
                  Examples
                  <br />
                  Community
                  <br />
                  Guides
                  <br />
                  Docs
                  <br />
                  Press
                </div>
              </div>
              <div>
                <p className="mb-2 text-stone-400">Legal</p>
                <div className="font-thin text-stone-500 cursor-pointer">
                  Privacy
                  <br />
                  Terms
                  <br />
                  Security
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
