"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Tradisional",
  afterLabel = "Modern",
  className = ""
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left mouse button clicked (dragging)
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none rounded-3xl border-2 border-secondary/15 shadow-xl aspect-video w-full ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleContainerClick}
      style={{ cursor: "ew-resize" }}
    >
      {/* Before Image (Left side / base) */}
      <Image
        src={beforeImage}
        alt={beforeLabel}
        fill
        sizes="(max-width: 1024px) 100vw, 800px"
        className="object-cover pointer-events-none"
        priority
      />
      <div className="absolute left-4 top-4 bg-primary text-text-light text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none shadow-md z-20">
        {beforeLabel}
      </div>

      {/* After Image (Right side / overlay) */}
      <div
        className="absolute top-0 right-0 h-full overflow-hidden z-10"
        style={{ width: `${100 - sliderPosition}%` }}
      >
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="pointer-events-none"
          style={{ 
            width: containerWidth, 
            maxWidth: "none",
            transform: "translateX(0)",
            objectFit: "cover",
            left: "auto",
            right: 0
          }}
        />
        <div className="absolute right-4 top-4 bg-secondary text-text-dark text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none shadow-md z-20">
          {afterLabel}
        </div>
      </div>

      {/* Slider Separator Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-secondary shadow-lg z-30 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary hover:bg-primary-light border-2 border-secondary rounded-full flex items-center justify-center shadow-lg transition-colors cursor-ew-resize">
          <svg
            className="w-5 h-5 text-text-light"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M8 9l-4 4 4 4m8 0l4-4-4-4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
