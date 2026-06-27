"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Compass, Sparkles, Image as ImageIcon } from "lucide-react";
import { useDatabase } from "../../store/useDatabase";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";
import { SiraGaluh } from "../../components/shared/SiraGaluh";
import { MengenalSasirangan } from "../../components/shared/MengenalSasirangan";
import { ProsesPembuatan } from "../../components/shared/ProsesPembuatan";
import { MotifPreview } from "../../components/shared/MotifPreview";
import { Card } from "../../components/ui/Card";

// Hoisting chapters to module level - rerender-no-inline-components / server-hoist-static-io
// Add aria-hidden="true" to decorative icons
const CHAPTERS = [
  { id: "1", title: "Asal-usul", subtitle: "Abad ke-14 Kesultanan Dipa", desc: "Kisah legenda kain Calapan penyembuh Putri Junjung Buih.", icon: <Compass className="h-5 w-5 text-primary" aria-hidden="true" /> },
  { id: "2", title: "Makna Budaya", subtitle: "Filosofi & Doa Warna", desc: "Mempelajari arti spiritual warna-warni benang dan upacara adat Banjar.", icon: <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" /> },
  { id: "3", title: "Ragam Motif", subtitle: "Rerimbunan Flora & Fauna", desc: "Menjelajahi keindahan gambar daun pandan, ikan, hingga cangkang manggis.", icon: <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" /> },
  { id: "4", title: "Proses Buat", subtitle: "Tusuk Jelujur Tradisional", desc: "Mengintip ketekunan menyirang, menjelujur, merintang warna, hingga mengeringkan.", icon: <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" /> },
  { id: "5", title: "Era Modern", subtitle: "Fashion Kontemporer AI", desc: "Evolusi Sasirangan menjadi busana pesta modern dan visualisasi fitting AI.", icon: <ImageIcon className="h-5 w-5 text-primary" aria-hidden="true" /> },
];

export default function HomePage() {
  const { motifs } = useDatabase();
  const featuredMotifs = useMemo(() => {
    const targets = ["hiris-gagatas", "bayam-raja", "gigi-haruan", "tampuk-manggis"];
    const selected = motifs.filter(m => targets.includes(m.id));
    return selected.length > 0 ? selected : motifs.slice(0, 4);
  }, [motifs]);

  const shouldReduceMotion = useReducedMotion();

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
              className="font-serif text-sm md:text-base lg:text-lg text-text-dark/85 leading-relaxed font-light"
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2, duration: 0.8 }}
            >
              Tempat tradisi, keindahan, dan kreativitas<br className="hidden md:block" />
              berpadu dalam setiap helai kain
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
                  className="font-serif font-extrabold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#3D1A5A] tracking-tight leading-none whitespace-nowrap"
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
          <div className="absolute right-0 bottom-0 z-20 flex flex-row items-end gap-0 pointer-events-none select-none pr-0">
            {/* Speech Bubble */}
            <motion.div
              className="relative border-2 border-secondary-light p-0.5 rounded-[2.5rem] bg-transparent shadow-xl mb-102.5 lg:mb-112.5 -mr-7 lg:-mr-10 z-30 pointer-events-auto shrink-0"
              initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.8, duration: 0.5 }}
            >
              <div className="border border-secondary-light rounded-[2.35rem] bg-[#FFFDF9] px-5 py-3 flex flex-col items-center justify-center text-center shadow-inner">
                <p className="font-sans text-xs md:text-sm text-text-dark font-medium leading-relaxed">
                  <span className="text-secondary mr-1">✧</span> Halo, saya Sira! <span className="text-secondary ml-1">✧</span>
                  <br />
                  Yuk, jelajahi dunia
                  <br />
                  <span className="font-serif font-bold text-base md:text-lg text-secondary-dark block my-0.5">Sasirangan</span>
                  bersama Saya!
                </p>
              </div>
              {/* Speech Bubble Tail pointing right to Sira */}
              <div className="absolute -right-2 bottom-[40%] w-4 h-4 bg-[#FFFDF9] border-r border-b border-secondary-light -rotate-45 z-10" />
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

        {/* Section 2: Chapters Preview Journey */}
        <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-secondary/10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-primary">
              Eksplorasi Perjalanan Budaya
            </h2>
            <p className="text-base text-text-dark/70">
              Ikuti 5 babak scrollytelling terstruktur yang dipandu oleh Sira Galuh untuk memahami warisan berharga kain Sasirangan dari masa ke masa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CHAPTERS.map((ch) => (
              <Link key={ch.id} href={`/sejarah?chapter=${ch.id}`} className="flex">
                <Card
                  variant="glass-light"
                  hoverable
                  className="flex flex-col gap-4 flex-1 border border-secondary/15 hover:border-primary/30"
                >
                  <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center border border-secondary/20">
                    {ch.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      Chapter 0{ch.id}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-text-dark group-hover:text-primary">
                      {ch.title}
                    </h3>
                    <span className="text-xs font-semibold text-accent-brown/70 italic">
                      {ch.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-text-dark/70 leading-relaxed mt-auto">
                    {ch.desc}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

