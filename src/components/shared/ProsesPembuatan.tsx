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

  // Transform scroll progress to animate solid path length drawing
  const pathLength = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  // State to track active step to apply focus/blur effect
  const [activeStep, setActiveStep] = useState(0);

  // State to track Sira mascot's sprite and text during scroll
  const [activeMascot, setActiveMascot] = useState({
    src: "/assets/avatar/Sira_3.png",
    text: "Menggambar Motif"
  });

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll progress to active card step and Sira's pose/text
      if (latest <= 0.4) {
        setActiveStep(0);
        setActiveMascot({
          src: "/assets/avatar/Sira_3.png",
          text: "Menggambar Motif"
        });
      } else if (latest <= 0.75) {
        setActiveStep(1);
        setActiveMascot({
          src: "/assets/avatar/Sira_4.png",
          text: "Menjelujur Kain"
        });
      } else {
        setActiveStep(2);
        setActiveMascot({
          src: "/assets/avatar/Sira_5.png",
          text: "Pencelupan Warna"
        });
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, shouldReduceMotion]);

  // Four-segment Bezier curve matching the SVG path to float Sira to each card's bottom-left
  const getBezierPoint = (t: number) => {
    const clampedT = Math.max(0, Math.min(1, t));
    let x = 0;
    let y = 0;

    if (clampedT <= 0.25) {
      // Segment 1: P0(120, 0) -> C1(120, 150) -> C2(80, 250) -> P1(80, 360)
      const tSegment = clampedT / 0.25;
      const mt = 1 - tSegment;
      const c0 = mt * mt * mt;
      const c1 = 3 * mt * mt * tSegment;
      const c2 = 3 * mt * tSegment * tSegment;
      const c3 = tSegment * tSegment * tSegment;

      x = c0 * 120 + c1 * 120 + c2 * 80 + c3 * 80;
      y = c0 * 0 + c1 * 150 + c2 * 250 + c3 * 360;
    } else if (clampedT <= 0.5) {
      // Segment 2: P1(80, 360) -> C3(120, 450) -> C4(380, 450) -> P2(420, 360)
      const tSegment = (clampedT - 0.25) / 0.25;
      const mt = 1 - tSegment;
      const c0 = mt * mt * mt;
      const c1 = 3 * mt * mt * tSegment;
      const c2 = 3 * mt * tSegment * tSegment;
      const c3 = tSegment * tSegment * tSegment;

      x = c0 * 80 + c1 * 120 + c2 * 380 + c3 * 420;
      y = c0 * 360 + c1 * 450 + c2 * 450 + c3 * 360;
    } else if (clampedT <= 0.75) {
      // Segment 3: P2(420, 360) -> C5(460, 450) -> C6(740, 450) -> P3(780, 360)
      const tSegment = (clampedT - 0.5) / 0.25;
      const mt = 1 - tSegment;
      const c0 = mt * mt * mt;
      const c1 = 3 * mt * mt * tSegment;
      const c2 = 3 * mt * tSegment * tSegment;
      const c3 = tSegment * tSegment * tSegment;

      x = c0 * 420 + c1 * 460 + c2 * 740 + c3 * 780;
      y = c0 * 360 + c1 * 450 + c2 * 450 + c3 * 360;
    } else {
      // Segment 4: P3(780, 360) -> C7(820, 450) -> C8(1050, 500) -> P4(1080, 750)
      const tSegment = (clampedT - 0.75) / 0.25;
      const mt = 1 - tSegment;
      const c0 = mt * mt * mt;
      const c1 = 3 * mt * mt * tSegment;
      const c2 = 3 * mt * tSegment * tSegment;
      const c3 = tSegment * tSegment * tSegment;

      x = c0 * 780 + c1 * 820 + c2 * 1050 + c3 * 1080;
      y = c0 * 360 + c1 * 450 + c2 * 500 + c3 * 750;
    }

    return {
      xPct: (x / 1200) * 100,
      yPct: (y / 800) * 100
    };
  };

  const mascotX = useTransform(scrollYProgress, (value) => `${getBezierPoint(value).xPct}%`);
  const mascotY = useTransform(scrollYProgress, (value) => `${getBezierPoint(value).yPct}%`);
  const mascotOpacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.15, 0.25, 0.30, 0.47, 0.52, 0.62, 0.67, 0.77, 0.82, 0.92, 0.97, 1.0],
    [0, 0,    1,    1,    0,    0,    1,    1,    0,    0,    1,    1,    0,    0]
  );

  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

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
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAF6EE]"
      >
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center lg:bg-top lg:bg-[length:100%_auto] pointer-events-none z-0"
          style={{ 
            backgroundImage: `url('/assets/background/background_3.png')`,
            y: shouldReduceMotion ? 0 : bgY,
          }}
        />
        
        {/* SVG Path (positioned behind cards, z-0) */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 pointer-events-none z-0 hidden lg:block">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 800" fill="none">
            {/* Background Dashed Path - connecting from top-left (120, 0) */}
            <path 
              d="M 120 0 C 120 150, 80 250, 80 360 C 120 450, 380 450, 420 360 C 460 450, 740 450, 780 360 C 820 450, 1050 500, 1080 750" 
              stroke="#C5960C" 
              strokeWidth="2" 
              strokeDasharray="6,6" 
              opacity="0.45"
              fill="none"
            />
            
            {/* Solid Drawing Overlay Path */}
            <motion.path 
              d="M 120 0 C 120 150, 80 250, 80 360 C 120 450, 380 450, 420 360 C 460 450, 740 450, 780 360 C 820 450, 1050 500, 1080 750" 
              stroke="#C5960C" 
              strokeWidth="2.5" 
              fill="none"
              style={shouldReduceMotion ? { pathLength: 1 } : { pathLength }}
            />
          </svg>
        </div>

        {/* Three Step Cards (z-10) */}
        <div className="max-w-5xl mx-auto px-6 w-full flex flex-col items-center justify-between h-[80vh] relative z-10 py-4">
          
          {/* Three Step Cards (Images Only) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative pt-12">
            {PROSES_STEPS.map((step, idx) => {
              const isBlurred = activeStep !== idx;
              const cardY = idx === 0 ? card1Y : idx === 1 ? card2Y : card3Y;
              const cardRot = idx === 0 ? card1Rot : idx === 1 ? card2Rot : card3Rot;
              
              return (
                <motion.div 
                  key={step.id} 
                  className="relative flex flex-col group items-center justify-center w-full origin-center"
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

                  {/* Sira Avatar & Speech Bubble on each Card for Mobile/Reduced Motion */}
                  <div className={`absolute -left-14 -bottom-12 z-20 ${shouldReduceMotion ? "flex" : "lg:hidden flex"} items-end pointer-events-none select-none`}>
                    {/* Speech Bubble */}
                    <div className="relative border-2 border-secondary-light p-0.5 rounded-3xl bg-[#FFFDF9] shadow-xl -mr-3 mb-16 pointer-events-auto shrink-0 max-w-32.5">
                      <div className="border border-secondary-light rounded-[1.35rem] bg-[#FFFDF9] px-3.5 py-2 text-center shadow-inner">
                        <p className="font-sans text-[10px] font-bold text-secondary-dark leading-tight">
                          {idx === 0 ? "Menggambar Motif" : idx === 1 ? "Menjelujur Kain" : "Pencelupan Warna"}
                        </p>
                      </div>
                      <div className="absolute -right-1 bottom-[30%] w-3 h-3 bg-[#FFFDF9] border-r border-b border-secondary-light -rotate-45 z-10" />
                    </div>
 
                    {/* Sira Avatar */}
                    <div className="w-28 h-36 relative shrink-0">
                      <Image
                        src={idx === 0 ? "/assets/avatar/Sira_3.png" : idx === 1 ? "/assets/avatar/Sira_4.png" : "/assets/avatar/Sira_5.png"}
                        alt="Sira Galuh"
                        fill
                        sizes="112px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Title, Ornament & Subtitle below the cards */}
          <div className="flex flex-col items-center text-center gap-3">
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-primary tracking-wide uppercase">
              Bagaimana Sasirangan Dibuat
            </h2>
            
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8 }}
              className="w-48 sm:w-64"
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

            <p className="font-serif text-sm sm:text-base text-accent-brown/85 max-w-2xl leading-relaxed mt-2 font-medium">
              Sasirangan dibuat melalui beberapa tahapan tradisional mulai dari menggambar motif, menjelujur kain hingga proses pewarnaan.
            </p>
          </div>

        </div>

        {/* Moving Mascot Sira Galuh (placed in a separate absolute layer with z-20 to always stay in front of cards) */}
        {!shouldReduceMotion ? (
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 pointer-events-none z-20 hidden lg:block">
            <motion.div
              className="absolute w-64 h-72 -translate-x-1/2 translate-y-[-50%] pointer-events-none z-30"
              style={{
                left: mascotX,
                top: mascotY,
                opacity: mascotOpacity,
              }}
            >
              <div className="flex items-end pointer-events-none select-none">
                {/* Speech Bubble */}
                <motion.div
                  className="relative border-2 border-secondary-light p-0.5 rounded-[1.8rem] bg-[#FFFDF9] shadow-xl -mr-3.5 mb-16 pointer-events-auto shrink-0 max-w-35"
                  key={activeMascot.text}
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border border-secondary-light rounded-[1.65rem] bg-[#FFFDF9] px-3.5 py-2 text-center shadow-inner">
                    <p className="font-sans text-[10px] font-bold text-secondary-dark leading-tight">
                      {activeMascot.text}
                    </p>
                  </div>
                  <div className="absolute -right-1 bottom-[30%] w-3 h-3 bg-[#FFFDF9] border-r border-b border-secondary-light -rotate-45 z-10" />
                </motion.div>
 
                {/* Sira Mascot Image */}
                <div className="w-36 h-48 relative shrink-0">
                  <Image
                    src={activeMascot.src}
                    alt="Sira Galuh Proses"
                    fill
                    sizes="144px"
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}

      </div>
    </div>
  );
};
