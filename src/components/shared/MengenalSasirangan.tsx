"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SiraGaluh } from "./SiraGaluh";

export const MengenalSasirangan: React.FC = () => {
  const section1Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: section1Ref,
    offset: ["start end", "end start"]
  });

  const section2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"]
  });

  const shouldReduceMotion = useReducedMotion();

  // Scroll animations for Section 1
  const headerY = useTransform(scrollYProgress1, [0, 0.4, 0.8, 1], [80, 0, -40, -80]);
  const headerOpacity = useTransform(scrollYProgress1, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const text1X = useTransform(scrollYProgress1, [0, 0.4, 0.8, 1], [-80, 0, 0, -40]);
  const text1Rotate = useTransform(scrollYProgress1, [0, 0.4, 0.8, 1], [-2, 0, 0, 1.5]);
  const text1Opacity = useTransform(scrollYProgress1, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const mascot1Y = useTransform(scrollYProgress1, [0, 0.4, 0.8, 1], [60, 0, 0, -60]);
  const mascot1Rotate = useTransform(scrollYProgress1, [0, 0.4, 0.8, 1], [3, 0, 0, -2]);
  const mascot1Opacity = useTransform(scrollYProgress1, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Scroll animations for Section 2
  const text2X = useTransform(scrollYProgress2, [0, 0.4, 0.8, 1], [80, 0, 0, 40]);
  const text2Rotate = useTransform(scrollYProgress2, [0, 0.4, 0.8, 1], [2, 0, 0, -1.5]);
  const text2Opacity = useTransform(scrollYProgress2, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const mascot2Y = useTransform(scrollYProgress2, [0, 0.4, 0.8, 1], [60, 0, 0, -60]);
  const mascot2Rotate = useTransform(scrollYProgress2, [0, 0.4, 0.8, 1], [-3, 0, 0, 2]);
  const mascot2Opacity = useTransform(scrollYProgress2, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const highlightY = useTransform(scrollYProgress2, [0.2, 0.5, 0.8, 1], [50, 0, 0, -30]);
  const highlightScale = useTransform(scrollYProgress2, [0.2, 0.5, 0.8, 1], [0.95, 1, 1, 0.95]);
  const highlightOpacity = useTransform(scrollYProgress2, [0.2, 0.4, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
      className="relative w-full bg-transparent"
      style={{
        backgroundImage: "url('/assets/background/background_2.1.png'), url('/assets/background/background_2.2.png')",
        backgroundPosition: "top center, top 54vw center",
        backgroundSize: "100% 54vw, 100% 54vw",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
      {/* SECTION 1: Mengenal Sasirangan (Sejarah Mulanya) */}
      <section 
        id="sejarah"
        ref={section1Ref}
        className="relative min-h-screen lg:min-h-0 lg:h-[54vw] w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-top py-24 lg:py-0 scroll-mt-navbar bg-no-repeat bg-[url('/assets/background/background_2.1.png')] lg:bg-none"
      >
        {/* Seamless Top Blend */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg-cream via-bg-cream/80 to-transparent pointer-events-none z-10" />

        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center justify-between relative z-10 lg:h-full lg:py-16 gap-10 lg:gap-0">
          
          {/* Header with Large Ornament and Titles */}
          <motion.div 
            className="flex flex-col items-center text-center gap-2 select-none"
            style={shouldReduceMotion ? {} : { y: headerY, opacity: headerOpacity }}
          >
            <div className="w-72 sm:w-[24rem] md:w-120 lg:w-[28rem] xl:w-xl">
              <Image 
                src="/assets/decoration/sejarah_decor_1.png" 
                alt="Ornamen" 
                width={600} 
                height={150} 
                className="object-contain w-full h-auto"
                priority
              />
            </div>
            <h2 className="font-serif font-extrabold text-4xl sm:text-5xl md:text-6xl text-primary tracking-wide uppercase mt-2">
              Mengenal Sasirangan
            </h2>
            <p className="font-serif text-lg sm:text-xl text-secondary-dark italic font-semibold">
              Warisan benua yang dijelujur menjadi cerita
            </p>
          </motion.div>

          {/* Section 1 Content Row (Text Left, Mascot Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10 relative">
            {/* Left: Text Block */}
            <motion.div 
              className="lg:col-span-8 border-l-4 border-secondary pl-6 text-left origin-left"
              style={shouldReduceMotion ? {} : { x: text1X, rotate: text1Rotate, opacity: text1Opacity }}
            >
              <p className="font-serif text-lg md:text-xl lg:text-2xl text-text-dark/95 leading-relaxed select-text">
                Pada mulanya, Sasirangan dikenal sebagai kain Lagundi atau kain Pamintan yang lekat dengan tradisi masyarakat Banjar. Seiring waktu, Sasirangan berkembang menjadi bagian dari gaya hidup masa kini hadir dalam busana, kerudung, tas, aksesori, dan berbagai produk kreatif tanpa kehilangan identitas Banua.
              </p>
            </motion.div>

            {/* Right: Sira Mascot pointing left */}
            <motion.div 
              className="lg:col-span-4 flex justify-center lg:justify-end origin-bottom"
              style={shouldReduceMotion ? {} : { y: mascot1Y, rotate: mascot1Rotate, opacity: mascot1Opacity }}
            >
              <div className="scale-x-[-1]">
                <SiraGaluh
                  expression="pointing"
                  useGif={false}
                  text=""
                />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Arti Sasirangan & Indikasi Geografis */}
      <section 
        ref={section2Ref}
        className="relative min-h-screen lg:min-h-0 lg:h-[54vw] w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-top py-24 lg:py-0 bg-no-repeat bg-[url('/assets/background/background_2.2.png')] lg:bg-none"
      >
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center justify-between relative z-10 lg:h-full lg:py-16 gap-10 lg:gap-0">
          
          {/* Section 2 Content Row (Mascot Left Flipped, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10 relative">
            {/* Left: Sira Mascot pointing right (flipped) */}
            <motion.div 
              className="lg:col-span-4 flex justify-center lg:justify-start lg:order-1 order-2 origin-bottom"
              style={shouldReduceMotion ? {} : { y: mascot2Y, rotate: mascot2Rotate, opacity: mascot2Opacity }}
            >
                <SiraGaluh
                  expression="pointing"
                  useGif={false}
                  text=""
                />        
            </motion.div>

            {/* Right: Text Block */}
            <motion.div 
              className="lg:col-span-8 border-r-4 border-secondary pr-6 text-right lg:order-2 order-1 origin-right"
              style={shouldReduceMotion ? {} : { x: text2X, rotate: text2Rotate, opacity: text2Opacity }}
            >
              <p className="font-serif text-lg md:text-xl lg:text-2xl text-text-dark/95 leading-relaxed select-text">
                Sasirangan adalah kain khas kalimantan selatan yang diwariskan turun-temurun sejak abad ke-12, Nama &ldquo;Sasirangan&rdquo; Berasal dari kata &ldquo;sa&rdquo; yang berarti satu dan &ldquo;sirang&rdquo; yang berarti jelujur.
              </p>
            </motion.div>
          </div>

          {/* Section 2 Bottom Highlight Text & Ornament Divider */}
          <motion.div
            className="flex flex-col items-center text-center mt-4 w-full max-w-4xl px-4 origin-center"
            style={shouldReduceMotion ? {} : { y: highlightY, scale: highlightScale, opacity: highlightOpacity }}
          >
            <p className="font-sans text-xl md:text-2xl text-text-dark/90 font-medium leading-relaxed tracking-wide select-text">
              Sejak <span className="text-[#8B1A1A] font-bold">7 Juni 2024</span>, Sasirangan resmi menyandang <span className="text-[#8B1A1A] font-bold">Indikasi Geografis Kalimantan Selatan</span>.
            </p>
            
            {/* Decorative center divider */}
            <div className="flex items-center justify-center gap-3 w-full mt-10 select-none">
              <div className="w-24 h-px bg-linear-to-r from-transparent to-secondary" />
              <span className="text-secondary text-xs">◆</span>
              <div className="w-24 h-px bg-linear-to-l from-transparent to-secondary" />
            </div>
          </motion.div>

        </div>

      </section>
    </div>
  );
};
