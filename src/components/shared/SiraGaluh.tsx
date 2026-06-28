"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────

export type SiraExpression =
  | "idle"
  | "speaking"
  | "pointing"
  | "happy"
  | "thinking"
  | "shy"
  | "presenting";

export interface SiraGaluhProps {
  expression?: SiraExpression;
  text?: string;
  className?: string;
  useGif?: boolean;
  avatarSrc?: string;
  /** Enable hover/click interactivity (default: true) */
  interactive?: boolean;
  /** Mirror only the avatar image horizontally (speech bubble stays normal) */
  flipAvatar?: boolean;
  /** Called when typewriter finishes */
  onSpeakEnd?: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Maps each expression to its avatar asset */
const EXPRESSION_MAP: Record<SiraExpression, string> = {
  idle:       "/assets/avatar/Sira_2.png",
  pointing:   "/assets/avatar/Sira_1.png",
  thinking:   "/assets/avatar/Sira_3.png",
  happy:      "/assets/avatar/Sira_4.png",
  shy:        "/assets/avatar/Sira_5.png",
  speaking:   "/assets/avatar/Sira_6.png",
  presenting: "/assets/avatar/Sira_7.png",
};

/** Random dialog pool for click interactions */
const SIRA_DIALOGS: string[] = [
  "Hai! Selamat datang di SASITRA! ✨",
  "Sasirangan adalah warisan budaya Banjar yang sangat indah!",
  "Yuk, jelajahi motif-motif Sasirangan bersamaku!",
  "Tahukah kamu? Nama 'Sasirangan' berasal dari kata 'sa' (satu) dan 'sirang' (jelujur)!",
  "Aku Sira, maskot SASITRA. Senang bertemu kamu! 🌸",
  "Setiap motif Sasirangan punya cerita dan makna tersendiri lho!",
  "Sasirangan resmi jadi Indikasi Geografis Kalimantan Selatan sejak 7 Juni 2024!",
  "Kain Sasirangan dulunya disebut kain Pamintan — kain permohonan! 🙏",
];

// ─── Sparkle Component ───────────────────────────────────────────────────────

interface SparkleProps {
  style: React.CSSProperties;
  size: number;
}

const Sparkle: React.FC<SparkleProps> = ({ style, size }) => (
  <motion.div
    className="pointer-events-none absolute"
    style={style}
    initial={{ opacity: 0, scale: 0, rotate: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      y: [0, -24, -48],
    }}
    transition={{ duration: 1.1, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
        fill="#C5960C"
        opacity="0.9"
      />
    </svg>
  </motion.div>
);

// ─── Periodic Ambient Sparkles ────────────────────────────────────────────────

interface AmbientSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
}

function useAmbientSparkles(active: boolean) {
  const [sparkles, setSparkles] = useState<AmbientSparkle[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const id = counterRef.current++;
      const newSparkle: AmbientSparkle = {
        id,
        x: Math.random() * 80 + 10, // 10–90%
        y: Math.random() * 70 + 10, // 10–80%
        size: Math.random() * 8 + 6, // 6–14px
      };
      setSparkles((prev) => [...prev.slice(-5), newSparkle]);

      // Remove after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 1200);
    }, 900);

    return () => clearInterval(interval);
  }, [active]);

  return sparkles;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const SiraGaluh: React.FC<SiraGaluhProps> = ({
  expression = "idle",
  text = "",
  className = "",
  useGif = false,
  avatarSrc,
  interactive = true,
  flipAvatar = false,
  onSpeakEnd,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [prevText, setPrevText] = useState(text);

  // Interactive state
  const [isHovered, setIsHovered] = useState(false);
  const [clickSparkles, setClickSparkles] = useState<AmbientSparkle[]>([]);
  const [activeExpression, setActiveExpression] = useState<SiraExpression>(expression);
  const [prevExpression, setPrevExpression] = useState<SiraExpression>(expression);
  const [activeBubble, setActiveBubble] = useState<string>(text);
  const [prevActiveBubble, setPrevActiveBubble] = useState<string>(text);
  const [showTooltip, setShowTooltip] = useState(false);
  const [idleWiggle, setIdleWiggle] = useState(false);
  const clickCounterRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const ambientSparkles = useAmbientSparkles(interactive && isHovered);

  // Sync external expression during render (render-phase, no useEffect needed)
  if (expression !== prevExpression) {
    setPrevExpression(expression);
    if (!isHovered) setActiveExpression(expression);
  }

  // Reset text when prop changes during render (avoid cascading useEffect)
  if (text !== prevText) {
    setPrevText(text);
    setActiveBubble(text);
    setPrevActiveBubble(text);
    setDisplayedText("");
    setIsTyping(!!text);
  }

  // Also reset text/typing when activeBubble changes from interactive actions
  if (activeBubble !== prevActiveBubble) {
    setPrevActiveBubble(activeBubble);
    setDisplayedText("");
    setIsTyping(!!activeBubble);
  }

  // Typewriter effect — ref-based index + slice approach eliminates race conditions
  const charIndexRef = useRef(0);
  const contentRef = useRef("");

  useEffect(() => {
    charIndexRef.current = 0;
    contentRef.current = activeBubble;

    if (!activeBubble) {
      return;
    }

    const timer = setInterval(() => {
      charIndexRef.current += 1;
      const idx = charIndexRef.current;
      const content = contentRef.current;

      if (idx <= content.length) {
        // slice-based: always deterministic, no stale closure issue
        setDisplayedText(content.slice(0, idx));
        if (idx >= content.length) {
          clearInterval(timer);
          setIsTyping(false);
          onSpeakEnd?.();
        }
      }
    }, 25);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBubble]);

  // Idle wiggle trigger after 8s of no interaction
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleWiggle(false);
    idleTimerRef.current = setTimeout(() => {
      setIdleWiggle(true);
      setTimeout(() => setIdleWiggle(false), 800);
    }, 8000);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    // Use rAF so setState calls inside resetIdleTimer are deferred from the effect body
    const raf = requestAnimationFrame(() => resetIdleTimer());
    return () => {
      cancelAnimationFrame(raf);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [interactive, resetIdleTimer]);

  // Handle click — random dialog
  const handleClick = useCallback(() => {
    if (!interactive) return;
    resetIdleTimer();

    // Burst sparkles on click
    const newSparkles: AmbientSparkle[] = Array.from({ length: 6 }, () => ({
      id: clickCounterRef.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 10,
      size: Math.random() * 10 + 8,
    }));
    setClickSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setClickSparkles((prev) =>
        prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id))
      );
    }, 1200);

    // Pick a random dialog
    const dialog = SIRA_DIALOGS[Math.floor(Math.random() * SIRA_DIALOGS.length)];
    setActiveExpression("speaking");
    setActiveBubble(dialog);

    // Revert expression after dialog finishes (approx)
    const revertDelay = dialog.length * 25 + 2500;
    setTimeout(() => {
      setActiveExpression(expression);
      setActiveBubble(text);
    }, revertDelay);
  }, [interactive, expression, text, resetIdleTimer]);

  // Resolve which image src to use
  const resolvedSrc = avatarSrc
    ? avatarSrc
    : useGif
    ? "/assets/avatar/Sira_1.gif"
    : EXPRESSION_MAP[activeExpression];

  const bubbleContent = activeBubble || text;

  return (
    <div className={`flex flex-col md:flex-row items-center md:items-end gap-6 max-w-xl ${className}`}>

      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {bubbleContent ? (
          <motion.div
            key={bubbleContent.slice(0, 20)}
            className="relative glass-panel-light rounded-3xl p-5 text-text-dark text-sm border-2 border-secondary/20 shadow-xl flex-1 max-w-sm order-1 md:order-0 mb-4 md:mb-12"
            initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.8, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.8, y: shouldReduceMotion ? 0 : 15 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", duration: 0.4 }}
          >
            {/* Bubble Tail */}
            <div className="absolute -bottom-2.5 left-1/2 md:left-auto md:-right-2.5 md:bottom-6 -translate-x-1/2 md:translate-x-0 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-10 border-t-bg-cream/70 md:border-t-transparent md:border-b-8 md:border-b-transparent md:border-l-10 md:border-l-bg-cream/70 z-10" />

            <p className="font-sans leading-relaxed">
              {displayedText}
              {isTyping ? (
                <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />
              ) : null}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mascot Wrapper */}
      <div className="relative shrink-0 order-2 md:order-1">

        {/* Glow Ring on Hover */}
        <AnimatePresence>
          {interactive && isHovered && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none z-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(197,150,12,0.18) 0%, rgba(197,150,12,0.06) 60%, transparent 80%)",
                filter: "blur(8px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <AnimatePresence>
          {interactive && showTooltip && !bubbleContent && (
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap z-20 pointer-events-none"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              Klik aku! ✨
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar image with all animations */}
        <motion.div
          className="w-48 h-64 md:w-56 md:h-72 relative select-none cursor-pointer"
          // Floating idle
          animate={
            shouldReduceMotion
              ? {}
              : idleWiggle
              ? { rotate: [0, -4, 4, -3, 3, 0], y: [0, -5, 0] }
              : { y: [0, -6, 0] }
          }
          transition={
            shouldReduceMotion
              ? {}
              : idleWiggle
              ? { duration: 0.8, ease: "easeInOut" }
              : { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }
          // Hover scale
          whileHover={interactive && !shouldReduceMotion ? { scale: 1.07 } : {}}
          whileTap={interactive && !shouldReduceMotion ? { scale: 0.96 } : {}}
          onHoverStart={() => {
            if (!interactive) return;
            setIsHovered(true);
            setShowTooltip(true);
            resetIdleTimer();
          }}
          onHoverEnd={() => {
            setIsHovered(false);
            setShowTooltip(false);
          }}
          onClick={handleClick}
        >
          {/* Expression crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedSrc}
              className={`absolute inset-0${flipAvatar ? " scale-x-[-1]" : ""}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Image
                src={resolvedSrc}
                alt="Sira Galuh Mascot"
                fill
                sizes="(max-width: 768px) 192px, 224px"
                className="object-contain drop-shadow-md"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Hover shimmer ring */}
          <AnimatePresence>
            {interactive && isHovered && !shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  boxShadow: "0 0 32px 8px rgba(197,150,12,0.25)",
                  borderRadius: "50%",
                }}
              />
            )}
          </AnimatePresence>

          {/* Ambient sparkles (hover) */}
          {ambientSparkles.map((s) => (
            <Sparkle
              key={s.id}
              size={s.size}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            />
          ))}

          {/* Click burst sparkles */}
          {clickSparkles.map((s) => (
            <Sparkle
              key={s.id}
              size={s.size}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            />
          ))}
        </motion.div>
      </div>

    </div>
  );
};
