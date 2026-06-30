"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "../../components/shared/Navbar";
import { MengenalSasirangan } from "../../components/shared/MengenalSasirangan";
import { ProsesPembuatan } from "../../components/shared/ProsesPembuatan";
import { MotifPreview } from "../../components/shared/MotifPreview";
import { MotifLainnya } from "../../components/shared/MotifLainnya";
import { SasiranganMasaKini } from "../../components/shared/SasiranganMasaKini";
import { AudioPlayer } from "../../components/shared/AudioPlayer";

export default function HomePage() {

  const shouldReduceMotion = useReducedMotion();

  // Sira speech bubble typewriter state
  const [siraPart1, setSiraPart1] = useState(shouldReduceMotion ? "Halo, saya Sira!" : "");
  const [siraPart2, setSiraPart2] = useState(shouldReduceMotion ? "Yuk, jelajahi dunia" : "");
  const [siraPart3, setSiraPart3] = useState(shouldReduceMotion ? "Sasirangan" : "");
  const [siraPart4, setSiraPart4] = useState(shouldReduceMotion ? "bersama Saya!" : "");
  const [siraStage, setSiraStage] = useState(shouldReduceMotion ? 5 : 0); // 0 = wait, 1-4 = typing, 5 = done


  useEffect(() => {
    if (shouldReduceMotion) {
      const timer = setTimeout(() => {
        setSiraStage(5);
      }, 0);
      return () => clearTimeout(timer);
    }

    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const startTyping = async () => {
      // Delay before Sira starts speaking (wait for page entry and tagline fade-in)
      await new Promise((resolve) => {
        timerId = setTimeout(resolve, 1400);
      });
      if (!isMounted) return;

      // Start Sira speech bubble typing
      setSiraStage(1);
      const p1 = "Halo, saya Sira!";
      for (let i = 0; i <= p1.length; i++) {
        setSiraPart1(p1.slice(0, i));
        await new Promise((resolve) => { timerId = setTimeout(resolve, 25); });
        if (!isMounted) return;
      }

      setSiraStage(2);
      const p2 = "Yuk, jelajahi dunia";
      for (let i = 0; i <= p2.length; i++) {
        setSiraPart2(p2.slice(0, i));
        await new Promise((resolve) => { timerId = setTimeout(resolve, 25); });
        if (!isMounted) return;
      }

      setSiraStage(3);
      const p3 = "Sasirangan";
      for (let i = 0; i <= p3.length; i++) {
        setSiraPart3(p3.slice(0, i));
        await new Promise((resolve) => { timerId = setTimeout(resolve, 35); });
        if (!isMounted) return;
      }

      setSiraStage(4);
      const p4 = "bersama Saya!";
      for (let i = 0; i <= p4.length; i++) {
        setSiraPart4(p4.slice(0, i));
        await new Promise((resolve) => { timerId = setTimeout(resolve, 25); });
        if (!isMounted) return;
      }
      setSiraStage(5);
    };

    startTyping();

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [shouldReduceMotion]);

  // Scroll spy state to highlight 'Sejarah' navbar link on scrolling past welcome screen
  const [activeOverride, setActiveOverride] = useState<string | undefined>(undefined);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleAutoScroll = () => {
    const nextSection = document.getElementById("sejarah");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }

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
          <div className="max-w-7xl mx-auto px-4 lg:px-6 lg:pl-12 xl:pl-16 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 items-center relative z-20 pt-16 lg:pt-20">
            {/* Left Welcome Content */}
            <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-3 md:gap-4 xl:gap-6 text-center md:text-left justify-center lg:justify-start">
              <motion.div 
                className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-44 xl:h-44 2xl:w-52 2xl:h-52 relative shrink-0"
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
                  className="font-sans text-base md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl text-[#A37F55] font-semibold leading-none mb-1"
                  initial={{ x: shouldReduceMotion ? 0 : -30, opacity: shouldReduceMotion ? 1 : 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5, duration: 0.6 }}
                >
                  Selamat Datang di
                </motion.span>
                 <motion.h1 
                  className="font-serif font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-[#3D1A5A] tracking-tight leading-none whitespace-nowrap"
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
          <div className="absolute right-0 bottom-0 z-20 flex-row items-end gap-0 pointer-events-none select-none pr-0 hidden lg:flex overflow-visible">
            {/* Speech Bubble */}
            <motion.div
              className="relative border-2 border-secondary-light p-0.5 rounded-[2.75rem] bg-transparent shadow-xl mb-56 lg:mb-64 xl:mb-80 2xl:mb-108 -mr-5 lg:-mr-7 xl:-mr-10 z-30 pointer-events-auto shrink-0 sira-bubble-container"
              initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.8, duration: 0.5 }}
            >
              <div className="border border-secondary-light rounded-[2.6rem] bg-[#FFFDF9] px-7 py-4 flex flex-col items-center justify-center text-center shadow-inner">
                <p className="font-sans text-sm md:text-base text-text-dark font-medium leading-relaxed select-none">
                  {siraStage >= 1 && (
                    <>
                      <motion.span 
                        className="inline-block text-secondary mr-1"
                        animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      >
                        ✧
                      </motion.span> 
                      {siraStage === 1 ? siraPart1 : <>Halo, saya <span className="font-serif font-bold text-secondary-dark">Sira</span>!</>}
                      {siraStage >= 1 && (
                        <motion.span 
                          className="inline-block text-secondary ml-1"
                          animate={{ scale: [1, 1.25, 1], rotate: [0, -15, 15, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.4 }}
                        >
                          ✧
                        </motion.span>
                      )}
                    </>
                  )}
                  
                  {siraStage >= 2 && (
                    <>
                      <br />
                      {siraPart2}
                    </>
                  )}

                  {siraStage >= 3 && (
                    <>
                      <br />
                      {siraStage === 3 ? (
                        <span className="font-serif font-bold text-lg md:text-xl text-[#713034]">
                          {siraPart3}
                        </span>
                      ) : (
                        <span className="font-serif font-extrabold text-2xl md:text-3xl bg-linear-to-r from-[#713034] via-[#A97340] to-secondary bg-clip-text text-transparent block my-1.5 tracking-wider drop-shadow-xs">
                          Sasirangan
                        </span>
                      )}
                    </>
                  )}

                  {siraStage >= 4 && (
                    <>
                      {" "}{siraPart4}
                    </>
                  )}

                  {siraStage > 0 && siraStage < 5 && (
                    <span className="inline-flex gap-1 ml-2 items-center">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
                    </span>
                  )}
                </p>
              </div>
              {/* Speech Bubble Tail pointing right to Sira */}
              <div className="absolute -right-2.5 bottom-[40%] w-5 h-5 bg-[#FFFDF9] border-r border-b border-secondary-light -rotate-45 z-10" />
            </motion.div>

            {/* Sira Avatar */}
            <motion.div
              className="w-64 h-130 md:w-80 md:h-160 lg:w-80 lg:h-128 xl:w-96 xl:h-160 2xl:w-120 2xl:h-200 relative shrink-0 sira-mascot-container"
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Image
                src="/assets/avatar/Sira_1.png"
                alt="Sira Galuh Mascot"
                fill
                className="object-contain object-bottom drop-shadow-md"
                priority
              />
            </motion.div>
          </div>

          {/* Bottom Mouse Scroll indicator */}
          <div 
            onClick={handleAutoScroll}
            className={`absolute bottom-28 left-0 right-0 flex flex-col items-center justify-center gap-1.5 text-[9px] font-bold text-accent-brown/60 uppercase tracking-widest cursor-pointer select-none z-20 transition-all duration-500 hover:scale-105 hover:text-accent-brown ${
              hasScrolled ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100"
            }`}
            title="Klik untuk gulir ke bawah"
          >
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

