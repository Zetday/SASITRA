"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const PROSES_STEPS = [
  {
    id: 1,
    title: "Menggambar Motif",
    image: "/assets/proses_pembuatan/proses_1.png"
  },
  {
    id: 2,
    title: "Menjelujur Kain",
    image: "/assets/proses_pembuatan/proses_2.png"
  },
  {
    id: 3,
    title: "Pewarnaan",
    image: "/assets/proses_pembuatan/proses_3.png"
  }
];

export const ProsesPembuatan: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const shouldReduceMotion = useReducedMotion();
  // State to track active step to apply focus/blur effect
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest <= 0.4) {
        setActiveStep(0);
      } else if (latest <= 0.75) {
        setActiveStep(1);
      } else {
        setActiveStep(2);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [scrollYProgress]);

  const card1Y = useTransform(scrollYProgress, [0, 0.5], [25, -25]);
  const card1Rot = useTransform(scrollYProgress, [0, 0.5], [-3, 2]);
  
  const card2Y = useTransform(scrollYProgress, [0.2, 0.8], [-20, 20]);
  const card2Rot = useTransform(scrollYProgress, [0.2, 0.8], [2, -2]);

  const card3Y = useTransform(scrollYProgress, [0.5, 1], [25, -25]);
  const card3Rot = useTransform(scrollYProgress, [0.5, 1], [-2, 3]);

  return (
    <div 
      ref={sectionRef} 
      className="relative w-full h-[220vh]"
    >
      {/* Sticky Inner Container */}
      <div 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ 
          backgroundImage: `url('/assets/background/background_3.png')`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        


        {/* Three Step Cards (z-10) */}
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center justify-between h-[80vh] md:h-[85vh] max-h-[680px] relative z-10 py-4">
          
          {/* Three Step Cards (Images Only) */}
          <div className="relative w-full max-w-5xl flex md:grid md:grid-cols-3 gap-6 md:gap-8 items-center justify-center min-h-55 md:min-h-0 pt-4 md:pt-2">
            {PROSES_STEPS.map((step, idx) => {
              const isBlurred = activeStep !== idx;
              const cardY = idx === 0 ? card1Y : idx === 1 ? card2Y : card3Y;
              const cardRot = idx === 0 ? card1Rot : idx === 1 ? card2Rot : card3Rot;
              
              return (
                <motion.div 
                  key={step.id} 
                  className={`absolute md:relative w-60 sm:w-64 md:w-full flex flex-col group items-center justify-center origin-center transition-all duration-500 ${
                    isBlurred 
                      ? "opacity-0 scale-90 pointer-events-none md:opacity-100 md:scale-100 md:pointer-events-auto" 
                      : "opacity-100 scale-100 z-10"
                  }`}
                  style={shouldReduceMotion ? {} : { y: cardY, rotate: cardRot }}
                >
                  {/* Card Container (Image only) with dynamic focus / blur effects */}
                  <div className={`relative rounded-2xl overflow-hidden border-2 shadow-md transition-all duration-500 aspect-4/3 w-full z-10 ${
                    isBlurred 
                      ? "filter blur-[3px] opacity-40 scale-[0.97] border-secondary/15" 
                      : "border-[#A37F55] shadow-2xl scale-[1.03]"
                  }`}>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Mobile Step Badge */}
                  <div className={`md:hidden mt-3 bg-[#A97340] text-[#FFFDF9] px-3.5 py-1 rounded-full text-[10px] font-bold shadow-md z-20 transition-all duration-500 ${
                    isBlurred ? "opacity-0 scale-75" : "opacity-100 scale-100"
                  }`}>
                    Langkah {idx + 1}: {idx === 0 ? "Menggambar Motif" : idx === 1 ? "Menjelujur Kain" : "Pencelupan Warna"}
                  </div>

                  {/* Sira Avatar & Speech Bubble on each Card - appears gradually based on active step */}
                  <div 
                    className={`absolute -left-14 -bottom-10 z-20 hidden md:flex items-end pointer-events-none select-none transition-all duration-500 ${
                      isBlurred 
                        ? "opacity-0 scale-75 pointer-events-none" 
                        : "opacity-100 scale-100 pointer-events-auto"
                    }`}
                  >
                    {/* Sira Avatar */}
                    <div className="w-36 h-48 relative shrink-0">
                      <Image
                        src={idx === 0 ? "/assets/avatar/Sira_3.png" : idx === 1 ? "/assets/avatar/Sira_4.png" : "/assets/avatar/Sira_5.png"}
                        alt="Sira Galuh"
                        fill
                        sizes="144px"
                        className="object-contain"
                      />
                    </div>

                    {/* Speech Bubble */}
                    <div className="relative border-2 border-secondary-light p-0.5 rounded-3xl bg-[#FFFDF9] shadow-xl -ml-4 mb-24 pointer-events-auto shrink-0 max-w-38.75">
                      <div className="border border-secondary-light rounded-[1.35rem] bg-[#FFFDF9] px-4 py-2.5 text-center shadow-inner">
                        <p className="font-sans text-xs font-bold text-secondary-dark leading-tight">
                          {idx === 0 ? "Menggambar Motif" : idx === 1 ? "Menjelujur Kain" : "Pencelupan Warna"}
                        </p>
                      </div>
                      <div className="absolute -left-1 bottom-[32%] w-3 h-3 bg-[#FFFDF9] border-l border-b border-secondary-light -rotate-45 z-10" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Title, Ornament & Subtitle below the cards */}
          <div className="flex flex-col items-center text-center gap-3">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl text-[#A97340] tracking-wide uppercase">
              Bagaimana Sasirangan <br /> Dibuat
            </h2>
            
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }}
              className="hidden md:block w-48 sm:w-64"
            >
              <Image 
                src="/assets/decoration/beranda_decor_1.png" 
                alt="Ornamen Dekorasi" 
                width={350} 
                height={20} 
                className="object-contain w-full h-auto"
                loading="lazy"
              />
            </motion.div>

            <p className="font-sans text-sm sm:text-base text-accent-brown/85 max-w-2xl leading-relaxed mt-2 font-medium">
              Sasirangan dibuat melalui beberapa tahapan tradisional mulai dari <br />
              <span className="text-[#A97340]">menggambar motif, menjelujur kain hingga proses pewarnaan.</span>
            </p>
          </div>

        </div>



      </div>
    </div>
  );
};
