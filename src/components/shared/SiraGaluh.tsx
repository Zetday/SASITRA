"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface SiraGaluhProps {
  expression?: 'idle' | 'speaking' | 'pointing' | 'happy' | 'thinking';
  text?: string;
  className?: string;
  useGif?: boolean;
}

export const SiraGaluh: React.FC<SiraGaluhProps> = ({
  text = "",
  className = "",
  useGif = true // Default to using the 3D animated GIF mascot
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [prevText, setPrevText] = useState(text);

  // Sync state with props during render to avoid cascading renders
  if (text !== prevText) {
    setPrevText(text);
    setDisplayedText("");
    setIsTyping(!!text);
  }

  // Typewriter effect for speech bubble
  useEffect(() => {
    if (!text) return;

    let i = 0;
    const speed = 25; // ms per char

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className={`flex flex-col md:flex-row items-center md:items-end gap-6 max-w-xl ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {text && (
          <motion.div
            className="relative glass-panel-light rounded-3xl p-5 text-text-dark text-sm border-2 border-secondary/20 shadow-xl flex-1 max-w-sm order-1 md:order-0 mb-4 md:mb-12"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Bubble Tail */}
            <div className="absolute -bottom-2.5 left-1/2 md:left-auto md:-right-2.5 md:bottom-6 -translate-x-1/2 md:translate-x-0 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-10 border-t-bg-cream/70 md:border-t-transparent md:border-b-8 md:border-b-transparent md:border-l-10 md:border-l-bg-cream/70 z-10" />
            
            <p className="font-sans leading-relaxed">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Graphic (GIF or PNG) */}
      {useGif ? (
        <motion.div
          className="w-48 h-64 md:w-56 md:h-72 relative select-none shrink-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Image
            src="/assets/avatar/Sira_1.gif"
            alt="Sira Galuh Mascot"
            fill
            sizes="(max-width: 768px) 192px, 224px"
            className="object-contain drop-shadow-md"
            priority
          />
        </motion.div>
      ) : (
        <motion.div
          className="w-48 h-64 md:w-56 md:h-72 relative select-none shrink-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Image
            src="/assets/avatar/Sira_2.png"
            alt="Sira Galuh Mascot (Static)"
            fill
            sizes="(max-width: 768px) 192px, 224px"
            className="object-contain drop-shadow-md"
          />
        </motion.div>
      )}
    </div>
  );
};
