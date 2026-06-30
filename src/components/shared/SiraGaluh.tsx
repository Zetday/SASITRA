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

type IdleStage = "active" | "wiggle";

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

const EXPRESSION_MAP: Record<SiraExpression, string> = {
  idle:       "/assets/avatar/Sira_2.png",
  pointing:   "/assets/avatar/Sira_1.png",
  thinking:   "/assets/avatar/Sira_3.png",
  happy:      "/assets/avatar/Sira_4.png",
  shy:        "/assets/avatar/Sira_5.png",
  speaking:   "/assets/avatar/Sira_6.png",
  presenting: "/assets/avatar/Sira_7.png",
};

/** Random dialog pool for regular clicks */
const SIRA_DIALOGS: string[] = [
  "Sasirangan adalah warisan budaya Banjar yang sangat indah!",
  "Yuk, jelajahi motif-motif Sasirangan bersamaku!",
  "Tahukah kamu? Nama 'Sasirangan' berasal dari kata 'sa' (satu) dan 'sirang' (jelujur)!",
  "Aku Sira, maskot SASITRA. Senang bertemu kamu! 🌸",
  "Setiap motif Sasirangan punya cerita dan makna tersendiri lho!",
  "Sasirangan resmi jadi Indikasi Geografis Kalimantan Selatan sejak 7 Juni 2024!",
  "Kain Sasirangan dulunya disebut kain Pamintan — kain permohonan! 🙏",
  "Warna-warna Sasirangan punya makna filosofis yang dalam!",
];

/** Time-based greeting (used on first click) */
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Selamat pagi! Siap menjelajahi Sasirangan hari ini? ☀️";
  if (hour >= 12 && hour < 15) return "Selamat siang! Jangan lupa istirahat ya 🍵";
  if (hour >= 15 && hour < 18) return "Selamat sore! Waktunya santai sambil belajar Sasirangan 🌅";
  return "Selamat malam! Masih semangat belajar? Keren! 🌙";
}



/** Emoji pool for particle reactions */
const REACTION_EMOJIS = ["✨", "🌸", "💛", "⭐", "🎵"];

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

// ─── Emoji Particle Component ─────────────────────────────────────────────────

interface EmojiParticleData {
  id: number;
  emoji: string;
  x: number;
  y: number;
  drift: number; // pre-computed random horizontal drift
}

const EmojiParticle: React.FC<{ data: EmojiParticleData }> = ({ data }) => (
  <motion.div
    className="pointer-events-none absolute text-sm select-none"
    style={{ left: `${data.x}%`, top: `${data.y}%` }}
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0.3, 1.2, 1, 0.6],
      y: [0, -30, -55, -75],
      x: [0, data.drift],
    }}
    transition={{ duration: 1.4, ease: "easeOut" }}
  >
    {data.emoji}
  </motion.div>
);

// ─── Ambient Sparkles Hook ────────────────────────────────────────────────────

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
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        size: Math.random() * 8 + 6,
      };
      setSparkles((prev) => [...prev.slice(-5), newSparkle]);

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
  // ── Text / typewriter state ──
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [prevText, setPrevText] = useState(text);

  // ── Interactive state ──
  const [isHovered, setIsHovered] = useState(false);
  const [clickSparkles, setClickSparkles] = useState<AmbientSparkle[]>([]);
  const [emojiParticles, setEmojiParticles] = useState<EmojiParticleData[]>([]);
  const [activeExpression, setActiveExpression] = useState<SiraExpression>(expression);
  const [prevExpression, setPrevExpression] = useState<SiraExpression>(expression);
  const [activeBubble, setActiveBubble] = useState<string>(text);
  const [prevActiveBubble, setPrevActiveBubble] = useState<string>(text);
  const [showTooltip, setShowTooltip] = useState(false);

  // ── Idle / sleeping state ──
  const [idleStage, setIdleStage] = useState<IdleStage>("active");

  // ── Cursor tilt ──
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Click combo tracking ──
  const hasGreetedRef = useRef(false);

  // ── Counters ──
  const sparkleCounterRef = useRef(0);
  const emojiCounterRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const ambientSparkles = useAmbientSparkles(interactive && isHovered);

  // ── Typewriter refs ──
  const charIndexRef = useRef(0);
  const contentRef = useRef("");

  // ───────────────────────────────────────────────────────────────────────
  // Render-phase state syncs (no useEffect)
  // ───────────────────────────────────────────────────────────────────────

  if (expression !== prevExpression) {
    setPrevExpression(expression);
    if (!isHovered && idleStage === "active") setActiveExpression(expression);
  }

  if (text !== prevText) {
    setPrevText(text);
    setActiveBubble(text);
    setPrevActiveBubble(text);
    setDisplayedText("");
    setIsTyping(!!text);
  }

  if (activeBubble !== prevActiveBubble) {
    setPrevActiveBubble(activeBubble);
    setDisplayedText("");
    setIsTyping(!!activeBubble);
  }

  // ───────────────────────────────────────────────────────────────────────
  // Typewriter effect
  // ───────────────────────────────────────────────────────────────────────

  useEffect(() => {
    charIndexRef.current = 0;
    contentRef.current = activeBubble;

    if (!activeBubble) return;

    const timer = setInterval(() => {
      charIndexRef.current += 1;
      const idx = charIndexRef.current;
      const content = contentRef.current;

      if (idx <= content.length) {
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

  // ───────────────────────────────────────────────────────────────────────
  // Idle → Wiggle → Yawn → Sleep progression
  // ───────────────────────────────────────────────────────────────────────

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleStage("active");

    if (!interactive) return;

    // Stage 1: Wiggle at 8s
    idleTimerRef.current = setTimeout(() => {
      setIdleStage("wiggle");
    }, 8000);
  }, [interactive]);

  useEffect(() => {
    if (!interactive) return;
    const raf = requestAnimationFrame(() => resetIdleTimer());
    return () => {
      cancelAnimationFrame(raf);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [interactive, resetIdleTimer]);

  // ───────────────────────────────────────────────────────────────────────
  // Cursor-follow tilt
  // ───────────────────────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive || shouldReduceMotion) return;
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1..1 range, then scale to degrees
    const rawX = (e.clientX - centerX) / (rect.width / 2);
    const rawY = (e.clientY - centerY) / (rect.height / 2);
    const maxTilt = 8;

    setTiltY(Math.max(-maxTilt, Math.min(maxTilt, rawX * maxTilt)));
    setTiltX(Math.max(-maxTilt, Math.min(maxTilt, -rawY * maxTilt * 0.5)));
  }, [interactive, shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
    setIsHovered(false);
    setShowTooltip(false);
  }, []);

  // ───────────────────────────────────────────────────────────────────────
  // Spawn emoji particles
  // ───────────────────────────────────────────────────────────────────────

  const spawnEmojis = useCallback((count: number) => {
    const newEmojis: EmojiParticleData[] = Array.from({ length: count }, () => ({
      id: emojiCounterRef.current++,
      emoji: REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)],
      x: Math.random() * 70 + 15,
      y: Math.random() * 50 + 20,
      drift: (Math.random() - 0.5) * 30,
    }));
    setEmojiParticles((prev) => [...prev, ...newEmojis]);
    setTimeout(() => {
      setEmojiParticles((prev) =>
        prev.filter((e) => !newEmojis.some((ne) => ne.id === e.id))
      );
    }, 1500);
  }, []);

  // ───────────────────────────────────────────────────────────────────────
  // Spawn sparkles burst
  // ───────────────────────────────────────────────────────────────────────

  const spawnSparkles = useCallback((count: number) => {
    const newSparkles: AmbientSparkle[] = Array.from({ length: count }, () => ({
      id: sparkleCounterRef.current++,
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
  }, []);

  // ───────────────────────────────────────────────────────────────────────
  // Show dialog with auto-revert
  // ───────────────────────────────────────────────────────────────────────

  const showDialog = useCallback((dialog: string, expr: SiraExpression, revertMs?: number) => {
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    setActiveExpression(expr);
    setActiveBubble(dialog);

    const delay = revertMs ?? (dialog.length * 25 + 2500);
    revertTimerRef.current = setTimeout(() => {
      setActiveExpression(expression);
      setActiveBubble(text);
    }, delay);
  }, [expression, text]);

  // ───────────────────────────────────────────────────────────────────────
  // Click handler
  // ───────────────────────────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    if (!interactive) return;

    resetIdleTimer();

    // Normal click
    // First click ever → time greeting
    let dialog: string;
    if (!hasGreetedRef.current) {
      dialog = getTimeGreeting();
      hasGreetedRef.current = true;
    } else {
      dialog = SIRA_DIALOGS[Math.floor(Math.random() * SIRA_DIALOGS.length)];
    }
    showDialog(dialog, "speaking");
    spawnSparkles(6);
    spawnEmojis(2);
  }, [interactive, resetIdleTimer, showDialog, spawnSparkles, spawnEmojis]);



  // ───────────────────────────────────────────────────────────────────────
  // Cleanup on unmount
  // ───────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  // ───────────────────────────────────────────────────────────────────────
  // Derived values
  // ───────────────────────────────────────────────────────────────────────

  const resolvedSrc = avatarSrc
    ? avatarSrc
    : useGif
    ? "/assets/avatar/Sira_1.gif"
    : EXPRESSION_MAP[activeExpression];

  const bubbleContent = activeBubble || text;

  // Float animation varies by idle stage
  const getFloatAnimation = () => {
    if (shouldReduceMotion) return {};
    if (idleStage === "wiggle") return { rotate: [0, -4, 4, -3, 3, 0], y: [0, -5, 0] };
    return { y: [0, -6, 0] };
  };

  const getFloatTransition = () => {
    if (shouldReduceMotion) return {};
    if (idleStage === "wiggle") return { duration: 0.8, ease: "easeInOut" as const };
    return { repeat: Infinity, duration: 4, ease: "easeInOut" as const };
  };

  // ───────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapperRef}
      className={`flex flex-col md:flex-row items-center md:items-end gap-6 max-w-xl ${className}`}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
    >

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

        <motion.div
          className={`w-48 h-64 md:w-48 md:h-64 lg:w-56 lg:h-72 relative select-none ${interactive ? "cursor-pointer" : ""}`}
          style={{
            perspective: 400,
            transform: !shouldReduceMotion && interactive
              ? `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
              : undefined,
            transition: "transform 0.15s ease-out",
          }}
          animate={getFloatAnimation()}
          transition={getFloatTransition()}
          // Hover scale
          whileHover={interactive && !shouldReduceMotion ? { scale: 1.07 } : {}}
          whileTap={interactive && !shouldReduceMotion ? { scale: 0.96 } : {}}
          onHoverStart={() => {
            if (!interactive) return;
            setIsHovered(true);
            setShowTooltip(true);
          }}
          onClick={handleClick}
        >

          {/* Expression crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedSrc}
              className={`absolute inset-0${flipAvatar ? " scale-x-[-1]" : ""}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "saturate(1)",
              }}
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
              key={`a-${s.id}`}
              size={s.size}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            />
          ))}

          {/* Click burst sparkles */}
          {clickSparkles.map((s) => (
            <Sparkle
              key={`c-${s.id}`}
              size={s.size}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            />
          ))}

          {/* Emoji reaction particles */}
          {emojiParticles.map((e) => (
            <EmojiParticle key={`e-${e.id}`} data={e} />
          ))}
        </motion.div>
      </div>

    </div>
  );
};
