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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-20 sm:gap-28 py-8"
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
            className="relative z-20 flex items-center justify-center gap-3 sm:gap-5 px-6 pt-6 w-full"
            animate={journeyStarted ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Logo 1: Kalsel */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Image
                src="/assets/logo/logo_pemkot.png"
                alt="Prov Kalsel"
                width={60}
                height={60}
                className="h-11 sm:h-14 w-auto object-contain filter drop-shadow"
              />
              <div className="flex flex-col text-[9px] sm:text-[11px] font-bold text-accent-brown uppercase tracking-wider leading-tight border-l border-accent-brown/30 pl-2">
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
                width={60}
                height={60}
                className="h-11 sm:h-14 w-auto object-contain filter drop-shadow"
              />
              <div className="flex flex-col text-[9px] sm:text-[11px] font-bold text-accent-brown uppercase tracking-wider leading-tight border-l border-accent-brown/30 pl-2">
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
                width={60}
                height={60}
                className="h-11 sm:h-14 w-auto object-contain filter drop-shadow"
              />
              <div className="flex flex-col text-[9px] sm:text-[11px] font-bold text-accent-brown uppercase tracking-wider leading-tight border-l border-accent-brown/30 pl-2">
                <span>Kompetisi Mahasiswa</span>
                <span>Informatika</span>
                <span>Politeknik Nasional</span>
              </div>
            </div>
          </motion.div>

          {/* Middle Section: Title, Window, Button */}
          <div className="relative z-20 flex flex-col items-center justify-center gap-8 md:gap-10 w-full max-w-xl px-6">
            
            {/* Title SASITRA */}
            <motion.div
              className="flex flex-col items-center justify-center gap-3.5 w-full select-none"
              initial={{ scale: 1, y: "-5rem", opacity: 1 }}
              animate={journeyStarted 
                ? { scale: 0.85, y: "-10rem", opacity: 0 } 
                : { scale: 1, y: "-5rem", opacity: 1 }
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="relative w-80 sm:w-[32rem] md:w-[38rem] h-20 sm:h-28 md:h-[9.5rem]">
                <Image
                  src="/assets/logo/tulisan_sasitra.png"
                  alt="Sasitra"
                  fill
                  className="object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
                  priority
                />
              </div>

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
              className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full p-1 flex items-center justify-center shadow-md -mt-2.5 group cursor-pointer"
              animate={journeyStarted ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              onClick={handleStartJourney}
            >
              <Image
                src="/assets/logo/logo_sasitra_2.png"
                alt="SASITRA S Logo"
                width={140}
                height={140}
                className="h-[95%] w-[95%] object-contain rounded-full transition-transform duration-500 group-hover:scale-105"
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}