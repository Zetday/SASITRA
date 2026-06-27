"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const PRODUCTS = [
  { id: "kemeja", name: "Kemeja", image: "/assets/sasirangan_now/kemeja.png" },
  { id: "tas", name: "Tas", image: "/assets/sasirangan_now/tas.png" },
  { id: "lampu", name: "Lampu", image: "/assets/sasirangan_now/lampu.png" },
  { id: "topi", name: "Topi", image: "/assets/sasirangan_now/topi.png" },
  { id: "bantal", name: "Bantal", image: "/assets/sasirangan_now/sarung_bantal_guling.png" },
  { id: "sepatu", name: "Sepatu", image: "/assets/sasirangan_now/sepatu.png" },
];

export const SasiranganMasaKini: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative w-full py-20 overflow-hidden min-h-[90vh] flex items-center justify-center bg-transparent"
    >

      {/* Seamless Bottom Blend */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg-cream via-bg-cream/80 to-transparent pointer-events-none z-10" />

      {/* SVG Decorative Dashed Curves matching the screenshot */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full min-h-150 overflow-visible" viewBox="0 0 1200 800" fill="none">
          {/* Top Left Curve around Mascot */}
          <path
            d="M -50 80 C 150 50, 200 150, 100 350 C 50 450, -20 500, -80 600"
            stroke="#C5960C"
            strokeWidth="1.5"
            strokeDasharray="6,6"
            opacity="0.3"
          />
          {/* Top Right Curve around Cards */}
          <path
            d="M 1250 80 C 1050 50, 1000 150, 1100 350 C 1150 450, 1220 500, 1280 600"
            stroke="#C5960C"
            strokeWidth="1.5"
            strokeDasharray="6,6"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* Left Side: Mascot and Text Description */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            
            {/* Mascot Avatar Sira_6 */}
            <motion.div
              className="w-56 h-95 md:w-64 md:h-112.5 lg:w-70 lg:h-120 relative shrink-0"
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
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
            <div className="flex-1 flex flex-col justify-center text-center md:text-left self-center">
              <motion.h2 
                className="font-serif text-5xl md:text-6xl font-extrabold text-[#A37F55] tracking-wide mb-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Sasirangan
              </motion.h2>

              <motion.h2 
                className="font-serif text-4xl md:text-5xl font-extrabold text-[#A37F55] tracking-wide mb-8 relative inline-block self-center md:self-start"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                di Masa Kini
                {/* Gold Underline decoration */}
                <div className="absolute left-0 -bottom-2 w-full h-[2.5px] bg-[#A37F55]" />
              </motion.h2>

              <div className="flex flex-col gap-6 max-w-lg mt-2">
                <motion.p
                  className="font-serif text-sm md:text-base lg:text-lg text-primary-dark leading-relaxed font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Sasirangan hadir dalam sentuhan modern yang menginspirasi. Dari pakaian, aksesori, hingga dekorasi rumah
                </motion.p>

                <motion.p
                  className="font-serif text-sm md:text-base lg:text-lg text-primary-dark leading-relaxed font-semibold pl-0 md:pl-16 text-center md:text-right"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Semuanya membawa keindahan tradisi dan identitas Kalimantan Selatan yang tak lekang oleh waktu
                </motion.p>
              </div>
            </div>

          </div>

          {/* Right Side: Lifestyle Products Grid and Jelajah 3D Button */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-8">
            
            {/* Products Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
              {PRODUCTS.map((product, idx) => (
                <motion.div
                  key={product.id}
                  className="aspect-3/4 rounded-2xl bg-white border-[3px] border-primary-dark p-2 flex items-center justify-center shadow-md relative overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 30vw, 150px"
                      className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Jelajah 3D Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-2 w-full md:w-auto"
            >
              <Link
                href="/try-on"
                className="w-full md:w-auto inline-flex items-center justify-center gap-4 bg-primary-dark hover:bg-[#4A0D0D] border-2 border-secondary px-10 py-3.5 rounded-xl shadow-lg group transition-all duration-300 hover:scale-105"
              >
                <span className="w-8 h-[1.5px] bg-secondary opacity-80 group-hover:w-12 transition-all duration-300" />
                <span className="font-serif text-white text-base md:text-lg font-bold tracking-widest whitespace-nowrap">
                  Jelajah 3D
                </span>
                <span className="w-8 h-[1.5px] bg-secondary opacity-80 group-hover:w-12 transition-all duration-300" />
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
