/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";

type OrbitalSliderItem = {
  id?: string | number;
  image?: string;
  color?: string;
  title?: string;
  description?: string;
  content?: React.ReactNode;
};

type OrbitalSliderProps = {
  items?: OrbitalSliderItem[];
  radius?: number;
  speed?: number;
  cardWidth?: number;
  cardHeight?: number;
  tiltAngle?: number;
  className?: string;
};

export const OrbitalSlider: React.FC<OrbitalSliderProps> = ({
  items = [],
  radius = 400,
  speed = 0.3,
  cardWidth = 320,
  cardHeight = 384,
  tiltAngle = -25,
  className = "",
}) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const animate = () => {
      setRotation((prev) => prev + speed);
    };

    const animationFrame = setInterval(animate, 16);

    return () => clearInterval(animationFrame);
  }, [speed]);

  const getSlideStyles = (index: any) => {
    const totalSlides = items.length;
    const baseAngle = (index * 360) / totalSlides;
    const currentAngle = baseAngle + rotation;

    const x = Math.sin((currentAngle * Math.PI) / 180) * radius;
    const z = Math.cos((currentAngle * Math.PI) / 180) * radius;

    const normalizedZ = (z + radius) / (2 * radius);
    const scale = 0.6 + normalizedZ * 0.4;
    const opacity = 0.4 + normalizedZ * 0.6;

    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
      opacity: opacity,
      zIndex: Math.round(normalizedZ * 10),
    };
  };

  if (!items || items.length === 0) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <p className="text-white text-lg">No items to display</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-visible ${className}`}
    >
      <div className="relative w-full h-full">
        {/* 3D Container with perspective */}
        <div
          className="relative w-full h-full"
          style={{
            perspective: "1500px",
            perspectiveOrigin: "50% 30%",
          }}
        >
          {/* Tilted container */}
          <div
            className="relative w-full h-full preserve-3d"
            style={{
              transform: `rotateX(${tiltAngle}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="absolute rounded-xl shadow-2xl overflow-hidden"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  ...getSlideStyles(index),
                }}
              >
                {/* Background Image or Color */}
                {item.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  </div>
                ) : (
                  <div
                    className={`absolute inset-0 ${
                      item.color ||
                      "bg-gradient-to-br from-gray-600 to-gray-800"
                    }`}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
                  {item.title && (
                    <h2 className="text-2xl font-bold mb-3 text-shadow">
                      {item.title}
                    </h2>
                  )}
                  {item.description && (
                    <p className="text-sm leading-relaxed opacity-90 text-shadow">
                      {item.description}
                    </p>
                  )}

                  {/* Custom content */}
                  {item.content && <div className="mt-4">{item.content}</div>}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full opacity-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
