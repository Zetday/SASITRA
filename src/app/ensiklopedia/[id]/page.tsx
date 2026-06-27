"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Sparkles, Wand2, Paintbrush, HelpCircle } from "lucide-react";
import { useDatabase } from "../../../store/useDatabase";
import { Navbar } from "../../../components/shared/Navbar";
import { Footer } from "../../../components/shared/Footer";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MotifDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { motifs, currentUser, favorites, toggleFavorite } = useDatabase();
  
  const motif = motifs.find(m => m.id === id);

  // Customizer State: Colors
  const [colors, setColors] = useState({
    background: "#FAF3E0",
    main: "#8B1A1A",
    accent: "#C5960C",
    jelujur: "#3D1C0B"
  });

  // Product Mockup Tab
  const [activeProductTab, setActiveProductTab] = useState<"shirt" | "bag" | "cushion" | "scarf">("shirt");

  const [prevMotifId, setPrevMotifId] = useState<string | null>(null);

  if (motif && motif.id !== prevMotifId) {
    setPrevMotifId(motif.id);
    setColors({
      main: motif.warna_tradisional[0] || "#8B1A1A",
      accent: motif.warna_tradisional[1] || "#C5960C",
      background: motif.warna_tradisional[2] || "#FAF3E0",
      jelujur: motif.warna_tradisional[3] || "#3D1C0B"
    });
  }

  if (!motif) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark items-center justify-center p-6">
        <Navbar />
        <Card variant="glass-light" className="text-center p-8 max-w-md flex flex-col items-center gap-4">
          <HelpCircle className="h-12 w-12 text-primary animate-bounce" />
          <h1 className="font-serif text-2xl font-bold text-primary">Motif Tidak Ditemukan</h1>
          <p className="text-sm text-text-dark/70">Motif yang Anda cari tidak tersedia di ensiklopedia kami.</p>
          <Link href="/ensiklopedia">
            <Button size="sm">Kembali ke Katalog</Button>
          </Link>
        </Card>
        <Footer />
      </div>
    );
  }

  const isFavorited = favorites.includes(motif.id);

  const handleFavoriteClick = () => {
    if (!currentUser) {
      alert("Silakan masuk (login) terlebih dahulu untuk menyimpan motif favorit!");
      router.push("/auth");
      return;
    }
    toggleFavorite(motif.id);
  };

  // Color Preset Handler
  const applyPreset = (bg: string, main: string, accent: string, jelujur: string) => {
    setColors({ background: bg, main, accent, jelujur });
  };

  const handleTryOnRedirect = () => {
    if (!currentUser) {
      alert("Silakan masuk (login) terlebih dahulu untuk mencoba motif secara virtual!");
      router.push("/auth?redirect=/try-on");
      return;
    }
    // Save design state in query params and redirect
    const colorStr = `${colors.background.replace("#", "")}_${colors.main.replace("#", "")}_${colors.accent.replace("#", "")}_${colors.jelujur.replace("#", "")}`;
    router.push(`/try-on?motif=${motif.id}&colors=${colorStr}`);
  };

  // Helper to render dynamically colored SVG
  const renderColoredSVG = (scale = 1) => {
    return (
      <svg viewBox={motif.viewBox || "0 0 100 100"} className="w-full h-full drop-shadow-md">
        {motif.paths.map((path, idx) => {
          let fill = "transparent";
          let stroke = "none";
          if (path.role === "background") fill = colors.background;
          else if (path.role === "main") fill = colors.main;
          else if (path.role === "accent") fill = colors.accent;
          else if (path.role === "jelujur") stroke = colors.jelujur;

          return (
            <path
              key={idx}
              d={path.d}
              fill={fill}
              stroke={stroke}
              strokeWidth={path.strokeWidth ? path.strokeWidth * scale : undefined}
              strokeDasharray={path.strokeDasharray}
              fillRule={path.fillRule}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 pt-32 pb-24 flex flex-col gap-12">
        {/* Back Link */}
        <Link href="/ensiklopedia" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider hover:underline w-max">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Ensiklopedia
        </Link>

        {/* Motif Info and Customizer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Text Info & History */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start gap-4">
                <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-primary leading-tight">
                  {motif.nama_motif}
                </h1>
                <button
                  onClick={handleFavoriteClick}
                  className={`h-11 w-11 rounded-full border border-secondary/20 flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-90 ${
                    isFavorited ? "bg-red-50 text-red-600" : "bg-white text-text-dark/50 hover:text-red-500"
                  }`}
                  title={isFavorited ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-600 stroke-red-600" : ""}`} />
                </button>
              </div>
              <span className="text-xs font-bold text-secondary-dark bg-secondary/15 px-3 py-1 rounded-full uppercase tracking-wider w-max">
                Kategori: {motif.kategori}
              </span>
            </div>

            <div className="flex flex-col gap-6 border-t border-secondary/15 pt-6">
              <div className="flex flex-col gap-2">
                <h3 className="font-serif font-bold text-lg text-primary-dark">
                  Deskripsi Motif
                </h3>
                <p className="text-sm text-text-dark/80 leading-relaxed font-sans">
                  {motif.deskripsi}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-serif font-bold text-lg text-primary-dark">
                  Makna & Filosofi Budaya
                </h3>
                <Card variant="glass-light" className="border-l-4 border-l-secondary rounded-l-none border-secondary/10 p-4">
                  <p className="text-xs md:text-sm text-text-dark/90 leading-relaxed italic">
                    &ldquo;{motif.makna_filosofi}&rdquo;
                  </p>
                </Card>
              </div>

              {motif.sejarah && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif font-bold text-lg text-primary-dark">
                    Sejarah Motif
                  </h3>
                  <p className="text-sm text-text-dark/80 leading-relaxed font-sans">
                    {motif.sejarah}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Studio (Customizer & Mockups) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Color Customizer Panel */}
            <Card className="bg-white border border-secondary/10 p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-secondary/10 pb-4">
                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                  <Paintbrush className="h-5 w-5 text-secondary" /> Studio Warna Motif
                </h3>
                <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">
                  Kustomisasi Real-Time
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* SVG Visualizer */}
                <div className="md:col-span-6 aspect-square w-full rounded-2xl bg-bg-cream/40 border border-secondary/15 p-6 flex items-center justify-center">
                  {renderColoredSVG()}
                </div>

                {/* Color Input Controls */}
                <div className="md:col-span-6 flex flex-col gap-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-dark/60">
                    Pilih Warna Lapisan:
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Layer 1: Bg */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-text-dark/60 uppercase">Background</span>
                      <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2.5 py-1.5 bg-bg-cream/20">
                        <input
                          type="color"
                          value={colors.background}
                          onChange={(e) => setColors(prev => ({ ...prev, background: e.target.value }))}
                          className="w-7 h-7 rounded-full border-0 cursor-pointer overflow-hidden bg-transparent"
                        />
                        <span className="text-xs font-mono font-semibold uppercase">{colors.background}</span>
                      </div>
                    </div>

                    {/* Layer 2: Main */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-text-dark/60 uppercase">Utama (Main)</span>
                      <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2.5 py-1.5 bg-bg-cream/20">
                        <input
                          type="color"
                          value={colors.main}
                          onChange={(e) => setColors(prev => ({ ...prev, main: e.target.value }))}
                          className="w-7 h-7 rounded-full border-0 cursor-pointer overflow-hidden bg-transparent"
                        />
                        <span className="text-xs font-mono font-semibold uppercase">{colors.main}</span>
                      </div>
                    </div>

                    {/* Layer 3: Accent */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-text-dark/60 uppercase">Aksen (Accent)</span>
                      <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2.5 py-1.5 bg-bg-cream/20">
                        <input
                          type="color"
                          value={colors.accent}
                          onChange={(e) => setColors(prev => ({ ...prev, accent: e.target.value }))}
                          className="w-7 h-7 rounded-full border-0 cursor-pointer overflow-hidden bg-transparent"
                        />
                        <span className="text-xs font-mono font-semibold uppercase">{colors.accent}</span>
                      </div>
                    </div>

                    {/* Layer 4: Jelujur */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-text-dark/60 uppercase">Jelujur Stitch</span>
                      <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2.5 py-1.5 bg-bg-cream/20">
                        <input
                          type="color"
                          value={colors.jelujur}
                          onChange={(e) => setColors(prev => ({ ...prev, jelujur: e.target.value }))}
                          className="w-7 h-7 rounded-full border-0 cursor-pointer overflow-hidden bg-transparent"
                        />
                        <span className="text-xs font-mono font-semibold uppercase">{colors.jelujur}</span>
                      </div>
                    </div>
                  </div>

                  {/* Traditional Presets */}
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] font-bold text-text-dark/60 uppercase">Preset Warna Tradisional:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <Button variant="outline" size="sm" className="h-8 text-[10px] px-3.5 py-0 border-secondary/20 text-text-dark" onClick={() => applyPreset("#FAF3E0", "#8B1A1A", "#C5960C", "#3D1C0B")}>
                        🍂 Jingga Tradisional
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] px-3.5 py-0 border-secondary/20 text-text-dark" onClick={() => applyPreset("#F5E6D3", "#16A34A", "#C5960C", "#3D1C0B")}>
                        🌿 Hijau Pandan
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] px-3.5 py-0 border-secondary/20 text-text-dark" onClick={() => applyPreset("#1A1A2E", "#C5960C", "#FAF3E0", "#9A7206")}>
                        🌌 Emas Malam
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] px-3.5 py-0 border-secondary/20 text-text-dark" onClick={() => applyPreset("#FAF3E0", "#0284C7", "#16A34A", "#8B1A1A")}>
                        🌊 Sungai Barito
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </Card>

            {/* Product Mockup Preview Panel */}
            <Card className="bg-white border border-secondary/10 p-6 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-secondary/10 pb-4">
                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" /> Visualisasi Produk
                </h3>
                
                {/* Product Select Tabs */}
                <div className="flex gap-1.5 p-1 bg-secondary/10 rounded-full w-max text-xs">
                  <button
                    onClick={() => setActiveProductTab("shirt")}
                    className={`px-4 py-1.5 rounded-full font-bold uppercase transition-colors ${activeProductTab === "shirt" ? "bg-primary text-text-light" : "text-text-dark/70 hover:text-primary"}`}
                  >
                    👔 Kemeja
                  </button>
                  <button
                    onClick={() => setActiveProductTab("bag")}
                    className={`px-4 py-1.5 rounded-full font-bold uppercase transition-colors ${activeProductTab === "bag" ? "bg-primary text-text-light" : "text-text-dark/70 hover:text-primary"}`}
                  >
                    👜 Tas
                  </button>
                  <button
                    onClick={() => setActiveProductTab("cushion")}
                    className={`px-4 py-1.5 rounded-full font-bold uppercase transition-colors ${activeProductTab === "cushion" ? "bg-primary text-text-light" : "text-text-dark/70 hover:text-primary"}`}
                  >
                    🛋️ Bantal
                  </button>
                  <button
                    onClick={() => setActiveProductTab("scarf")}
                    className={`px-4 py-1.5 rounded-full font-bold uppercase transition-colors ${activeProductTab === "scarf" ? "bg-primary text-text-light" : "text-text-dark/70 hover:text-primary"}`}
                  >
                    🧣 Selendang
                  </button>
                </div>
              </div>

              {/* Interactive Vector Mockup Canvas */}
              <div className="aspect-video w-full rounded-2xl bg-bg-cream/30 border border-secondary/10 flex items-center justify-center p-6 relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-lg overflow-visible">
                  
                  {/* Definition for the custom pattern */}
                  <defs>
                    <pattern id="motif-custom-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <g transform="scale(0.2)">
                        {motif.paths.map((path, idx) => {
                          let fill = "transparent";
                          let stroke = "none";
                          if (path.role === "background") fill = colors.background;
                          else if (path.role === "main") fill = colors.main;
                          else if (path.role === "accent") fill = colors.accent;
                          else if (path.role === "jelujur") stroke = colors.jelujur;

                          return (
                            <path
                              key={idx}
                              d={path.d}
                              fill={fill}
                              stroke={stroke}
                              strokeWidth={path.strokeWidth ? path.strokeWidth * 1.5 : undefined}
                              strokeDasharray={path.strokeDasharray}
                              fillRule={path.fillRule}
                            />
                          );
                        })}
                      </g>
                    </pattern>
                  </defs>

                  {/* Render based on active mockup tab */}
                  {activeProductTab === "shirt" && (
                    <g>
                      {/* Shirt Body filled with custom pattern */}
                      <path d="M 20 20 L 35 15 L 50 20 L 65 15 L 80 20 L 75 85 L 25 85 Z" fill="url(#motif-custom-pattern)" stroke="#3D1C0B" strokeWidth="1" />
                      {/* Left Sleeve */}
                      <path d="M 20 20 L 5 35 L 12 45 L 21 35 Z" fill="url(#motif-custom-pattern)" stroke="#3D1C0B" strokeWidth="1" />
                      {/* Right Sleeve */}
                      <path d="M 80 20 L 95 35 L 88 45 L 79 35 Z" fill="url(#motif-custom-pattern)" stroke="#3D1C0B" strokeWidth="1" />
                      {/* Collar (Maroon/Accent) */}
                      <path d="M 35 15 L 50 32 L 65 15 L 50 18 Z" fill={colors.main} stroke="#3D1C0B" strokeWidth="1" />
                      {/* Button Strip */}
                      <rect x="47.5" y="32" width="5" height="53" fill={colors.accent} stroke="#3D1C0B" strokeWidth="0.5" />
                      {/* Buttons */}
                      <circle cx="50" cy="40" r="1" fill="#FAF3E0" />
                      <circle cx="50" cy="52" r="1" fill="#FAF3E0" />
                      <circle cx="50" cy="64" r="1" fill="#FAF3E0" />
                      <circle cx="50" cy="76" r="1" fill="#FAF3E0" />
                    </g>
                  )}

                  {activeProductTab === "bag" && (
                    <g>
                      {/* Tote Bag Handles */}
                      <path d="M 35 40 C 35 15, 45 15, 45 40" fill="none" stroke={colors.main} strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M 55 40 C 55 15, 65 15, 65 40" fill="none" stroke={colors.main} strokeWidth="3.5" strokeLinecap="round" />
                      
                      {/* Tote Bag Body */}
                      <path d="M 25 40 L 75 40 L 70 95 L 30 95 Z" fill="url(#motif-custom-pattern)" stroke="#3D1C0B" strokeWidth="1.5" />
                      
                      {/* Leather Badge (Accent) */}
                      <rect x="43" y="60" width="14" height="8" rx="1.5" fill={colors.accent} stroke="#3D1C0B" strokeWidth="0.5" />
                      <circle cx="50" cy="64" r="1" fill="#1C1917" />
                    </g>
                  )}

                  {activeProductTab === "cushion" && (
                    <g>
                      {/* Pillow shape with rounded corners */}
                      <rect x="15" y="15" width="70" height="70" rx="12" fill="url(#motif-custom-pattern)" stroke="#3D1C0B" strokeWidth="1.5" />
                      {/* Crease line left */}
                      <path d="M 15 15 Q 30 35, 15 50" fill="none" stroke="#1C1917" strokeWidth="0.5" opacity="0.25" />
                      {/* Crease line right */}
                      <path d="M 85 15 Q 70 35, 85 50" fill="none" stroke="#1C1917" strokeWidth="0.5" opacity="0.25" />
                      {/* Corner tassels (Accent) */}
                      <circle cx="15" cy="15" r="3" fill={colors.accent} />
                      <circle cx="85" cy="15" r="3" fill={colors.accent} />
                      <circle cx="15" cy="85" r="3" fill={colors.accent} />
                      <circle cx="85" cy="85" r="3" fill={colors.accent} />
                    </g>
                  )}

                  {activeProductTab === "scarf" && (
                    <g>
                      {/* Hanging scarf body */}
                      <path d="M 35 10 L 65 10 L 68 85 L 32 85 Z" fill="url(#motif-custom-pattern)" stroke="#3D1C0B" strokeWidth="1" />
                      
                      {/* Fold highlights */}
                      <path d="M 45 10 L 48 85" fill="none" stroke="#1C1917" strokeWidth="0.5" opacity="0.15" />
                      <path d="M 55 10 L 52 85" fill="none" stroke="#1C1917" strokeWidth="0.5" opacity="0.15" />
                      
                      {/* Fringes (Accent) */}
                      <line x1="33" y1="85" x2="33" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="38" y1="85" x2="38" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="43" y1="85" x2="43" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="48" y1="85" x2="48" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="53" y1="85" x2="53" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="58" y1="85" x2="58" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="63" y1="85" x2="63" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="67" y1="85" x2="67" y2="92" stroke={colors.accent} strokeWidth="1.5" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Redirect to Try-On with params */}
              <Button onClick={handleTryOnRedirect} size="lg" className="w-full shadow-lg">
                <Wand2 className="mr-2 h-5 w-5" /> Terapkan ke Foto Saya (Try-On)
              </Button>
            </Card>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
