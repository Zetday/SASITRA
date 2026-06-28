"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroPage() {
  const router = useRouter();
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/assets/landingpage/Background Landing Page.mp4");
  const [videoLoop, setVideoLoop] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartJourney = () => {
    setJourneyStarted(true);
    setVideoLoop(false);
    setVideoSrc("/assets/landingpage/Window Opened.mp4");

    const fallbackTimer = setTimeout(() => {
      router.push("/home");
    }, 5900);

    return () => clearTimeout(fallbackTimer);
  };

  const handleVideoEnded = () => {
    if (videoSrc.includes("Window Opened")) {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark overflow-hidden h-screen">
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Background Video */}
          <motion.div 
            className="absolute inset-0 z-0 bg-accent-brown"
            animate={journeyStarted ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            <video
              ref={videoRef}
              key={videoSrc}
              autoPlay
              loop={videoLoop}
              muted
              playsInline
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-accent-brown/10 z-10 animate-fade-in" />
          </motion.div>

          {/* Header: Three Logos */}
          <motion.div 
            className="relative z-20 flex items-center justify-center gap-6 sm:gap-10 px-6 pt-6 w-full"
            animate={journeyStarted ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Logo 1: Kalsel */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Image
                src="/assets/logo/logo_pemkot.png"
                alt="Prov Kalsel"
                width={44}
                height={44}
                className="h-8 sm:h-11 w-auto object-contain filter drop-shadow"
              />
              <div className="flex flex-col text-[7px] sm:text-[9px] font-bold text-accent-brown uppercase tracking-wider leading-tight border-l border-accent-brown/30 pl-2">
                <span>Pemerintah</span>
                <span>Provinsi</span>
                <span>Kalimantan Selatan</span>
              </div>
            </div>

            {/* Logo 2: POLIBAN */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Image
                src="/assets/logo/logo_poliban.png"
                alt="POLIBAN"
                width={44}
                height={44}
                className="h-8 sm:h-11 w-auto object-contain filter drop-shadow"
              />
              <div className="flex flex-col text-[7px] sm:text-[9px] font-bold text-accent-brown uppercase tracking-wider leading-tight border-l border-accent-brown/30 pl-2">
                <span>Politeknik</span>
                <span>Negeri</span>
                <span>Banjarmasin</span>
              </div>
            </div>

            {/* Logo 3: KMIPN */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Image
                src="/assets/logo/logo_kmipn.png"
                alt="KMIPN"
                width={44}
                height={44}
                className="h-8 sm:h-11 w-auto object-contain filter drop-shadow"
              />
              <div className="flex flex-col text-[7px] sm:text-[9px] font-bold text-accent-brown uppercase tracking-wider leading-tight border-l border-accent-brown/30 pl-2">
                <span>Kompetisi Mahasiswa</span>
                <span>Informatika</span>
                <span>Politeknik Nasional</span>
              </div>
            </div>
          </motion.div>

          {/* Middle Section: Title, Window, Button */}
          <div className="relative z-20 flex flex-col items-center justify-center gap-8 md:gap-10 w-full max-w-xl px-6 flex-1">
            
            {/* Title SASITRA */}
            <motion.div
              className="flex flex-col items-center justify-center gap-3.5 w-full select-none"
              animate={journeyStarted ? { scale: 0.85, y: -40, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <h1 className="font-serif text-6xl sm:text-8xl font-bold tracking-normal text-primary flex items-baseline justify-center relative"
                style={{
                  WebkitTextStroke: "1px #FAF3E0",
                  filter: "drop-shadow(3px 3px 0px rgba(197, 150, 12, 0.75))"
                }}
              >
                <span>S</span>
                <span className="relative inline-block">
                  A
                  <svg className="absolute left-[38%] top-[41%] w-[24%] h-auto overflow-visible" viewBox="0 0 10 14">
                    <polygon points="5,0 9,7 5,14 1,7" fill="#C5960C" />
                  </svg>
                </span>
                <span>S</span>
                <span>I</span>
                <span>T</span>
                <span className="relative inline-block">
                  R
                  <svg className="absolute left-[65%] bottom-[-5%] w-[130%] h-auto overflow-visible pointer-events-none z-10" viewBox="0 0 50 15">
                    <defs>
                      <linearGradient id="maroon-tail-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#B22222" />
                        <stop offset="60%" stopColor="#8B1A1A" />
                        <stop offset="100%" stopColor="#5C1010" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 5 Q 20 12, 45 4 Q 30 14, 0 12" fill="url(#maroon-tail-grad)" stroke="#FAF3E0" strokeWidth="0.5" />
                  </svg>
                </span>
                <span className="relative z-10 -ml-0.5 inline-block">
                  A
                  <svg className="absolute left-[38%] top-[41%] w-[24%] h-auto overflow-visible" viewBox="0 0 10 14">
                    <polygon points="5,0 9,7 5,14 1,7" fill="#C5960C" />
                  </svg>
                </span>
              </h1>

              {/* Tagline */}
              <div className="flex items-center gap-3.5 w-full max-w-sm mt-1 justify-center px-4">
                <div className="flex-1 flex items-center gap-1.5">
                  <svg className="h-2 w-2 shrink-0 rotate-45" viewBox="0 0 10 10">
                    <rect x="2" y="2" width="6" height="6" fill="none" stroke="#C5960C" strokeWidth="1.2" />
                  </svg>
                  <div className="h-px bg-secondary flex-1 opacity-70" />
                </div>
                <span className="text-secondary font-sans text-xs sm:text-sm font-semibold tracking-wider whitespace-nowrap drop-shadow-sm">
                  Menenun Kisah Sasirangan.
                </span>
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="h-px bg-secondary flex-1 opacity-70" />
                  <svg className="h-2 w-2 shrink-0 rotate-45" viewBox="0 0 10 10">
                    <rect x="2" y="2" width="6" height="6" fill="none" stroke="#C5960C" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Window Shutter S Logo Overlay */}
            <motion.div
              className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border border-secondary/20 bg-white/20 backdrop-blur-sm p-3 flex items-center justify-center shadow-2xl -mt-2.5 group cursor-pointer"
              animate={journeyStarted ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              onClick={handleStartJourney}
            >
              <Image
                src="/assets/logo/logo_sasitra.png"
                alt="SASITRA S Logo"
                width={115}
                height={115}
                className="h-[80%] w-[80%] object-contain rounded-full transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>

            {/* Button: Mulai Perjalanan */}
            <motion.button
              onClick={handleStartJourney}
              className="relative px-8 py-3.5 text-secondary-light font-serif font-semibold text-lg tracking-wide uppercase focus:outline-none transition-all active:scale-95 group overflow-hidden mt-2"
              animate={journeyStarted ? { y: 60, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <svg className="absolute inset-0 w-full h-full text-secondary/65 group-hover:text-secondary transition-colors" viewBox="0 0 160 50" preserveAspectRatio="none">
                <rect x="2" y="2" width="156" height="46" fill="rgba(61, 28, 11, 0.65)" stroke="currentColor" strokeWidth="1.5" rx="6" />
                <polygon points="2,25 6,21 10,25 6,29" fill="currentColor" />
                <polygon points="158,25 154,21 150,25 154,29" fill="currentColor" />
                <circle cx="80" cy="2" r="1.5" fill="currentColor" />
                <circle cx="80" cy="48" r="1.5" fill="currentColor" />
              </svg>
              <span className="relative z-10 flex items-center justify-center gap-2">
                ✥ Mulai Perjalanan ✥
              </span>
            </motion.button>
          </div>

          <div className="h-10" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}