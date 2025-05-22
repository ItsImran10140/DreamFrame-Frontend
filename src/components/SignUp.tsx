const SignUp = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/hv.mp4" type="video/mp4" />
        {/* Fallback message instead of broken image */}
        Your browser does not support the video tag.
      </video>
      <div className="relative z-20 flex bg-[#0C0C0C]/60 items-center justify-center min-h-screen text-white"></div>
    </div>
  );
};

export default SignUp;
