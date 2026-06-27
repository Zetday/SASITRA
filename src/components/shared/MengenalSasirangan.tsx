"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SiraGaluh } from "./SiraGaluh";

export const MengenalSasirangan: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  const shouldReduceMotion = useReducedMotion();

  // Transform scroll progress to animate solid path length drawing
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // State to track if mascot should be flipped horizontally
  // Reference: at top-right (start) avatar is flipped
  //            at bottom-left (end) avatar is not flipped
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Flip after midpoint so avatar faces inward toward text
      setIsFlipped(latest >= 0.5);
    });
    return () => unsubscribe();
  }, [scrollYProgress, shouldReduceMotion]);

  // Two-segment Bezier curve fitting the green line drawn by the user
  const getBezierPoint = (t: number) => {
    const clampedT = Math.max(0, Math.min(1, t));
    let x = 0;
    let y = 0;

    if (clampedT <= 0.5) {
      // First segment: P0(1120, 80) -> C1(1100, 200) -> C2(980, 350) -> P1(835, 480)
      const tSegment = clampedT * 2;
      const mt = 1 - tSegment;
      const c0 = mt * mt * mt;
      const c1 = 3 * mt * mt * tSegment;
      const c2 = 3 * mt * tSegment * tSegment;
      const c3 = tSegment * tSegment * tSegment;

      x = c0 * 1120 + c1 * 1100 + c2 * 980 + c3 * 835;
      y = c0 * 80 + c1 * 200 + c2 * 350 + c3 * 480;
    } else {
      // Second segment: P1(835, 480) -> C3(661, 636) -> C4(250, 700) -> P2(120, 750)
      const tSegment = (clampedT - 0.5) * 2;
      const mt = 1 - tSegment;
      const c0 = mt * mt * mt;
      const c1 = 3 * mt * mt * tSegment;
      const c2 = 3 * mt * tSegment * tSegment;
      const c3 = tSegment * tSegment * tSegment;

      x = c0 * 835 + c1 * 661 + c2 * 250 + c3 * 120;
      y = c0 * 480 + c1 * 636 + c2 * 700 + c3 * 750;
    }

    return {
      xPct: (x / 1200) * 100,
      yPct: (y / 800) * 100
    };
  };

  const mascotX = useTransform(scrollYProgress, (value) => `${getBezierPoint(value).xPct}%`);
  const mascotY = useTransform(scrollYProgress, (value) => `${getBezierPoint(value).yPct}%`);

  return (
    <section 
      id="sejarah"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-cover bg-top py-24 scroll-mt-navbar"
      style={{ 
        backgroundImage: `url('/assets/background/background_2.png')` 
      }}
    >
      {/* Seamless Top Blend */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg-cream via-bg-cream/80 to-transparent pointer-events-none z-10" />

      {/* Scroll-animated Dashed & Solid lines and Sira mascot in the background */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 pointer-events-none z-0 hidden lg:block">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 800" fill="none">
          {/* Background Dashed Path — top-right to bottom-left */}
          <path 
            d="M 1120 80 C 1100 200, 980 350, 835 480 C 661 636, 250 700, 120 750" 
            stroke="#C5960C" 
            strokeWidth="2" 
            strokeDasharray="6,6" 
            opacity="0.45"
            fill="none"
          />
          
          {/* Solid Drawing Overlay Path */}
          <motion.path 
            d="M 1120 80 C 1100 200, 980 350, 835 480 C 661 636, 250 700, 120 750" 
            stroke="#C5960C" 
            strokeWidth="2.5" 
            fill="none"
            style={shouldReduceMotion ? { pathLength: 1 } : { pathLength }}
          />
        </svg>

        {/* Moving Mascot Sira Galuh following the path */}
        {!shouldReduceMotion ? (
          <motion.div
            className="absolute w-48 h-64 md:w-56 md:h-72 -translate-x-1/2 translate-y-[-50%] pointer-events-none z-20"
            style={{
              left: mascotX,
              top: mascotY,
            }}
          >
            {/*
              At start (top-right, Row 1 area): flipped 
              At end (bottom-left, Row 2 area): not flipped 
            */}
            <div className={`transition-transform duration-300 ${isFlipped ? "scale-x-[1]" : "scale-x-[-1]"}`}>
              <SiraGaluh
                expression="pointing"
                useGif={false}
                text=""
              />
            </div>
          </motion.div>
        ) : null}
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center relative z-10 gap-16 md:gap-20">
        
        {/* Header with Large Ornament and Titles */}
        <div className="flex flex-col items-center text-center gap-2">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }}
            className="w-72 sm:w-[24rem] md:w-120 lg:w-xl"
          >
            <Image 
              src="/assets/decoration/sejarah_decor_1.png" 
              alt="Ornamen" 
              width={600} 
              height={150} 
              className="object-contain w-full h-auto"
              loading="lazy"
            />
          </motion.div>
          <motion.h2 
            className="font-serif font-extrabold text-4xl sm:text-5xl md:text-6xl text-primary tracking-wide uppercase mt-2"
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.1 }}
          >
            Mengenal Sasirangan
          </motion.h2>
          <motion.p 
            className="font-serif text-lg sm:text-xl text-secondary-dark italic font-semibold"
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
          >
            Warisan benua yang dijelujur menjadi cerita
          </motion.p>
        </div>

        {/* Grid Content Wrapper */}
        <div className="relative w-full flex flex-col gap-16 md:gap-24">

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10 relative">
            {/* Left: Text Block */}
            <motion.div 
              className="lg:col-span-8 border-l-4 border-secondary pl-6 text-left"
              initial={{ opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }}
            >
              <p className="font-serif text-lg md:text-xl text-text-dark/95 leading-relaxed">
                Pada mulanya, Sasirangan dikenal sebagai kain Lagundi atau kain Pamintan yang lekat dengan tradisi masyarakat Banjar. Seiring waktu, Sasirangan berkembang menjadi bagian dari gaya hidup masa kini hadir dalam busana, kerudung, tas, aksesori, dan berbagai produk kreatif tanpa kehilangan identitas Banua.
              </p>
            </motion.div>

            {/* Right Column: Static Sira Galuh on Mobile/Reduced Motion, empty placeholder on Desktop to let moving mascot be visible */}
            <div className={`lg:col-span-4 flex justify-center lg:justify-end ${shouldReduceMotion ? "lg:opacity-100 lg:pointer-events-auto" : "lg:opacity-0 lg:pointer-events-none"}`}>
              <SiraGaluh
                expression="pointing"
                useGif={false}
                text=""
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10 relative">
            {/* Left Column: Static Sira Galuh on Mobile/Reduced Motion, empty placeholder on Desktop to let moving mascot be visible */}
            <div className={`lg:col-span-4 flex justify-center lg:justify-start lg:order-1 order-2 ${shouldReduceMotion ? "lg:opacity-100 lg:pointer-events-auto" : "lg:opacity-0 lg:pointer-events-none"}`}>
              <div className="scale-x-[-1]">
                <SiraGaluh
                  expression="pointing"
                  useGif={false}
                  text=""
                />
              </div>
            </div>

            {/* Right: Text Block */}
            <motion.div 
              className="lg:col-span-8 border-r-4 border-secondary pr-6 text-right lg:order-2 order-1"
              initial={{ opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }}
            >
              <p className="font-serif text-lg md:text-xl text-text-dark/95 leading-relaxed">
                Sasirangan adalah kain khas kalimantan selatan yang diwariskan turun-temurun sejak abad ke-12, Nama &ldquo;Sasirangan&rdquo; Berasal dari kata &ldquo;sa&rdquo; yang berarti satu dan &ldquo;sirang&rdquo; yang berarti jelujur.
              </p>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};

