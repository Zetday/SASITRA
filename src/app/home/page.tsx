"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";
import { MengenalSasirangan } from "../../components/shared/MengenalSasirangan";
import { ProsesPembuatan } from "../../components/shared/ProsesPembuatan";
import { MotifPreview } from "../../components/shared/MotifPreview";
import { MotifLainnya } from "../../components/shared/MotifLainnya";
import { SasiranganMasaKini } from "../../components/shared/SasiranganMasaKini";
import { AudioPlayer } from "../../components/shared/AudioPlayer";

export default function HomePage() {

  const shouldReduceMotion = useReducedMotion();

  // Typewriter effect state for tagline
  const taglineLine1 = "Tempat tradisi, keindahan, dan kreativitas";
  const taglineLine2 = "berpadu dalam setiap helai kain";
  const [displayedLine1, setDisplayedLine1] = useState(shouldReduceMotion ? taglineLine1 : "");
  const [displayedLine2, setDisplayedLine2] = useState(shouldReduceMotion ? taglineLine2 : "");
  const [activeLine, setActiveLine] = useState(shouldReduceMotion ? 0 : 1); // 1 = typing line 1, 2 = typing line 2, 0 = done

  useEffect(() => {
    if (shouldReduceMotion) {
      // Defer state updates to avoid synchronous cascading renders inside effect
      const timer = setTimeout(() => {
        setDisplayedLine1(taglineLine1);
        setDisplayedLine2(taglineLine2);
        setActiveLine(0);
      }, 0);
      return () => clearTimeout(timer);
    }

    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const startTyping = async () => {
      // Delay before typing starts (wait for page fade-in)
      await new Promise((resolve) => {
        timerId = setTimeout(resolve, 800);
      });
      if (!isMounted) return;

      // Type line 1
      for (let i = 0; i <= taglineLine1.length; i++) {
        setDisplayedLine1(taglineLine1.slice(0, i));
        await new Promise((resolve) => {
          timerId = setTimeout(resolve, 35);
        });
        if (!isMounted) return;
      }

      // Brief pause between lines
      await new Promise((resolve) => {
        timerId = setTimeout(resolve, 300);
      });
      if (!isMounted) return;
      setActiveLine(2);

      // Type line 2
      for (let i = 0; i <= taglineLine2.length; i++) {
        setDisplayedLine2(taglineLine2.slice(0, i));
        await new Promise((resolve) => {
          timerId = setTimeout(resolve, 35);
        });
        if (!isMounted) return;
      }

      // Finish typing (wait a bit before hiding cursor)
      await new Promise((resolve) => {
        timerId = setTimeout(resolve, 1500);
      });
      if (!isMounted) return;
      setActiveLine(0);
    };

    startTyping();

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [shouldReduceMotion]);

  // Scroll spy state to highlight 'Sejarah' navbar link on scrolling past welcome screen
  const [activeOverride, setActiveOverride] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition >= window.innerHeight * 0.6) {
        setActiveOverride("/home#sejarah");
      } else {
        setActiveOverride(undefined);
      }
    };
    // Added passive event listener for scroll performance - client-passive-event-listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark">
      <Navbar activeOverride={activeOverride} />

      {/* Main Welcome Screen Section */}
      <div className="flex-1 flex flex-col">
        {/* Welcome Screen */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-cover bg-bottom animate-fade-in"
          style={{ 
            backgroundImage: `url('/assets/background/background_1.png')` 
          }}
        >
          <div className="absolute inset-0 bg-jelujur-pattern opacity-[0.03] pointer-events-none" />

          {/* Top Left Tagline */}
          <div className="absolute top-28 left-6 md:left-12 lg:left-24 max-w-sm md:max-w-xl pointer-events-none z-30">
            <motion.p 
              className="font-serif text-sm md:text-base lg:text-lg text-text-dark/85 leading-relaxed font-light min-h-[3em]"
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2, duration: 0.8 }}
            >
              {displayedLine1}
              {activeLine === 1 && (
                <motion.span 
                  className="inline-block w-0.5 h-[1.1em] bg-accent-brown ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
              )}
              <br className="hidden md:block" />
              {displayedLine2}
              {activeLine === 2 && (
                <motion.span 
                  className="inline-block w-0.5 h-[1.1em] bg-accent-brown ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
              )}
            </motion.p>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:pl-16 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20 pt-20">
            {/* Left Welcome Content */}
            <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left justify-center lg:justify-start">
              <motion.div 
                className="w-28 h-28 md:w-36 md:h-36 lg:w-52 lg:h-52 relative shrink-0"
                initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: shouldReduceMotion ? 1 : 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.6 }}
              >
                <Image 
                  src="/assets/logo/logo_sasitra.png" 
                  alt="Logo Sasitra" 
                  fill 
                  className="object-contain"
                  priority 
                />
              </motion.div>
              
              <div className="flex flex-col gap-1 items-center md:items-start">
                <motion.span 
                  className="font-serif text-xl md:text-2xl lg:text-3xl text-[#A37F55] font-semibold leading-none mb-1"
                  initial={{ x: shouldReduceMotion ? 0 : -30, opacity: shouldReduceMotion ? 1 : 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5, duration: 0.6 }}
                >
                  Selamat Datang di
                </motion.span>
                 <motion.h1 
                  className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#3D1A5A] tracking-tight leading-none whitespace-nowrap"
                  style={{ whiteSpace: "nowrap" }}
                  initial={{ x: shouldReduceMotion ? 0 : -30, opacity: shouldReduceMotion ? 1 : 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.6, duration: 0.6 }}
                >
                  Dunia Sasirangan
                </motion.h1>
                
                {/* Decoration under text */}
                <motion.div 
                  className="mt-3 w-full flex justify-center md:justify-start"
                  initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: shouldReduceMotion ? 1 : 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.7, duration: 0.6 }}
                >
                  <Image 
                    src="/assets/decoration/beranda_decor_1.png" 
                    alt="Dekorasi Beranda 1" 
                    width={700} 
                    height={30} 
                    className="object-contain"
                    priority 
                  />
                </motion.div>
              </div>
            </div>

            {/* Empty space in grid to leave room for the absolute mascot */}
            <div className="lg:col-span-5 hidden lg:block h-full" />
          </div>

          {/* Absolute Positioned Mascot Sira Galuh at the bottom-right of the screen */}
          <div className="absolute right-0 bottom-0 z-20 flex flex-row items-end gap-0 pointer-events-none select-none pr-0 hidden lg:flex">
            {/* Speech Bubble */}
            <motion.div
              className="relative border-2 border-secondary-light p-0.5 rounded-[2.75rem] bg-transparent shadow-xl mb-102.5 lg:mb-112.5 -mr-7 lg:-mr-10 z-30 pointer-events-auto shrink-0"
              initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.8, duration: 0.5 }}
            >
              <div className="border border-secondary-light rounded-[2.6rem] bg-[#FFFDF9] px-7 py-4 flex flex-col items-center justify-center text-center shadow-inner">
                <p className="font-sans text-sm md:text-base text-text-dark font-medium leading-relaxed">
                  <span className="text-secondary mr-1">✧</span> Halo, saya Sira! <span className="text-secondary ml-1">✧</span>
                  <br />
                  Yuk, jelajahi dunia
                  <br />
                  <span className="font-serif font-bold text-lg md:text-xl text-secondary-dark block my-0.5">Sasirangan</span>
                  bersama Saya!
                </p>
              </div>
              {/* Speech Bubble Tail pointing right to Sira */}
              <div className="absolute -right-2.5 bottom-[40%] w-5 h-5 bg-[#FFFDF9] border-r border-b border-secondary-light -rotate-45 z-10" />
            </motion.div>

            {/* Sira Avatar */}
            <motion.div
              className="w-64 h-130 md:w-80 md:h-160 lg:w-120 lg:h-200 relative shrink-0"
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Image
                src="/assets/avatar/Sira_1.gif"
                alt="Sira Galuh Mascot"
                fill
                className="object-contain object-bottom drop-shadow-md"
                priority
              />
            </motion.div>
          </div>

          {/* Bottom Mouse Scroll indicator */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center gap-1.5 text-[9px] font-bold text-accent-brown/60 uppercase tracking-widest pointer-events-none select-none z-20">
            <div className="w-6 h-10 rounded-full border-2 border-accent-brown/45 flex justify-center pt-2">
              <motion.div
                className="w-1 h-2.5 bg-accent-brown rounded-full"
                animate={shouldReduceMotion ? {} : { y: [0, 6, 0], opacity: [1, 0, 1] }}
                transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </div>
            <span>Gulir untuk memulai Perjalanan</span>
          </div>

          {/* Seamless Bottom Blend */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg-cream via-bg-cream/80 to-transparent pointer-events-none z-10" />
        </section>

        {/* Mengenal Sasirangan Section Component */}
        <MengenalSasirangan />

        {/* Proses Pembuatan Section Component */}
        <ProsesPembuatan />

        {/* Motif Preview Section Component */}
        <MotifPreview />

        {/* Continuous Background Wrapper for Motif Lainnya & Sasirangan di Masa Kini */}
        <div 
          className="relative w-full bg-bg-cream"
          style={{
            backgroundImage: `url('/assets/background/background_5.png'), url('/assets/background/background_6.png')`,
            backgroundPosition: 'top center, top 56.25vw center',
            backgroundSize: '100% auto, 100% auto',
            backgroundRepeat: 'no-repeat, no-repeat',
          }}
        >
          {/* Motif Lainnya Section Component */}
          <MotifLainnya />

          {/* Sasirangan di Masa Kini Section Component */}
          <SasiranganMasaKini />
        </div>
        <AudioPlayer />
      </div>
    </div>
  );
}

