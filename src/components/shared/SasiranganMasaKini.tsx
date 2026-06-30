"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const PRODUCTS = [
  { id: "kemeja", name: "Kemeja", image: "/assets/sasirangan_now/kemeja.png" },
  { id: "tas", name: "Tas", image: "/assets/sasirangan_now/tas.png" },
  { id: "lampu", name: "Lampu", image: "/assets/sasirangan_now/lampu.png" },
  { id: "topi", name: "Topi", image: "/assets/sasirangan_now/topi.png" },
  { id: "bantal", name: "Bantal", image: "/assets/sasirangan_now/sarung_bantal_guling.png" },
  { id: "sepatu", name: "Sepatu", image: "/assets/sasirangan_now/sepatu.png" },
];

export const SasiranganMasaKini: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const shouldReduceMotion = useReducedMotion();

  const mascotY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const mascotRot = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  const textX = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const gridY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const gridRot = useTransform(scrollYProgress, [0, 1], [2, -2]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden min-h-[90vh] flex items-center justify-center bg-transparent"
    >

      {/* Seamless Bottom Blend */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg-cream via-bg-cream/80 to-transparent pointer-events-none z-10" />


      <div className="max-w-8xl mx-auto px-6 w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* Left Side: Mascot and Text Description */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            
            {/* Mascot Avatar Sira_6 */}
            <motion.div
              className="w-56 h-95 md:w-64 md:h-112.5 lg:w-70 lg:h-120 relative shrink-0 origin-bottom"
              style={shouldReduceMotion ? {} : { y: mascotY, rotate: mascotRot }}
            >
              <Image
                src="/assets/avatar/Sira_6.png"
                alt="Sira Galuh Modern Showcase"
                fill
                sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 280px"
                className="object-contain object-bottom drop-shadow-lg"
                priority
              />
            </motion.div>

            {/* Title and Descriptions */}
            <motion.div 
              className="flex-1 flex flex-col justify-center text-center md:text-left self-center origin-left"
              style={shouldReduceMotion ? {} : { x: textX }}
            >
              <motion.h2 
                className="font-serif text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-[#A37F55] tracking-wider mb-1 leading-none"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Sasirangan
              </motion.h2>

              <motion.h2 
                className="font-serif text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[#A37F55] tracking-wider mb-8 relative inline-flex items-center self-center md:self-start leading-none gap-2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                di <span className="relative">Masa Kini
                  {/* Gold Underline decoration */}
                  <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-[#A37F55] opacity-80" />
                </span>
              </motion.h2>

              <div className="flex flex-col gap-6 max-w-lg mt-2">
                <motion.p
                  className="font-sans text-sm md:text-base lg:text-lg text-[#713034] leading-relaxed font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Sasirangan hadir dalam sentuhan modern yang menginspirasi. Dari pakaian, aksesori, hingga dekorasi rumah
                </motion.p>

                <motion.p
                  className="font-sans text-sm md:text-base lg:text-lg text-[#713034] leading-relaxed font-semibold pl-0 md:pl-16 text-center md:text-right"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Semuanya membawa keindahan tradisi dan identitas Kalimantan Selatan yang tak lekang oleh waktu
                </motion.p>
              </div>
            </motion.div>

          </div>

          {/* Right Side: Lifestyle Products Grid and Jelajah 3D Button */}
          <div className="lg:col-span-5 flex flex-col items-center gap-8 overflow-hidden">
            
            {/* Products Grid Staggered */}
            <motion.div 
              className="flex flex-col gap-3 md:gap-4 w-full origin-center"
              style={shouldReduceMotion ? {} : { y: gridY, rotate: gridRot }}
            >
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {PRODUCTS.slice(0, 3).map((product, idx) => (
                  <motion.div
                    key={product.id}
                    className="aspect-4/5 rounded-[1.25rem] bg-white/40 border-2 border-[#713034] p-2 flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-103 hover:bg-white/60"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 30vw, 150px"
                        className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Row 2 Staggered - menggunakan padding-left agar tidak overflow ke kanan */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 pl-3 lg:pl-5 xl:pl-8">
                {PRODUCTS.slice(3, 6).map((product, idx) => (
                  <motion.div
                    key={product.id}
                    className="aspect-4/5 rounded-[1.25rem] bg-white/40 border-2 border-[#713034] p-2 flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-103 hover:bg-white/60"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (idx + 3) * 0.08 }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 30vw, 150px"
                        className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Jelajah 3D Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-2 w-full md:w-auto"
            >
              <Link
                href="/3d"
                className="w-full md:w-80 inline-flex items-center justify-center gap-3 bg-[#713034] hover:bg-primary-dark border border-[#A97340] py-3.5 rounded-xl shadow-lg group transition-all duration-300 hover:scale-105"
              >
                <span className="h-px w-8 bg-[#A97340]/60 group-hover:w-12 transition-all duration-300" />
                <span className="font-serif text-[#FFF5DA] text-base md:text-lg font-bold tracking-widest uppercase">
                  Jelajah 3D
                </span>
                <span className="h-px w-8 bg-[#A97340]/60 group-hover:w-12 transition-all duration-300" />
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
