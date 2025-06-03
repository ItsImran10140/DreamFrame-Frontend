/* eslint-disable @typescript-eslint/no-explicit-any */

const FloatingBlobBackground = ({ children, className = "" }: any) => {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>

      {/* Floating blobs */}
      <div className="absolute blur-2xl inset-0">
        {/* Top-left corner blob */}
        <div
          className="absolute w-80 h-80 opacity-40 animate-pulse"
          style={{
            background: "linear-gradient(45deg, #00ff88  , #00ffff)",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            filter: "blur(2px)",
            top: "-10%",
            left: "-10%",
            animation: "float1 20s ease-in-out infinite",
          }}
        ></div>

        {/* Top-right corner blob */}
        <div
          className="absolute w-96 h-72 opacity-35"
          style={{
            background: "linear-gradient(-45deg, #00ddff  , #00ff99)",
            borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
            filter: "blur(2px)",
            top: "-5%",
            right: "-15%",
            animation: "float2 25s ease-in-out infinite",
          }}
        ></div>

        {/* Bottom-left corner blob */}
        <div
          className="absolute w-72 h-96 opacity-30"
          style={{
            background: "linear-gradient(90deg, #33ff99  , #00ffdd)",
            borderRadius: "60% 40% 70% 30% / 40% 60% 30% 70%",
            filter: "blur(2px)",
            bottom: "-8%",
            left: "-12%",
            animation: "float3 18s ease-in-out infinite",
          }}
        ></div>

        {/* Bottom-right corner blob */}
        <div
          className="absolute w-88 h-80 opacity-40"
          style={{
            background: "linear-gradient(180deg, #00ccff  , #44ff88)",
            borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%",
            filter: "blur(2px)",
            bottom: "-10%",
            right: "-8%",
            animation: "float1 22s ease-in-out infinite reverse",
          }}
        ></div>

        {/* Top-center blob */}
        <div
          className="absolute w-64 h-48 opacity-25"
          style={{
            background: "linear-gradient(0deg, #66ffcc  , #00ff77)",
            borderRadius: "50% 50% 80% 20% / 30% 70% 30% 70%",
            filter: "blur(2px)",
            top: "-3%",
            left: "45%",
            animation: "float2 15s ease-in-out infinite",
          }}
        ></div>

        {/* Right-center blob */}
        <div
          className="absolute w-56 h-72 opacity-25"
          style={{
            background: "linear-gradient(45deg, #00ff88  , #33ffaa)",
            borderRadius: "80% 20% 50% 50% / 70% 30% 70% 30%",
            filter: "blur(2px)",
            top: "35%",
            right: "-8%",
            animation: "float3 17s ease-in-out infinite",
          }}
        ></div>

        {/* Left-center blob */}
        <div
          className="absolute w-48 h-64 opacity-30"
          style={{
            background: "linear-gradient(-90deg, #00ffdd  , #22ff88)",
            borderRadius: "20% 80% 50% 50% / 30% 70% 30% 70%",
            filter: "blur(2px)",
            top: "40%",
            left: "-6%",
            animation: "float1 19s ease-in-out infinite",
          }}
        ></div>

        {/* Bottom-center blob */}
        <div
          className="absolute w-60 h-40 opacity-20"
          style={{
            background: "linear-gradient(135deg, #44ffaa , #00ddff)",
            borderRadius: "50% 50% 20% 80% / 70% 30% 70% 30%",
            filter: "blur(2px)",
            bottom: "-2%",
            left: "40%",
            animation: "float2 16s ease-in-out infinite",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* CSS animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(100px, -80px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translate(-50px, -60px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translate(-80px, 50px) rotate(270deg) scale(1.05);
          }
        }
        
        @keyframes float2 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-120px, 80px) rotate(120deg) scale(1.2);
          }
          66% {
            transform: translate(90px, -100px) rotate(240deg) scale(0.8);
          }
        }
        
        @keyframes float3 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(150px, 60px) rotate(180deg) scale(1.15);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingBlobBackground;
