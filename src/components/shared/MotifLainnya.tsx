"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const OTHER_MOTIFS = [
  {
    id: "kulat-karikit",
    title: "Kulat Karikit",
    image: "/assets/motif_sasirangan/motif_dasar/kulat_karikit.png",
    description: "Terinspirasi dari jamur kecil yang tumbuh pada batang atau dahan pohon. Walau menempel pada tumbuhan lain, ia tidak merugikan dan melambangkan hidup mandiri."
  },
  {
    id: "bintang-behambur",
    title: "Bintang Behambur",
    image: "/assets/motif_sasirangan/motif_dasar/bintang_bahambur.png",
    description: "Terinspirasi dari gugusan bintang yang bertaburan di langit. Motif ini menjadi pengingat akan kebesaran Sang Pencipta."
  },
  {
    id: "naga-balimbur",
    title: "Naga Balimbur",
    image: "/assets/motif_sasirangan/motif_dasar/naga_balimbur.png",
    description: "Berangkat dari cerita rakyat Banjar tentang naga yang mandi di sungai pada pagi hari. Suasananya menggambarkan rasa riang dan kegembiraan."
  },
  {
    id: "jajumputan",
    title: "Jajumputan",
    image: "/assets/motif_sasirangan/motif_dasar/jajumputan.png",
    description: "Berasal dari kata jumput, yang berarti mengambil atau membawa sesuatu di tangan. Motif ini menggambarkan sesuatu yang digenggam, seperti bunga atau benda yang dibawa."
  },
  {
    id: "turun-dayang",
    title: "Turun Dayang",
    image: "/assets/motif_sasirangan/motif_dasar/turun_dayang.png",
    description: "Terinspirasi dari tumbuhan berdaun kecil yang menjuntai panjang seperti rambut terurai. Pada masa lalu, motif ini digunakan oleh para dayang istana saat pesta atau upacara tertentu."
  },
  {
    id: "kembang-tampuk-manggis",
    title: "Kembang Tampuk Manggis",
    image: "/assets/motif_sasirangan/motif_dasar/kembang_tampuk_manggis.png",
    description: "Terinspirasi dari tampuk buah manggis yang jumlahnya selaras dengan isi buahnya. Motif ini melambangkan kejujuran: apa yang terlihat sama dengan yang tersimpan di dalam hati."
  },
  {
    id: "daun-jaruju",
    title: "Daun Jaruju",
    image: "/assets/motif_sasirangan/motif_dasar/daun_jaruju.png",
    description: "Terinspirasi dari daun jaruju berduri yang tumbuh di tanah berair atau pinggir sungai. Dalam tradisi Banjar, daun ini menjadi simbol tolak bala atau perlindungan."
  },
  {
    id: "kangkung-kaombakan",
    title: "Kangkung Kaombakan",
    image: "/assets/motif_sasirangan/motif_dasar/kangkung_kaombakan.png",
    description: "Terinspirasi dari kangkung air yang batangnya tetap utuh meski diterpa gelombang. Motif ini melambangkan ketahanan dalam menghadapi ujian dan cobaan."
  },
  {
    id: "gigi-haruan",
    title: "Gigi Haruan",
    image: "/assets/motif_sasirangan/motif_dasar/gigi_haruan.png",
    description: "Mengambil bentuk gigi ikan haruan yang runcing dan tajam. Motif ini menjadi lambang ketajaman berpikir."
  },
  {
    id: "kambang-sakaki",
    title: "Kambang Sakaki",
    image: "/assets/motif_sasirangan/motif_dasar/kambang_sakaki.png",
    description: "Kambang berarti bunga dalam bahasa Banjar. Motif ini melambangkan keindahan yang juga banyak hadir dalam ukiran khas Banjar."
  },
  {
    id: "ular-lidi",
    title: "Ular Lidi",
    image: "/assets/motif_sasirangan/motif_dasar/ular_lidi.png",
    description: "Terinspirasi dari ular kecil dalam dongeng masyarakat Banjar. Motif ini melambangkan kecerdikan, kecepatan, ketepatan, dan kepekaan."
  },
  {
    id: "mayang-maurai",
    title: "Mayang Maurai",
    image: "/assets/motif_sasirangan/motif_dasar/mayang_maurai.png",
    description: "Terinspirasi dari mayang pinang yang digunakan dalam ritual badudus atau mandi pengantin Banjar. Motif ini menjadi lambang kehormatan dalam upacara adat."
  },
  {
    id: "ramak-sahang",
    title: "Ramak Sahang",
    image: "/assets/motif_sasirangan/motif_dasar/ramak_sahang.png",
    description: "Sahang berarti merica, sedangkan ramak berarti hancur karena diulek. Motif ini menyerupai Hiris Pudak ganda dengan garis-garis yang terputus-putus."
  },
  {
    id: "gelombang",
    title: "Gelombang",
    image: "/assets/motif_sasirangan/motif_dasar/gelombang.png",
    description: "Terinspirasi dari ombak yang menggambarkan naik-turunnya kehidupan manusia. Motif ini mengajarkan keuletan dan kesabaran dalam mengarungi hidup."
  },
  {
    id: "daun-katu",
    title: "Daun Katu",
    image: "/assets/motif_sasirangan/motif_dasar/daun_katu.png",
    description: "Terinspirasi dari tanaman pekarangan yang dikenal memiliki banyak manfaat. Motif ini melambangkan tumbuhan yang memberi kegunaan bagi masyarakat."
  },
  {
    id: "hiris-gagatas",
    title: "Hiris Gagatas",
    image: "/assets/motif_sasirangan/motif_dasar/hiris_gagatas.png",
    description: "Terinspirasi dari potongan kue khas Banjar seperti amparan tatak, sarimuka, dan kue lapis. Gagatas atau rincung gagatas dimaknai sebagai bungas dan langkar, menghadirkan kesan indah serta kokoh."
  }
];

export const MotifLainnya: React.FC = () => {
  const [selectedMotif, setSelectedMotif] = useState<typeof OTHER_MOTIFS[0] | null>(null);

  return (
    <section 
      className="relative w-full py-24 overflow-hidden bg-cover bg-top min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url('/assets/background/background_5.png')`,
      }}
    >
      {/* Seamless Bottom Blend (from background_5 to next section) */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg-cream via-bg-cream/80 to-transparent pointer-events-none z-10" />

      {/* SVG Decorative Dashed Curves behind Mascots */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 800" fill="none">
          <path 
            d="M 180 0 C 120 200, 60 400, 80 600 C 90 680, 110 740, 130 800" 
            stroke="#C5960C" 
            strokeWidth="1.5" 
            strokeDasharray="5,5" 
            opacity="0.25"
          />
          <path 
            d="M 1080 0 C 1110 200, 1140 400, 1120 600 C 1110 680, 1090 740, 1070 800" 
            stroke="#C5960C" 
            strokeWidth="1.5" 
            strokeDasharray="5,5" 
            opacity="0.25"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col items-center">
        {/* Title & Mascot Row */}
        <div className="w-full flex items-center justify-center relative mb-8 min-h-[140px]">
          {/* Left Mascot */}
          <div className="absolute left-4 lg:left-20 top-0 w-24 h-32 hidden md:block">
            <Image
              src="/assets/avatar/Sira_2.png"
              alt="Sira Galuh Left"
              fill
              sizes="96px"
              className="object-contain drop-shadow-md"
            />
          </div>

          {/* Title Text Banner */}
          <div className="text-center flex flex-col items-center gap-3">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-secondary-dark uppercase tracking-[0.25em]">
              Motif Lainnya
            </h2>
            <div className="relative w-400 h-10 mt-1">
              <Image
                src="/assets/decoration/beranda_decor_1.png"
                alt="Decoration"
                fill
                sizes="300px"
                className="object-contain"
              />
            </div>
            {/* Click Guide Subtitle */}
            <p className="text-[10px] md:text-xs text-secondary-dark font-serif font-bold mt-2 uppercase tracking-widest text-center flex items-center justify-center gap-1.5 opacity-90">
              <span>❖</span> Klik kartu untuk melihat makna & filosofi motif <span>❖</span>
            </p>
          </div>

          {/* Right Mascot (Flipped) */}
          <div className="absolute right-4 lg:right-20 top-0 w-24 h-32 hidden md:block">
            <Image
              src="/assets/avatar/Sira_2.png"
              alt="Sira Galuh Right"
              fill
              sizes="96px"
              className="object-contain drop-shadow-md scale-x-[-1]"
            />
          </div>
        </div>

        {/* Responsive Grid of Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full max-w-6xl">
          {OTHER_MOTIFS.map((motif) => (
            <motion.div
              key={motif.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-[#A37F55] aspect-3/4 w-full relative cursor-pointer group"
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setSelectedMotif(motif)}
            >
              <Image
                src={motif.image}
                alt={motif.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                className="object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Footer Button Link */}
        <div className="mt-14">
          <button className="font-serif text-xs md:text-sm font-bold text-secondary-dark tracking-widest uppercase hover:text-primary transition-colors cursor-pointer border-b-2 border-secondary-light/30 pb-1 hover:border-primary/45">
            Lihat Galeri
          </button>
        </div>
      </div>

      {/* Floating Detailed Hover Overlay Modal */}
      <AnimatePresence>
        {selectedMotif && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMotif(null)}
          >
            {/* Modal Card content */}
            <motion.div
              className="bg-[#FFFDF9] rounded-3xl border-[3px] border-[#A37F55] shadow-2xl p-6 md:p-10 max-w-2xl w-full flex flex-col sm:flex-row gap-8 items-center cursor-default pointer-events-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content itself
            >
              {/* Close Button for touch devices */}
              <button
                onClick={() => setSelectedMotif(null)}
                className="absolute top-4 right-4 text-text-dark/40 hover:text-primary transition-colors cursor-pointer p-1"
                aria-label="Tutup detail motif"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Large Card */}
              <div className="w-[180px] sm:w-[200px] aspect-3/4 bg-white rounded-2xl overflow-hidden shadow-xl border-[3px] border-[#A37F55] shrink-0 relative">
                <Image
                  src={selectedMotif.image}
                  alt={selectedMotif.title}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              {/* Right Side: Motif Information */}
              <div className="flex-1 flex flex-col justify-center text-left">
                {/* Header Label decoration */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-secondary text-[10px]">❖</span>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    Motif Sasirangan
                  </span>
                  <div className="flex-1 h-[1px] bg-secondary-light/35 ml-1.5" />
                </div>

                {/* Title */}
                <h3 className="font-serif font-extrabold text-3xl text-secondary-dark mb-3.5">
                  {selectedMotif.title}
                </h3>

                {/* Description Paragraph */}
                <p className="font-serif text-sm md:text-base text-text-dark/85 leading-relaxed font-medium">
                  {selectedMotif.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
