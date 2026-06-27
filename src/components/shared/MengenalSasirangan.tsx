"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SiraGaluh } from "./SiraGaluh";

export const MengenalSasirangan: React.FC = () => {
  return (
    <div 
      className="relative w-full bg-transparent"
      style={{
        backgroundImage: "url('/assets/background/background_2.1.png'), url('/assets/background/background_2.2.png')",
        backgroundPosition: "top center, top 56.25vw center",
        backgroundSize: "100% auto, 100% auto",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
      {/* SECTION 1: Mengenal Sasirangan (Sejarah Mulanya) */}
      <section 
        id="sejarah"
        className="relative min-h-screen lg:min-h-0 lg:h-[56.25vw] w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-top py-24 lg:py-0 scroll-mt-navbar bg-no-repeat lg:bg-none"
        style={{ 
          backgroundImage: `url('/assets/background/background_2.1.png')` 
        }}
      >
        {/* Seamless Top Blend */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg-cream via-bg-cream/80 to-transparent pointer-events-none z-10" />

        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center relative z-10 gap-16 lg:gap-12 xl:gap-20">
          
          {/* Header with Large Ornament and Titles */}
          <div className="flex flex-col items-center text-center gap-2 select-none">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-72 sm:w-[24rem] md:w-120 lg:w-[28rem] xl:w-xl"
            >
              <Image 
                src="/assets/decoration/sejarah_decor_1.png" 
                alt="Ornamen" 
                width={600} 
                height={150} 
                className="object-contain w-full h-auto"
                priority
              />
            </motion.div>
            <motion.h2 
              className="font-serif font-extrabold text-4xl sm:text-5xl md:text-6xl text-primary tracking-wide uppercase mt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Mengenal Sasirangan
            </motion.h2>
            <motion.p 
              className="font-serif text-lg sm:text-xl text-secondary-dark italic font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Warisan benua yang dijelujur menjadi cerita
            </motion.p>
          </div>

          {/* Section 1 Content Row (Text Left, Mascot Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10 relative">
            {/* Left: Text Block */}
            <motion.div 
              className="lg:col-span-8 border-l-4 border-secondary pl-6 text-left"
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-serif text-lg md:text-xl text-text-dark/95 leading-relaxed select-text">
                Pada mulanya, Sasirangan dikenal sebagai kain Lagundi atau kain Pamintan yang lekat dengan tradisi masyarakat Banjar. Seiring waktu, Sasirangan berkembang menjadi bagian dari gaya hidup masa kini hadir dalam busana, kerudung, tas, aksesori, dan berbagai produk kreatif tanpa kehilangan identitas Banua.
              </p>
            </motion.div>

            {/* Right: Sira Mascot pointing left */}
            <motion.div 
              className="lg:col-span-4 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SiraGaluh
                expression="pointing"
                useGif={false}
                text=""
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Arti Sasirangan & Indikasi Geografis */}
      <section 
        className="relative min-h-screen lg:min-h-0 lg:h-[56.25vw] w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-top py-24 lg:py-0 bg-no-repeat lg:bg-none"
        style={{ 
          backgroundImage: `url('/assets/background/background_2.2.png')` 
        }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center relative z-10 gap-16 lg:gap-12 xl:gap-24">
          
          {/* Section 2 Content Row (Mascot Left Flipped, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10 relative">
            {/* Left: Sira Mascot pointing right (flipped) */}
            <motion.div 
              className="lg:col-span-4 flex justify-center lg:justify-start lg:order-1 order-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="scale-x-[-1]">
                <SiraGaluh
                  expression="pointing"
                  useGif={false}
                  text=""
                />
              </div>
            </motion.div>

            {/* Right: Text Block */}
            <motion.div 
              className="lg:col-span-8 border-r-4 border-secondary pr-6 text-right lg:order-2 order-1"
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-serif text-lg md:text-xl text-text-dark/95 leading-relaxed select-text">
                Sasirangan adalah kain khas kalimantan selatan yang diwariskan turun-temurun sejak abad ke-12, Nama &ldquo;Sasirangan&rdquo; Berasal dari kata &ldquo;sa&rdquo; yang berarti satu dan &ldquo;sirang&rdquo; yang berarti jelujur.
              </p>
            </motion.div>
          </div>

          {/* Section 2 Bottom Highlight Text & Ornament Divider */}
          <motion.div
            className="flex flex-col items-center text-center mt-6 w-full max-w-4xl px-4"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
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
