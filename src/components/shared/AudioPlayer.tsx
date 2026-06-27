"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Set default volume to 60% (0.6) and attempt autoplay immediately on mount
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

  return (
    <>
      {/* Hidden Audio Tag */}
      <audio 
        ref={audioRef} 
        src="/assets/sound/mbape-dictator.mp3" 
        loop 
        preload="auto"
      />

      {/* Sticky Dock Button */}
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border border-secondary-light/45 p-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all group pointer-events-auto focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
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

        {/* Dynamic Play / Pause Icon */}
        <div className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
          {isPlaying ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Play className="w-4 h-4 text-text-dark/60 ml-0.5" />
          )}
        </div>

        {/* Hover Expandable Text Label */}
        <span className="max-w-0 overflow-hidden group-hover:max-w-20 transition-all duration-300 ease-in-out whitespace-nowrap text-[9px] font-bold text-accent-brown uppercase tracking-wider text-left">
          Musik Latar
        </span>
      </button>
    </>
  );
};
