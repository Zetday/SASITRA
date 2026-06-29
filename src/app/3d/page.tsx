"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Lock, Check, Sliders, ShoppingBag, Layers } from "lucide-react";
import confetti from "canvas-confetti";
import { Navbar } from "../../components/shared/Navbar";
import { useDatabase } from "../../store/useDatabase";

// 20 Traditional motifs from motif_sasirangan/motif_dasar
const MOTIF_LIST = [
  { id: "01", name: "Hiris Pudak", file: "hiris_pudak.png" },
  { id: "02", name: "Kembang Kacang", file: "kembang_kacang.png" },
  { id: "03", name: "Bayam Raja", file: "bayam_raja.png" },
  { id: "04", name: "Kulat Karikit", file: "kulat_karikit.png" },
  { id: "05", name: "Ombak Sinapur Karang", file: "ombak_sinapur_karang.png" },
  { id: "06", name: "Bintang Bahambur", file: "bintang_bahambur.png" },
  { id: "07", name: "Naga Balimbur", file: "naga_balimbur.png" },
  { id: "08", name: "Jajumputan", file: "jajumputan.png" },
  { id: "09", name: "Turun Dayang", file: "turun_dayang.png" },
  { id: "10", name: "Kembang Tampuk Manggis", file: "kembang_tampuk_manggis.png" },
  { id: "11", name: "Daun Jaruju", file: "daun_jaruju.png" },
  { id: "12", name: "Kangkung Kaombakan", file: "kangkung_kaombakan.png" },
  { id: "13", name: "Gigi Haruan", file: "gigi_haruan.png" },
  { id: "14", name: "Kambang Sakaki", file: "kambang_sakaki.png" },
  { id: "15", name: "Ular Lidi", file: "ular_lidi.png" },
  { id: "16", name: "Mayang Maurai", file: "mayang_maurai.png" },
  { id: "17", name: "Ramak Sahang", file: "ramak_sahang.png" },
  { id: "18", name: "Gelombang", file: "gelombang.png" },
  { id: "19", name: "Daun Katu", file: "daun_katu.png" },
  { id: "20", name: "Hiris Gagatas", file: "hiris_gagatas.png" }
];

// 6 Products from sasirangan_now
const PRODUCT_LIST = [
  { id: "kemeja", name: "Pakaian", file: "kemeja.png" },
  { id: "tas", name: "Tas", file: "tas.png" },
  { id: "lampu", name: "Lampu", file: "lampu.png" },
  { id: "sepatu", name: "Sepatu", file: "sepatu.png" },
  { id: "topi", name: "Topi", file: "topi.png" },
  { id: "bantal", name: "Bantal", file: "sarung_bantal_guling.png" }
];

// Product centering configurations on background_8 spotlight stage (1200x800 canvas)
const PRODUCT_CONFIGS: Record<string, { w: number; h: number; dy: number }> = {
  kemeja: { w: 460, h: 460, dy: 10 },
  tas: { w: 320, h: 320, dy: 60 },
  lampu: { w: 300, h: 420, dy: 10 },
  sepatu: { w: 400, h: 330, dy: 50 },
  topi: { w: 350, h: 270, dy: 55 },
  bantal: { w: 400, h: 340, dy: 35 }
};

// 4 Color presets from mockup
const COLOR_PRESETS = [
  { colors: ["#713034", "#D29A2C", "#1C1917"] }, // Preset 1 (Maroon, Gold, Dark Brown)
  { colors: ["#435E43", "#EEDC82", "#2F1F17"] }, // Preset 2 (Green, Gold-Cream, Dark Brown)
  { colors: ["#3B2F5B", "#E3A857", "#FAF6EE"] }, // Preset 3 (Purple/Blue, Gold, Cream)
  { colors: ["#800020", "#E67E22", "#FFFDD0"] }  // Preset 4 (Burgundy, Orange, Light Cream)
];

export default function Customizer3DPage() {
  const { currentUser } = useDatabase();

  // Active configurations state
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_LIST[0]);
  const [selectedMotif, setSelectedMotif] = useState(MOTIF_LIST[4]); // default: Ombak Sinapur Karang
  const [colors, setColors] = useState<string[]>([...COLOR_PRESETS[0].colors]);
  const [motifScale, setMotifScale] = useState(0.85);
  const [motifRotation, setMotifRotation] = useState(0);

  // Interaction states
  const [hoveredMotif, setHoveredMotif] = useState<string | null>(null);

  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});

  // Clean image loading with in-memory cache to avoid flashes during changes
  const getCachedImage = (src: string, onLoad: (img: HTMLImageElement) => void) => {
    if (imageCacheRef.current[src]) {
      onLoad(imageCacheRef.current[src]);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      imageCacheRef.current[src] = img;
      onLoad(img);
    };
  };

  // Render loop triggering whenever a state variable updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use 800x800 square canvas for transparent product rendering
    canvas.width = 800;
    canvas.height = 800;

    // 1. Load Product Template
    getCachedImage(`/assets/sasirangan_now/${selectedProduct.file}`, (prodImg) => {
      // 2. Load Motif Mask
      getCachedImage(`/assets/motif_sasirangan/motif_dasar/${selectedMotif.file}`, (motImg) => {
        
        // Clear canvas (transparent background)
        ctx.clearRect(0, 0, 800, 800);

        // Get product dimensions
        const config = PRODUCT_CONFIGS[selectedProduct.id] || { w: 400, h: 400, dy: 0 };
        const px = 400 - config.w / 2;
        const py = 400 - config.h / 2 + config.dy;

        // Create an offscreen canvas to mask & blend pattern to product
        const patternCanvas = document.createElement("canvas");
        patternCanvas.width = 800;
        patternCanvas.height = 800;
        const pCtx = patternCanvas.getContext("2d");

        if (pCtx) {
          // Draw product template on pattern canvas
          pCtx.drawImage(prodImg, px, py, config.w, config.h);

          // Create offscreen single tile for sasirangan motif (3 layers with slight offsets)
          const tileCanvas = document.createElement("canvas");
          const tileSize = 160;
          tileCanvas.width = tileSize;
          tileCanvas.height = tileSize;
          const tCtx = tileCanvas.getContext("2d");

          if (tCtx) {
            const drawLayer = (color: string, dx: number, dy: number) => {
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = tileSize;
              tempCanvas.height = tileSize;
              const tempCtx = tempCanvas.getContext("2d");
              if (!tempCtx) return;

              // Draw motif stencil
              tempCtx.drawImage(motImg, 0, 0, tileSize, tileSize);
              // Color the stencil
              tempCtx.globalCompositeOperation = "source-in";
              tempCtx.fillStyle = color;
              tempCtx.fillRect(0, 0, tileSize, tileSize);

              // Draw on the main tile with wrapped boundaries to prevent seam lines
              tCtx.drawImage(tempCanvas, dx, dy);
              tCtx.drawImage(tempCanvas, dx - tileSize, dy);
              tCtx.drawImage(tempCanvas, dx + tileSize, dy);
              tCtx.drawImage(tempCanvas, dx, dy - tileSize);
              tCtx.drawImage(tempCanvas, dx, dy + tileSize);
            };

            // Render three layered offsets
            drawLayer(colors[0], -10, -10);
            drawLayer(colors[1], 0, 0);
            drawLayer(colors[2], 10, 10);
          }

          // Fill pattern with scale & rotation matrix on product template
          const pattern = pCtx.createPattern(tileCanvas, "repeat");
          if (pattern) {
            const matrix = new DOMMatrix();
            matrix.scaleSelf(motifScale, motifScale);
            matrix.rotateSelf(motifRotation);
            pattern.setTransform(matrix);

            pCtx.globalCompositeOperation = "source-atop";
            pCtx.fillStyle = pattern;
            pCtx.fillRect(0, 0, 800, 800);
          }

          // Blend shaded highlights and folds back on top using multiply blending
          pCtx.globalCompositeOperation = "multiply";
          pCtx.drawImage(prodImg, px, py, config.w, config.h);
        }

        // Composite the finished product pattern on the main canvas
        ctx.drawImage(patternCanvas, 0, 0);
      });
    });
  }, [selectedProduct, selectedMotif, colors, motifScale, motifRotation]);

  useEffect(() => {
    // Warm background cache
    const img = new window.Image();
    img.src = "/assets/background/background_8.png";
  }, []);

  const handleColorChange = (index: number, value: string) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  const applyPreset = (presetColors: string[]) => {
    setColors([...presetColors]);
  };

  const handleDownload = () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk mengunduh hasil desain.");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger success confetti animation
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Create a temporary 1200x800 canvas for high-quality export with the background
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1200;
    exportCanvas.height = 800;
    const eCtx = exportCanvas.getContext("2d");

    if (eCtx) {
      // Load background image, draw it, and overlay the transparent product canvas
      getCachedImage("/assets/background/background_8.png", (bgImg) => {
        eCtx.drawImage(bgImg, 0, 0, 1200, 800);
        
        // Draw the transparent canvas content centered (at x: 200, y: 0 on 1200x800 surface)
        eCtx.drawImage(canvas, 200, 0, 800, 800);

        const link = document.createElement("a");
        link.download = `sasitra-3d-${selectedProduct.id}-${selectedMotif.name.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = exportCanvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg-cream text-text-dark select-none">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden mt-20 relative custom-3d-bg">
        
        {/* ========================================================
            LEFT SIDEBAR: PILIH MOTIF (Light Frosted Glass)
            ======================================================== */}
        <section className="w-full lg:w-80 bg-[#FFFDF9]/85 backdrop-blur-md border-r border-secondary/15 flex flex-col h-120 lg:h-full shrink-0 relative z-10">
          <div className="p-5 border-b border-secondary/15 shrink-0 bg-transparent">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#A97340] shrink-0" />
              <h2 className="font-serif font-bold text-lg text-primary tracking-wide uppercase">
                Pilih Motif
              </h2>
            </div>
            <p className="font-sans text-[11px] text-text-dark/65 mt-1 leading-relaxed">
              Pilih motif favorit Anda untuk diterapkan pada produk
            </p>
          </div>

          {/* Motif Card Grid with hover text name overlay */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-transparent">
            <div className="grid grid-cols-2 gap-3.5">
              {MOTIF_LIST.map((motif) => {
                const isSelected = selectedMotif.id === motif.id;
                return (
                  <button
                    key={motif.id}
                    onClick={() => setSelectedMotif(motif)}
                    onMouseEnter={() => setHoveredMotif(motif.id)}
                    onMouseLeave={() => setHoveredMotif(null)}
                    className={`relative aspect-square rounded-2xl bg-[#FAF6EE] border-2 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
                      isSelected 
                        ? "border-[#A37F55] scale-[0.98] ring-3 ring-[#A37F55]/15" 
                        : "border-secondary/15 hover:border-secondary/35"
                    }`}
                  >
                    {/* Full repeated motif pattern */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        hoveredMotif === motif.id ? "opacity-30" : "opacity-95"
                      }`}
                      style={{
                        backgroundImage: `url('/assets/motif_sasirangan/motif_dasar/${motif.file}')`,
                        backgroundRepeat: "repeat",
                        backgroundPosition: "center",
                        backgroundSize: "340px 340px",
                      }}
                    />

                    {/* Dark text overlay visible on hovered card */}
                    <AnimatePresence>
                      {hoveredMotif === motif.id && (
                        <motion.div 
                          className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex items-center justify-center p-2 text-center z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <span className="font-sans text-xs font-bold text-[#FFFDF9] tracking-wide leading-tight">
                            {motif.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Golden checkmark for active item */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#A37F55] rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-2.5 w-2.5 text-[#FFFDF9]" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            CENTER PANEL: SPOTLIGHT CANVAS STAGE
            ======================================================== */}
        <section className="flex-1 flex flex-col items-center justify-center relative p-4 md:p-8 h-100 sm:h-120 md:h-150 lg:h-full overflow-hidden bg-transparent">
          
          {/* Active Product Title Capsule top center */}
          <div className="absolute top-6 z-20 flex flex-col items-center gap-2">
            <div className="bg-[#713034]/95 border-2 border-[#A37F55] px-8 py-2.5 rounded-full shadow-2xl backdrop-blur-md min-w-44 text-center">
              <span className="font-serif text-white font-bold text-base tracking-widest uppercase">
                {selectedProduct.name}
              </span>
            </div>
          </div>

          {/* Interactive Canvas container with premium float animation */}
          <motion.div 
            className="relative w-full max-w-md md:max-w-lg aspect-square flex items-center justify-center"
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >

            
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain drop-shadow-[0_25px_55px_rgba(0,0,0,0.55)] z-10"
            />
          </motion.div>
        </section>

        {/* ========================================================
            RIGHT SIDEBAR: PANEL KONTROL (Light Frosted Glass Panel)
            ======================================================== */}
        <section className="w-full lg:w-96 bg-[#FFFDF9]/85 backdrop-blur-md border-l border-secondary/15 flex flex-col h-auto lg:h-full shrink-0 overflow-y-auto custom-scrollbar p-6 gap-6 z-10">
          
          {/* Pilih Produk Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold text-text-dark/75 uppercase tracking-wider">
              Pilih Produk
            </label>
            <div className="relative">
              <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#A97340] z-10" />
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const prod = PRODUCT_LIST.find(p => p.id === e.target.value);
                  if (prod) setSelectedProduct(prod);
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-secondary/20 bg-white/90 font-sans text-sm font-bold text-text-dark shadow-sm outline-none focus:border-[#A97340] transition-all cursor-pointer appearance-none backdrop-blur-sm"
              >
                {PRODUCT_LIST.map(p => (
                  <option key={p.id} value={p.id} className="bg-white text-text-dark">
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-text-dark/60 h-0 w-0" />
            </div>
          </div>

          {/* Customizer Panel */}
          <div className="bg-white/90 backdrop-blur-lg border border-secondary/15 rounded-2xl p-5 shadow-md flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-[#A97340]/10 border border-[#A97340]/25 rounded-lg flex items-center justify-center text-[#A97340] shrink-0">
                <Sliders className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif font-bold text-sm text-primary uppercase">
                  Kostumisasi Produk
                </h3>
                <span className="font-sans text-[10px] text-text-dark/50 font-medium">
                  Atur tampilan motif pada produk Anda
                </span>
              </div>
            </div>

            <hr className="border-secondary/10" />

            {/* Warna Motif Pickers */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px bg-secondary/10 flex-1" />
                <span className="font-sans text-[10px] font-bold text-secondary-dark uppercase tracking-wider">
                  Warna Motif
                </span>
                <div className="h-px bg-secondary/10 flex-1" />
              </div>
              <div className="flex justify-center gap-4.5 mt-1">
                {colors.map((color, idx) => (
                  <div key={idx} className="relative group">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full z-10"
                    />
                    <div 
                      className="h-10 w-16 rounded-lg border-2 border-secondary/15 shadow-inner transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preset Warna */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px bg-secondary/10 flex-1" />
                <span className="font-sans text-[10px] font-bold text-secondary-dark uppercase tracking-wider">
                  Preset Warna
                </span>
                <div className="h-px bg-secondary/10 flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {COLOR_PRESETS.map((preset, idx) => {
                  const isMatch = colors.every((c, cIdx) => c === preset.colors[cIdx]);
                  return (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.colors)}
                      className={`flex gap-1.5 p-2 bg-neutral-50/50 rounded-xl border items-center justify-between cursor-pointer transition-all duration-200 ${
                        isMatch 
                          ? "border-[#A37F55] bg-[#A37F55]/5 shadow-sm" 
                          : "border-secondary/15 hover:border-secondary/35"
                      }`}
                    >
                      <div className="flex gap-1">
                        {preset.colors.map((c, cIdx) => (
                          <div key={cIdx} className="h-4.5 w-4.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center border ${
                        isMatch ? "bg-[#A37F55] border-[#A37F55]" : "border-secondary/35 bg-white"
                      }`}>
                        {isMatch && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ukuran Motif (Scale Slider) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] font-bold text-[#713034] uppercase tracking-wider">
                  Ukuran Motif
                </span>
                <span className="font-mono text-[10px] font-bold text-text-dark/70">{Math.round(motifScale * 100)}%</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0.30"
                  max="1.70"
                  step="0.05"
                  value={motifScale}
                  onChange={(e) => setMotifScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-secondary/15 rounded-lg appearance-none cursor-pointer accent-[#713034]"
                />
              </div>
              <span className="font-sans text-[9px] text-text-dark/45 font-medium -mt-1">
                Atur besar kecil motif pada produk Anda
              </span>
            </div>

            {/* Arah Motif (Rotation Slider) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] font-bold text-[#713034] uppercase tracking-wider">
                  Arah Motif
                </span>
                <span className="font-mono text-[10px] font-bold text-text-dark/70">{motifRotation}°</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={motifRotation}
                  onChange={(e) => setMotifRotation(parseInt(e.target.value))}
                  className="w-full h-1 bg-secondary/15 rounded-lg appearance-none cursor-pointer accent-[#713034]"
                />
              </div>
              <span className="font-sans text-[9px] text-text-dark/45 font-medium -mt-1">
                Atur rotasi atau kemiringan motif pada produk Anda
              </span>
            </div>

          </div>

          {/* Unduh button layout */}
          <div className="flex flex-col gap-2.5 mt-auto">
            <button
              onClick={handleDownload}
              className={`w-full py-4 rounded-xl font-serif text-base font-bold tracking-widest uppercase shadow-lg transition-all duration-300 flex items-center justify-center gap-3 border-2 cursor-pointer ${
                currentUser 
                  ? "bg-[#713034] border-[#A37F55] hover:bg-[#A37F55] hover:text-[#713034] hover:border-[#713034] text-white hover:scale-[1.02]" 
                  : "bg-white/5 border-secondary/15 text-text-dark/30 cursor-not-allowed"
              }`}
              disabled={!currentUser}
            >
              <Download className="h-4.5 w-4.5" />
              <span>Unduh</span>
            </button>
            
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#A97340]/5 rounded-xl border border-[#A97340]/15">
              <Lock className="h-3.5 w-3.5 text-[#A97340] shrink-0" />
              <span className="font-sans text-[10px] text-text-dark/70 font-semibold leading-snug">
                Unduh desain tersedia untuk pengguna yang sudah login
              </span>
            </div>
          </div>

        </section>

      </main>
      
      {/* Scrollbar and custom background styling injected inline */}
      <style jsx global>{`
        .custom-3d-bg {
          background-image: url('/assets/background/background_8.png');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(163, 127, 85, 0.25);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(163, 127, 85, 0.45);
        }
      `}</style>
    </div>
  );
}
