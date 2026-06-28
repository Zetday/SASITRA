"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const MOTIF_STEPS = [
  {
    id: "hiris-pundak",
    title: "Hiris Pudak",
    image: "/assets/motif_sasirangan/motif_dasar/hiris_pudak.png",
    description: "Terinspirasi dari daun pudak atau pandan yang harum. Bentuknya memanjang seperti helaian daun yang akrab dengan keseharian masyarakat Banjar."
  },
  {
    id: "kembang-kacang",
    title: "Kembang Kacang",
    image: "/assets/motif_sasirangan/motif_dasar/kembang_kacang.png",
    description: "Terinspirasi dari tanaman kacang panjang yang dekat dengan dapur Banjar. Motif ini melambangkan keakraban dan kebersamaan dalam kehidupan sehari-hari."
  },
  {
    id: "bayam-raja",
    title: "Bayam Raja",
    image: "/assets/motif_sasirangan/motif_dasar/bayam_raja.png",
    description: "Terinspirasi dari bentuk daun bayam yang tersusun dalam garis lengkung. Motif ini melambangkan leluhur yang bermartabat dan dihormati."
  },
  {
    id: "ombak-sinapur-karang",
    title: "Ombak Sinapur Karang",
    image: "/assets/motif_sasirangan/motif_dasar/ombak_sinapur_karang.png",
    description: "Terinspirasi dari gelombang laut yang menerjang karang. Motif ini menggambarkan perjuangan, keteguhan, dan keberanian menghadapi ujian hidup."
  }
];

export const MotifPreview: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const shouldReduceMotion = useReducedMotion();

  // State to track active step to stack cards dynamically
  const [activeStep, setActiveStep] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    if (hasEntered) {
      const timer = setTimeout(() => {
        setIntroFinished(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [hasEntered]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll progress to active card index
      if (latest <= 0.25) {
        setActiveStep(0);
      } else if (latest <= 0.5) {
        setActiveStep(1);
      } else if (latest <= 0.75) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const deckRot = useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]);
  const deckY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <motion.div 
      ref={sectionRef} 
      className="relative w-full h-[220vh]"
      onViewportEnter={() => setHasEntered(true)}
      viewport={{ once: true, margin: "-150px" }}
    >
      {/* Sticky Inner Container */}
      <div 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ 
          backgroundImage: `url('/assets/background/background_4.png')`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >


        {/* Main Grid Content */}
        <div className="max-w-8xl mx-auto px-6 w-full grid grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left: Sira Mascot (col-span-4) */}
          <div className="col-span-12 lg:col-span-4 hidden lg:flex justify-center lg:justify-start relative">
            <div className="w-64 h-125 relative scale-x-[-1]">
              <Image
                src="/assets/avatar/Sira_1.gif"
                alt="Sira Galuh Motif"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-contain object-bottom drop-shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Middle & Right: Stacked Cards & Description (col-span-8) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-10">
            
            {/* Top Text Header (relative to stack) */}
            <div className="max-w-2xl text-left lg:text-right lg:ml-auto">
              <p className="font-serif text-lg md:text-xl text-text-dark font-bold leading-snug">
                Motif Sasirangan tidak dibuat sembarangan.
              </p>
              <p className="font-serif text-sm md:text-base text-secondary-dark font-medium mt-1 leading-relaxed">
                Banyak di antaranya terinspirasi dari tumbuhan, hewan, makanan, dan kehidupan masyarakat Banjar.
              </p>
            </div>

            {/* Cards Stack & Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Stacked Cards Area (col-span-6) */}
              <motion.div 
                className="md:col-span-6 h-85 flex items-center justify-center relative pl-8 origin-center"
                style={shouldReduceMotion ? {} : { rotate: deckRot, y: deckY }}
              >
                {MOTIF_STEPS.map((step, idx) => {
                  // Calculate stacked position and state
                  const isSwiped = idx < activeStep;
                  const diff = idx - activeStep;
                  
                  return (
                    <motion.div
                      key={step.id}
                      className="absolute w-48 sm:w-55 aspect-3/4 bg-white rounded-3xl overflow-hidden shadow-xl border-[3px] border-[#A37F55] flex flex-col items-center justify-center origin-bottom-left"
                      style={{ zIndex: 10 - idx }}
                      initial={{ 
                        opacity: 0, 
                        y: 180, 
                        x: idx * 40 - 60, // spread out horizontally initially
                        rotate: idx * 8 - 12 
                      }}
                      animate={shouldReduceMotion ? (
                        idx === activeStep ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0 }
                      ) : (
                        !hasEntered ? {
                          opacity: 0,
                          y: 180,
                          x: idx * 40 - 60,
                          rotate: idx * 8 - 12
                        } : (
                          isSwiped ? {
                            x: 350,
                            y: -80,
                            rotate: 20,
                            opacity: 0,
                            scale: 0.95
                          } : {
                            x: -14 * diff,
                            y: -14 * diff,
                            rotate: -2.5 * diff,
                            scale: 1 - 0.02 * diff,
                            opacity: 1
                          }
                        )
                      )}
                      transition={
                        !introFinished ? {
                          type: "spring",
                          stiffness: 75,
                          damping: 16,
                          delay: idx * 0.15
                        } : {
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                          delay: 0
                        }
                      }
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          sizes="220px"
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Info Text Area (col-span-6) */}
              <div className="md:col-span-6 flex flex-col gap-3 min-h-40 justify-center">
                <motion.h3 
                  className="font-serif font-extrabold text-3xl text-secondary-dark uppercase tracking-wide"
                  key={`title-${activeStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {MOTIF_STEPS[activeStep]?.title}
                </motion.h3>

                <motion.p 
                  className="font-serif text-sm sm:text-base text-text-dark/85 leading-relaxed font-medium"
                  key={`desc-${activeStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  {MOTIF_STEPS[activeStep]?.description}
                </motion.p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};
