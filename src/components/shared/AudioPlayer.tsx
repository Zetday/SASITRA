"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronsDown, Mouse, Maximize2, Minimize2 } from "lucide-react";

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<0 | 1 | 2 | 3>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Set default volume to 30% and attempt autoplay immediately on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch((err) => {
          console.log("Instant autoplay blocked by browser, waiting for user interaction: ", err);
        });
    }
  }, []);

  // Attempt to play audio on first user interaction (bypass autoplay browser block)
  useEffect(() => {
    const handleInteraction = () => {
      if (audioRef.current && !isPlaying && !hasInteracted) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch((err) => {
            console.log("Autoplay blocked by browser. User needs to toggle manually: ", err);
          });
      }
      // Remove listener once interaction has happened
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [isPlaying, hasInteracted]);

  // Autoplay smooth scroll logic with adjustable speed
  useEffect(() => {
    if (scrollSpeed === 0) return;

    let scrollInterval: ReturnType<typeof setInterval>;
    
    // Choose step multiplier based on speed level (1x = 1.2px, 2x = 2.4px, 3x = 3.8px)
    const speedMultiplier = scrollSpeed === 1 ? 1.2 : scrollSpeed === 2 ? 2.4 : 3.8;

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        window.scrollBy({ top: speedMultiplier, behavior: "auto" });

        // If reached bottom, stop auto-scrolling
        if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) {
          setScrollSpeed(0);
        }
      }, 18);
    };

    startScroll();

    // Auto-stop scrolling only on manual scroll wheel or touch swipe actions
    const stopOnUserScroll = () => {
      setScrollSpeed(0);
    };

    window.addEventListener("wheel", stopOnUserScroll, { passive: true });
    window.addEventListener("touchmove", stopOnUserScroll, { passive: true });

    return () => {
      clearInterval(scrollInterval);
      window.removeEventListener("wheel", stopOnUserScroll);
      window.removeEventListener("touchmove", stopOnUserScroll);
    };
  }, [scrollSpeed]);

  // Listen to fullscreen changes to update UI state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback failed: ", err));
    }
    setHasInteracted(true);
  };

  const cycleScrollSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScrollSpeed((prev) => (prev === 3 ? 0 : ((prev + 1) as 0 | 1 | 2 | 3)));
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      {/* Hidden Audio Tag */}
      <audio 
        ref={audioRef} 
        src="/assets/sound/mbape-dictator.mp3" 
        loop 
        preload="auto"
      />

      {/* Unified HUD Control Center */}
      <div className="autoplay-dock fixed bottom-6 left-6 z-50 bg-[#FFFDF9]/30 backdrop-blur-md border border-secondary-light/25 px-6 py-3 rounded-full shadow-2xl flex items-center gap-5.5 select-none pointer-events-auto transition-all">
        
        {/* 1. MUSIC CONTROL */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-text-dark/80 hover:text-primary focus:outline-hidden"
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {/* Equalizer Visualizer Bars */}
          <div className="flex items-center gap-0.5 h-4 w-4 justify-center" aria-hidden="true">
            {isPlaying ? (
              <>
                <motion.div 
                  className="w-[2.5px] bg-primary rounded-full" 
                  animate={{ height: [4, 14, 4] }} 
                  transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} 
                />
                <motion.div 
                  className="w-[2.5px] bg-primary rounded-full" 
                  animate={{ height: [6, 11, 6] }} 
                  transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.15 }} 
                />
                <motion.div 
                  className="w-[2.5px] bg-primary rounded-full" 
                  animate={{ height: [3, 13, 3] }} 
                  transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut", delay: 0.3 }} 
                />
                <motion.div 
                  className="w-[2.5px] bg-primary rounded-full" 
                  animate={{ height: [7, 4, 7] }} 
                  transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 0.15 }} 
                />
              </>
            ) : (
              <>
                <div className="w-[2.5px] h-1.5 bg-text-dark/40 rounded-full" />
                <div className="w-[2.5px] h-2 bg-text-dark/40 rounded-full" />
                <div className="w-[2.5px] h-1 bg-text-dark/40 rounded-full" />
                <div className="w-[2.5px] h-1.5 bg-text-dark/40 rounded-full" />
              </>
            )}
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-dark/85">
            {isPlaying ? "SOUND ON" : "SOUND OFF"}
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-secondary-light/45" />

        {/* 2. AUTO SCROLL CONTROL */}
        <button
          onClick={cycleScrollSpeed}
          className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-text-dark/80 hover:text-primary focus:outline-hidden"
          aria-label="Toggle auto scroll speed"
        >
          <div className="w-5 h-5 flex items-center justify-center relative" aria-hidden="true">
            {scrollSpeed > 0 ? (
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <ChevronsDown className="w-4 h-4 text-primary" />
              </motion.div>
            ) : (
              <Mouse className="w-4 h-4 text-text-dark/60" />
            )}
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-dark/85">
            {scrollSpeed === 0 ? "AUTO SCROLL" : `SCROLL: ${scrollSpeed}x`}
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-secondary-light/45" />

        {/* 3. FULLSCREEN CONTROL */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-text-dark/80 hover:text-primary focus:outline-hidden"
          aria-label="Toggle fullscreen"
        >
          <div className="w-4 h-4 flex items-center justify-center" aria-hidden="true">
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-primary" />
            ) : (
              <Maximize2 className="w-4 h-4 text-text-dark/60" />
            )}
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-dark/85">
            {isFullscreen ? "MINIMIZE" : "FULLSCREEN"}
          </span>
        </button>

      </div>
    </>
  );
};
