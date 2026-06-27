"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";

interface GalleryItem {
  id: string;
  image: string;
  title: string;
  link: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: "1", image: "/assets/galeri/folder/folder_1.png", title: "Motif Dasar", link: "/ensiklopedia?kategori=ALL" },
  { id: "2", image: "/assets/galeri/folder/folder_2.png", title: "Motif Modern", link: "/ensiklopedia?kategori=LAINNYA" },
  { id: "3", image: "/assets/galeri/folder/folder_3.png", title: "Khas Banjarmasin", link: "/ensiklopedia?search=Banjarmasin" },
  { id: "4", image: "/assets/galeri/folder/folder_4.png", title: "Khas Banjarbaru", link: "/ensiklopedia?search=Banjarbaru" },
  { id: "5", image: "/assets/galeri/folder/folder_5.png", title: "Khas Banjar", link: "/ensiklopedia?search=Banjar" },
  { id: "6", image: "/assets/galeri/folder/folder_6.png", title: "Khas Tanah Laut", link: "/ensiklopedia?search=Tanah Laut" },
  { id: "7", image: "/assets/galeri/folder/folder_7.png", title: "Khas Tanah Bumbu", link: "/ensiklopedia?search=Tanah Bumbu" },
  { id: "8", image: "/assets/galeri/folder/folder_8.png", title: "Khas Kotabaru", link: "/ensiklopedia?search=Kotabaru" },
  { id: "9", image: "/assets/galeri/folder/folder_9.png", title: "Khas Tapin", link: "/ensiklopedia?search=Tapin" },
  { id: "10", image: "/assets/galeri/folder/folder_10.png", title: "Khas Hulu Sungai", link: "/ensiklopedia?search=Hulu Sungai" },
  { id: "11", image: "/assets/galeri/folder/folder_11.png", title: "Khas Tabalong", link: "/ensiklopedia?search=Tabalong" },
  { id: "12", image: "/assets/galeri/folder/folder_12.png", title: "Khas Balangan", link: "/ensiklopedia?search=Balangan" },
  { id: "13", image: "/assets/galeri/folder/folder_13.png", title: "Khas Barito Kuala", link: "/ensiklopedia?search=Barito Kuala" },
];

export default function GaleriPage() {
  // Splitting items for the staggered layout on desktop:
  // Row 1: items 01-03 (indices 0 to 2)
  // Row 2: items 04-08 (indices 3 to 7)
  // Row 3: items 09-13 (indices 8 to 12)
  const row1 = GALLERY_ITEMS.slice(0, 3);
  const row2 = GALLERY_ITEMS.slice(3, 8);
  const row3 = GALLERY_ITEMS.slice(8, 13);

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "radial-gradient(circle, #5C1010 0%, #2E0505 70%, #150000 100%)",
      }}
    >
      <Navbar />

      {/* Gold Dot stitch background overlay */}
      <div className="absolute inset-0 bg-jelujur-pattern opacity-10 pointer-events-none z-0" />

      {/* Side Decorative Borders matching the mockup */}
      {/* Left Side */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-36 lg:w-48 pointer-events-none z-10 opacity-30 select-none overflow-hidden h-full">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 120 1000" fill="none">
          <defs>
            <pattern id="stitch-pattern-left" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect x="11" y="11" width="8" height="8" transform="rotate(45 15 15)" fill="#C5960C" opacity="0.8" />
              <rect x="3" y="3" width="4" height="4" transform="rotate(45 5 5)" fill="#C5960C" opacity="0.4" />
              <rect x="19" y="3" width="4" height="4" transform="rotate(45 21 5)" fill="#C5960C" opacity="0.4" />
              <rect x="3" y="19" width="4" height="4" transform="rotate(45 5 21)" fill="#C5960C" opacity="0.4" />
              <rect x="19" y="19" width="4" height="4" transform="rotate(45 21 21)" fill="#C5960C" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="40" height="1000" fill="url(#stitch-pattern-left)" />
          <rect x="40" width="30" height="1000" fill="url(#stitch-pattern-left)" opacity="0.65" />
          <rect x="70" width="25" height="1000" fill="url(#stitch-pattern-left)" opacity="0.35" />
          <rect x="95" width="15" height="1000" fill="url(#stitch-pattern-left)" opacity="0.1" />
        </svg>
      </div>

      {/* Right Side (flipped) */}
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-36 lg:w-48 pointer-events-none z-10 opacity-30 select-none overflow-hidden h-full scale-x-[-1]">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 120 1000" fill="none">
          <rect width="40" height="1000" fill="url(#stitch-pattern-left)" />
          <rect x="40" width="30" height="1000" fill="url(#stitch-pattern-left)" opacity="0.65" />
          <rect x="70" width="25" height="1000" fill="url(#stitch-pattern-left)" opacity="0.35" />
          <rect x="95" width="15" height="1000" fill="url(#stitch-pattern-left)" opacity="0.1" />
        </svg>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 relative z-20 max-w-7xl mx-auto w-full">
        
        {/* Title and Subtitle */}
        <div className="text-center flex flex-col items-center gap-4 mb-16 select-none">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest text-[#C5960C] flex items-center justify-center gap-4 md:gap-8">
            <span className="w-16 md:w-28 h-[1.5px] bg-gradient-to-r from-transparent to-[#C5960C]" /> 
            GALERI 
            <span className="w-16 md:w-28 h-[1.5px] bg-gradient-to-l from-transparent to-[#C5960C]" />
          </h1>
          <p className="font-sans text-sm md:text-base lg:text-lg text-text-light/95 tracking-wide max-w-2xl font-light leading-relaxed">
            Jelajahi ragam motif Sasirangan dari berbagai daerah di{" "}
            <span className="text-[#C5960C] font-semibold">Kalimantan Selatan</span>
          </p>
        </div>

        {/* Staggered Desktop Layout (Row 1: 3 cards, Row 2: 5 cards, Row 3: 5 cards) */}
        <div className="hidden lg:flex flex-col gap-10 items-center w-full">
          {/* Row 1: 3 cards */}
          <div className="flex flex-row justify-center gap-10 w-full">
            {row1.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="w-full max-w-[230px] aspect-[1.52] relative"
              >
                <Link href={item.link} className="relative block w-full h-full cursor-pointer rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(197,150,12,0.45)] transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="230px"
                    className="object-contain"
                    priority
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Row 2: 5 cards */}
          <div className="flex flex-row justify-center gap-8 w-full">
            {row2.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (idx + 3) * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="w-full max-w-[210px] aspect-[1.52] relative"
              >
                <Link href={item.link} className="relative block w-full h-full cursor-pointer rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(197,150,12,0.45)] transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="210px"
                    className="object-contain"
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Row 3: 5 cards */}
          <div className="flex flex-row justify-center gap-8 w-full">
            {row3.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (idx + 8) * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="w-full max-w-[210px] aspect-[1.52] relative"
              >
                <Link href={item.link} className="relative block w-full h-full cursor-pointer rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(197,150,12,0.45)] transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="210px"
                    className="object-contain"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Responsive Layout for Mobile & Tablet (Grid flow) */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-4xl px-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="w-full aspect-[1.52] relative mx-auto max-w-[240px]"
            >
              <Link href={item.link} className="relative block w-full h-full cursor-pointer rounded-2xl overflow-hidden hover:shadow-[0_0_20px_rgba(197,150,12,0.4)] transition-all duration-300">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="240px"
                  className="object-contain"
                />
              </Link>
            </motion.div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
